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
  setIsAuthLoading: React.Dispatch<boolean>;
  isLoggedin: boolean;
  user: AuthState;
  dispatch: AuthDispatch;
  isGithubLoading: boolean;
  isGoogleLoading: boolean;
  isEmailSignInLoading: boolean;
  isLoading: boolean;
  isSignUpLoading: boolean;
  handleSignWithEmail: (values: SignInFormData) => void;
  handleSignUp: (values: SignUpFormData) => void;
  handleGoogleSignIn: () => void;
  handleGitHubSignIn: () => void;
  isAuthLoading: boolean;
}
export type AuthReducerType = (
  state: AuthState,
  action: AuthActions
) => AuthState;
