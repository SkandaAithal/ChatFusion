import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  initKeys,
  verifyJwtToken,
  createJwtToken,
  redirectToLogin,
  decryptToken,
  encryptToken,
} from "./lib/utils/auth";
import {
  ACCESS_TOKEN,
  MAX_AGE,
  REFRESH_TOKEN,
  REFRESH_TOKEN_SECRET_KEY,
  TOKEN_SECRET_KEY,
  USER_ID,
} from "./lib/constants";
import { JWTExpired } from "jose/errors";
import { UNPROTECTED_ROUTES } from "./lib/routes";

export async function middleware(request: NextRequest) {
  await initKeys();
  const { pathname } = request.nextUrl;
  const response = NextResponse.next();
  const apiTokens = request.headers.get("Authorization");

  if (UNPROTECTED_ROUTES.includes(pathname)) {
    return response;
  }
  if (apiTokens) {
    const [encryptedAccessToken, encryptedRefreshToken] = apiTokens.split(" ");

    const accessToken = await decryptToken(
      encryptedAccessToken,
      TOKEN_SECRET_KEY!
    );

    try {
      const { payload } = await verifyJwtToken(accessToken);
      response.headers.set(USER_ID, payload.userId as string);
      return response;
    } catch (error) {
      const refreshToken = await decryptToken(
        encryptedRefreshToken,
        REFRESH_TOKEN_SECRET_KEY!
      );

      if ((error as JWTExpired).code === "ERR_JWT_EXPIRED" && refreshToken) {
        try {
          const { payload } = await verifyJwtToken(refreshToken);
          if (!payload.userId) {
            return NextResponse.json(
              { message: "Unauthorized user" },
              { status: 401 }
            );
          }

          const newAccessToken = await createJwtToken(
            { userId: payload.userId },
            "1h"
          );

          // Encrypt new access token
          const encryptedNewAccessToken = await encryptToken(
            newAccessToken,
            TOKEN_SECRET_KEY!
          );

          response.cookies.set(ACCESS_TOKEN, encryptedNewAccessToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: MAX_AGE,
          });

          response.headers.set(USER_ID, payload.userId as string);

          return response;
        } catch {
          return NextResponse.json(
            { message: "Unauthorized user" },
            { status: 401 }
          );
        }
      }
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 401 }
      );
    }
  } else {
    const encryptedAccessToken = request.cookies.get(ACCESS_TOKEN)?.value;
    const encryptedRefreshToken = request.cookies.get(REFRESH_TOKEN)?.value;

    if (!encryptedAccessToken || !encryptedRefreshToken) {
      return redirectToLogin(request);
    }

    const accessToken = await decryptToken(
      encryptedAccessToken,
      TOKEN_SECRET_KEY!
    );

    try {
      const { payload } = await verifyJwtToken(accessToken);
      response.headers.set(USER_ID, payload.userId as string);
      return response;
    } catch (error) {
      const refreshToken = await decryptToken(
        encryptedRefreshToken,
        REFRESH_TOKEN_SECRET_KEY!
      );

      if ((error as JWTExpired).code === "ERR_JWT_EXPIRED" && refreshToken) {
        try {
          const { payload } = await verifyJwtToken(refreshToken);
          if (!payload.userId) {
            return redirectToLogin(request);
          }

          const newAccessToken = await createJwtToken(
            { userId: payload.userId },
            "1h"
          );

          // Encrypt new access token
          const encryptedNewAccessToken = await encryptToken(
            newAccessToken,
            TOKEN_SECRET_KEY!
          );

          response.cookies.set(ACCESS_TOKEN, encryptedNewAccessToken, {
            httpOnly: true,
            secure: true,
            path: "/",
            maxAge: MAX_AGE,
          });

          response.headers.set(USER_ID, payload.userId as string);

          return response;
        } catch {
          return redirectToLogin(request);
        }
      }
      return redirectToLogin(request);
    }
  }
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
