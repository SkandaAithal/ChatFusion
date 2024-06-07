import { CustomParameters, UserCredential } from "firebase/auth";

export interface SignUpFormData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}
export interface SignInFormData {
  email: string;
  password: string;
}
export interface SocialLoginsProps {
  signInWithGoogle: (
    scopes?: string[] | undefined,
    customOAuthParameters?: CustomParameters | undefined
  ) => Promise<UserCredential | undefined>;
  signInWithGithub: (
    scopes?: string[] | undefined,
    customOAuthParameters?: CustomParameters | undefined
  ) => Promise<UserCredential | undefined>;
  isGoogleLoading: boolean;
  isGithubLoading: boolean;
  isLoading: boolean;
}

export enum AuthActionTypes {
  CREATE_USER = "CREATE_USER",
  SIGN_OUT_USER = "SIGN_OUT_USER",
  UPDATE_USER = "UPDATE_USER",
}
export type AuthActions =
  | {
      type: AuthActionTypes.CREATE_USER;
      payload: Record<string, any>;
    }
  | {
      type: AuthActionTypes.UPDATE_USER;
      payload: Record<string, any>;
    }
  | {
      type: AuthActionTypes.SIGN_OUT_USER;
      payload: null;
    };

export type AuthDispatch = React.Dispatch<AuthActions>;
export interface AuthState {
  userName: string;
  userImage?: string;
  email: string;
  uid: string;
}
export interface AuthContextType {
  setIsLoggedin: React.Dispatch<boolean>;
  isLoggedin: boolean;
  state: AuthState;
  dispatch: AuthDispatch;
}
export type AuthReducerType = (
  state: AuthState,
  action: AuthActions
) => AuthState;
