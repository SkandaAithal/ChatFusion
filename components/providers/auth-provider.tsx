"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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

  const isLoading = useMemo(
    () => isGithubLoading || isGoogleLoading || isEmailSignInLoading,
    [isGithubLoading, isGoogleLoading, isEmailSignInLoading]
  );
  const errorMessages: { [key: string]: string } = useMemo(
    () => ({
      "auth/invalid-credential": "Invalid credentials. Please try again",
      "auth/email-already-in-use": "This email already exists!",
      "auth/account-exists-with-different-credential":
        "This account already exists with a different credential",
      "default-signup-error": "Could not create your account. Please try again",
    }),
    []
  );

  const validateUser = useCallback(async () => {
    try {
      const expiryTimeStr = localStorage.getItem(EXPIRY_TIME);
      const tokenExpireTime = expiryTimeStr ? JSON.parse(expiryTimeStr) : null;
      const user = localStorage.getItem(USER_INFO);
      const userId = user ? JSON.parse(user).uid : null;
      if (!(tokenExpireTime > Date.now()) && userId) {
        await refreshToken();
      }
    } catch (e) {
      setIsLoggedin(false);
      router.push(LOGIN);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleAuth = useCallback(
    async (authMethod: () => Promise<any>, redirectUrl: string) => {
      try {
        const userCredential = await authMethod();
        if (userCredential?.user) {
          const payload = {
            uid: userCredential.user.uid,
            userName: userCredential.user.displayName,
            email: userCredential.user.email,
            userImage: userCredential.user.photoURL,
          };
          setTokenAndExpiryTime(userCredential.user);
          setIsLoggedin(true);
          dispatch({ type: AuthActionTypes.CREATE_USER, payload });
          showToast(SIGN_IN_SUCCESSFUL);
          router.push(redirectUrl);
        }
      } catch (err) {
        showErrorToast("Error signing in! Please try again.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSignWithEmail = useCallback((values: SignInFormData) => {
    handleAuth(
      () => signInWithEmailAndPassword(values.email, values.password),
      HOME
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogleSignIn = useCallback(
    () => handleAuth(signInWithGoogle, HOME),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleGitHubSignIn = useCallback(
    () => handleAuth(signInWithGithub, HOME),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSignUp = useCallback(
    async (values: SignUpFormData) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          values.email,
          values.password
        );
        if (userCredential?.user) {
          await updateProfile(userCredential.user, {
            displayName: `${values.firstname} ${values.lastname}`,
          });
          router.push(LOGIN);
          showToast("Your account is created successfully");

          if (!auth.currentUser?.emailVerified && auth.currentUser) {
            await sendEmailVerification(auth.currentUser);
          }
        }
      } catch (err) {
        showErrorToast("Error creating a user! Please try again.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
      interval = setInterval(validateUser, 3000);
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
