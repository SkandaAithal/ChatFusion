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
  REFRESH_TOKEN,
  REFRESH_TOKEN_SECRET_KEY,
  TIME_EXPIRE,
  TOKEN_SECRET_KEY,
} from "./lib/constants";
import { JWTExpired } from "jose/errors";
import { UNPROTECTED_ROUTES } from "./lib/routes";

export async function middleware(request: NextRequest) {
  await initKeys();

  const { pathname } = request.nextUrl;

  if (UNPROTECTED_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  const encryptedAccessToken = request.cookies.get(ACCESS_TOKEN)?.value;
  const encryptedRefreshToken = request.cookies.get(REFRESH_TOKEN)?.value;

  if (!encryptedAccessToken || !encryptedRefreshToken) {
    return redirectToLogin(request);
  }

  // Decrypt tokens
  const accessToken = await decryptToken(
    encryptedAccessToken,
    TOKEN_SECRET_KEY!
  );

  const refreshToken = await decryptToken(
    encryptedRefreshToken,
    REFRESH_TOKEN_SECRET_KEY!
  );

  try {
    await verifyJwtToken(accessToken);

    return NextResponse.next();
  } catch (error) {
    if ((error as JWTExpired).code === "ERR_JWT_EXPIRED" && refreshToken) {
      try {
        const { payload } = await verifyJwtToken(refreshToken);
        if (!payload.userId) {
          return redirectToLogin(request);
        }

        const newAccessToken = await createJwtToken(
          { userId: payload.userId },
          "10s"
        );

        // Encrypt new access token
        const encryptedNewAccessToken = await encryptToken(
          newAccessToken,
          TOKEN_SECRET_KEY!
        );

        const response = NextResponse.next();
        response.cookies.set(ACCESS_TOKEN, encryptedNewAccessToken, {
          httpOnly: false,
          secure: true,
          path: "/",
          maxAge: TIME_EXPIRE,
        });
        return response;
      } catch {
        return redirectToLogin(request);
      }
    }
    return redirectToLogin(request);
  }
}

export const config = {
  matcher: ["/api/:path*", "/((?!_next/static|_next/image|favicon.ico).*)"],
};
