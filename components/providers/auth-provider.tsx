"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  AuthActionTypes,
  AuthContextType,
  SignInFormData,
  SignUpFormData,
} from "@/lib/types/auth";
import {
  EXPIRY_TIME,
  SIGN_IN_SUCCESSFUL,
  TOKEN,
  USER_INFO,
} from "@/lib/constants";
import { useRouter } from "next/navigation";
import {
  authReducer,
  initailAuthState,
  refreshToken,
  setTokenAndExpiryTime,
} from "@/lib/utils/auth";
import { HOME, LOGIN } from "@/lib/routes";
import usePersistentReducer from "@/lib/hooks/use-persistent-reducer";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
  useSignInWithGithub,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import {
  auth,
  sendEmailVerification,
  updateProfile,
} from "@/lib/firebase/config";
import useToast from "@/lib/hooks/use-toast";
import { ToastTypeValues } from "@/lib/types/common";

const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider: React.FunctionComponent<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const router = useRouter();
  const { showToast, showErrorToast } = useToast();

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [createUserWithEmailAndPassword, , isSignUpLoading, signUpError] =
    useCreateUserWithEmailAndPassword(auth);
  const [signInWithEmailAndPassword, , isEmailSignInLoading, signInError] =
    useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, , isGoogleLoading] = useSignInWithGoogle(auth);
  const [signInWithGithub, , isGithubLoading, githubError] =
    useSignInWithGithub(auth);
  const [state, dispatch] = usePersistentReducer(
    authReducer,
    initailAuthState,
    USER_INFO
  );

  const isLoading = isGithubLoading || isGoogleLoading || isEmailSignInLoading;
  const errorMessages: { [key: string]: string } = {
    "auth/invalid-credential": "Invalid credentials. Please try again",
    "auth/email-already-in-use": "This email already exists!",
    "auth/account-exists-with-different-credential":
      "This account already exists with a different credential",
    "default-signup-error": "Could not create your account. Please try again",
  };

  const validateUser = async () => {
    try {
      const expiryTimeStr = localStorage.getItem(EXPIRY_TIME);
      const tokenExpireTime = expiryTimeStr ? JSON.parse(expiryTimeStr) : null;
      if (!(tokenExpireTime > Date.now())) {
        await refreshToken();
      }
    } catch (e) {
      setIsLoggedin(false);
      router.push(LOGIN);
    }
  };

  const storageEventListener = useCallback((event: any) => {
    if (event.key === TOKEN || event.key === EXPIRY_TIME) {
      if (
        !event.storageArea?.[TOKEN] ||
        !event.storageArea?.[EXPIRY_TIME] ||
        !event.storageArea?.[USER_INFO]
      ) {
        setIsLoggedin(false);
        router.push(LOGIN);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSignWithEmail = async (values: SignInFormData) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        values.email,
        values.password
      );

      if (userCredential && userCredential.user) {
        const payload = {
          uid: userCredential.user.uid,
          userName: userCredential.user.displayName,
          email: userCredential.user.email,
          userImage: userCredential.user.photoURL,
        };
        setTokenAndExpiryTime(userCredential.user);
        setIsLoggedin(true);
        dispatch({ type: AuthActionTypes.CREATE_USER, payload });
        router.push(HOME);
        showToast(SIGN_IN_SUCCESSFUL);
      }
    } catch (err) {
      showToast("Error signing in! Please try again.", ToastTypeValues.ERROR);
    }
  };

  const handleGoogleSignIn = async () => {
    const user = await signInWithGoogle();
    if (user) {
      const payload = {
        uid: user.user.uid,
        userName: user.user.displayName,
        email: user.user.email,
        userImage: user.user.photoURL,
      };
      setTokenAndExpiryTime(user.user);
      setIsLoggedin(true);
      dispatch({ type: AuthActionTypes.CREATE_USER, payload });
      showToast(SIGN_IN_SUCCESSFUL);
      router.push(HOME);
    }
  };

  const handleGitHubSignIn = async () => {
    const user = await signInWithGithub();
    if (user) {
      const payload = {
        uid: user.user.uid,
        userName: user.user.displayName,
        email: user.user.email,
        userImage: user.user.photoURL,
      };
      setTokenAndExpiryTime(user.user);
      setIsLoggedin(true);
      dispatch({ type: AuthActionTypes.CREATE_USER, payload });
      showToast(SIGN_IN_SUCCESSFUL);
      router.push(HOME);
    }
  };

  const handleSignUp = async (values: SignUpFormData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        values.email,
        values.password
      );

      if (userCredential && userCredential.user) {
        router.push(LOGIN);
        await updateProfile(userCredential.user, {
          displayName: `${values.firstname} ${values.lastname}`,
        });
        showToast("Your account is created successfully");

        if (!auth.currentUser?.emailVerified) {
          await sendEmailVerification(auth.currentUser as any);
        }
      }
    } catch (err) {
      showToast(
        "Error creating a user! Please try again.",
        ToastTypeValues.ERROR
      );
    }
  };

  useEffect(() => {
    if (signInError?.code) {
      const message =
        errorMessages[signInError.code] ||
        "An unknown error occurred during sign-in";
      showErrorToast(message);
    } else if (signUpError?.code) {
      const message =
        errorMessages[signUpError.code] ||
        errorMessages["default-signup-error"];
      showErrorToast(message);
    } else if (githubError?.code) {
      const message =
        errorMessages[githubError.code] ||
        "An unknown error occurred during GitHub authentication";
      showErrorToast(message);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signInError, signUpError, githubError]);

  useEffect(() => {
    window.addEventListener("storage", storageEventListener);
    return () => {
      window.removeEventListener("storage", storageEventListener);
    };
  }, [storageEventListener]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isLoggedin) {
      interval = setInterval(validateUser, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedin]);
  return (
    <AuthContext.Provider
      value={{
        isLoggedin,
        setIsLoggedin,
        state,
        dispatch,
        isGithubLoading,
        isGoogleLoading,
        isEmailSignInLoading,
        isSignUpLoading,
        isLoading,
        handleSignWithEmail,
        handleGoogleSignIn,
        handleGitHubSignIn,
        handleSignUp,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
