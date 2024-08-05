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
import { SIGN_IN_SUCCESSFUL, USER_INFO } from "@/lib/constants";
import { useRouter, useSearchParams } from "next/navigation";
import {
  authErrorMessages,
  authReducer,
  initailAuthState,
} from "@/lib/utils/auth";
import { HOME, LOGIN, USER_AUTH_API } from "@/lib/routes";
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
import usePostMutation from "../hooks/use-post-mutation";
import { getAPIUrl } from "../utils";
import { ToastTypeValues } from "../types/hooks/use-toast";
const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider: React.FunctionComponent<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const router = useRouter();
  const queryparams = useSearchParams();
  const redirectUrl = queryparams.get("redirect");
  const { showToast, showErrorToast } = useToast();
  const { performPostRequest, isSuccess } = usePostMutation();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(false);
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
    () =>
      isGithubLoading ||
      isGoogleLoading ||
      isEmailSignInLoading ||
      isAuthLoading,
    [isGithubLoading, isGoogleLoading, isEmailSignInLoading, isAuthLoading]
  );

  useEffect(() => {
    if (redirectUrl) {
      showToast("Session expired! Please login", ToastTypeValues.WARNING);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [redirectUrl]);

  useEffect(() => {
    const error = signInError || signUpError || githubError;

    if (error?.code) {
      const errorMessage =
        authErrorMessages[error.code] ||
        (signInError && "An unknown error occurred during sign-in") ||
        (signUpError && authErrorMessages["default-signup-error"]) ||
        (githubError &&
          "An unknown error occurred during GitHub authentication");

      showErrorToast(errorMessage as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signInError, signUpError, githubError]);

  useEffect(() => {
    if (isSuccess) {
      router.push(redirectUrl ? redirectUrl : HOME);
      showToast(SIGN_IN_SUCCESSFUL);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess]);

  const handleAuth = useCallback(
    async (authMethod: () => Promise<any>) => {
      try {
        const userCredential = await authMethod();
        if (userCredential?.user) {
          setIsAuthLoading(true);
          const payload = {
            uid: userCredential.user.uid,
            userName: userCredential.user.displayName,
            email: userCredential.user.email,
            userImage: userCredential.user.photoURL,
          };

          performPostRequest(getAPIUrl(USER_AUTH_API), payload);
          setIsLoggedin(true);
          dispatch({ type: AuthActionTypes.CREATE_USER, payload });
        }
      } catch (err) {
        showErrorToast("Error signing in! Please try again.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSignWithEmail = useCallback((values: SignInFormData) => {
    handleAuth(() => signInWithEmailAndPassword(values.email, values.password));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoogleSignIn = useCallback(
    () => handleAuth(signInWithGoogle),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleGitHubSignIn = useCallback(
    () => handleAuth(signInWithGithub),
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

  return (
    <AuthContext.Provider
      value={{
        isLoggedin,
        setIsLoggedin,
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
        user: state,
        setIsAuthLoading,
        isAuthLoading,
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
