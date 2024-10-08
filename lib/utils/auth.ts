import { AuthActionTypes, AuthReducerType, AuthState } from "../types/auth";
import { importPKCS8, jwtVerify, JWTPayload, SignJWT, importSPKI } from "jose";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { LOGIN } from "../routes";
import CryptoJS from "crypto-js";
import { TOKEN_SECRET_KEY } from "../constants";

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

export async function encryptToken(
  token: string,
  secretKey: string
): Promise<string> {
  return CryptoJS.AES.encrypt(token, secretKey).toString();
}

export async function decryptToken(
  encryptedToken: string,
  secretKey: string
): Promise<string> {
  const bytes = CryptoJS.AES.decrypt(encryptedToken, secretKey);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export const getUserId = async (encrytedToken: string) => {
  try {
    await initKeys();
    const token = await decryptToken(
      encrytedToken as string,
      TOKEN_SECRET_KEY!
    );

    const { payload } = await verifyJwtToken(token);

    return payload?.userId;
  } catch (error) {
    return null;
  }
};
