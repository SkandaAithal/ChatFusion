import { auth } from "../firebase/config";
import { EXPIRY_TIME, TOKEN, USER_INFO } from "../constants";
import { AuthActionTypes, AuthReducerType, AuthState } from "../types/auth";

export const getExpiryTimeFromToken = (token: string) => {
  const [, payload] = token.split(".");
  const { exp } = JSON.parse(atob(payload));
  return exp * 1000;
};

export const isUserValid = (isTokenExpireCheck = false) => {
  const accessToken = localStorage.getItem(TOKEN);
  const expiryTimeStr = localStorage.getItem(EXPIRY_TIME);
  const user = localStorage.getItem(USER_INFO);
  const userId = user ? JSON.parse(user).uid : null;
  const tokenExpireTime = expiryTimeStr ? JSON.parse(expiryTimeStr) : null;
  if (isTokenExpireCheck) {
    if (
      accessToken &&
      tokenExpireTime &&
      !(tokenExpireTime > Date.now()) &&
      userId
    ) {
      return true;
    } else {
      return false;
    }
  }
  if (
    accessToken &&
    tokenExpireTime &&
    tokenExpireTime > Date.now() &&
    userId
  ) {
    return true;
  }
  return false;
};

export const refreshToken = async () => {
  const user = auth.currentUser;
  if (user) {
    const idToken = user.getIdToken(true);
    const expiryTime = JSON.stringify(getExpiryTimeFromToken(await idToken));
    localStorage.setItem(TOKEN, await idToken);
    localStorage.setItem(EXPIRY_TIME, expiryTime);
  } else {
    throw new Error("No user logged in");
  }
};

export const setTokenAndExpiryTime = (user: any) => {
  const token = user.accessToken;
  const expire = JSON.stringify(user?.stsTokenManager?.expirationTime);
  localStorage.setItem(TOKEN, token);
  localStorage.setItem(EXPIRY_TIME, expire);
};

export const isBrowser = (): boolean => typeof window !== "undefined";

export const initailAuthState: AuthState = {
  uid: "",
  userName: "",
  email: "",
  userImage: "",
};

export const authReducer: AuthReducerType = (
  state = initailAuthState,
  action
) => {
  switch (action.type) {
    case AuthActionTypes.CREATE_USER:
      return {
        ...state,
        ...action.payload,
      };
    case AuthActionTypes.UPDATE_USER:
      return {
        ...state,
        ...action.payload,
      };
    case AuthActionTypes.SIGN_OUT_USER:
      return {
        ...state,
        ...initailAuthState,
      };
  }
};

export const authErrorMessages: { [key: string]: string } = {
  "auth/invalid-credential": "Invalid credentials. Please try again",
  "auth/email-already-in-use": "This email already exists!",
  "auth/account-exists-with-different-credential":
    "This account already exists with a different credential",
  "default-signup-error": "Could not create your account. Please try again",
};
