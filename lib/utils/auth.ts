import { auth } from "../firebase/config";
import { EXPIRY_TIME, TOKEN } from "../constants";
import { AuthActionTypes, AuthReducerType, AuthState } from "../types/auth";

export const getExpiryTimeFromToken = (token: string) => {
  const [, payload] = token.split(".");
  const { exp } = JSON.parse(atob(payload));
  return exp * 1000;
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
