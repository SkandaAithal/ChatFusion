import { AuthActionTypes, AuthReducerType, AuthState } from "../types/auth";
import { importPKCS8, jwtVerify, JWTPayload, SignJWT, importSPKI } from "jose";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { LOGIN } from "../routes";

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

const publicKeyString = process.env.JWT_PUBLIC_KEY!;
const privateKeyString = process.env.JWT_PRIVATE_KEY!;

let privateKey: CryptoKey;
let publicKey: CryptoKey;

export async function initKeys() {
  privateKey = await importPKCS8(privateKeyString, "RS256");
  publicKey = await importSPKI(publicKeyString, "RS256");
}

export async function createJwtToken(payload: JWTPayload, expiresIn: string) {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: "RS256" })
    .setJti(nanoid())
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(privateKey);
  return jwt;
}

export async function verifyJwtToken(token: string) {
  return jwtVerify(token, publicKey, { algorithms: ["RS256"] });
}

export function redirectToLogin(request: NextRequest) {
  const url = new URL(LOGIN, request.url);
  url.searchParams.set("redirect", request.nextUrl.pathname);
  return NextResponse.redirect(url);
}

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
};
