import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { createJwtToken, encryptToken, initKeys } from "@/lib/utils/auth";
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  REFRESH_TOKEN_SECRET_KEY,
  TIME_EXPIRE,
  TOKEN_SECRET_KEY,
} from "@/lib/constants";

export async function POST(request: NextRequest) {
  const user = await request.json();
  await initKeys();
  if (!user?.uid) {
    return NextResponse.json(
      { message: "User data is missing" },
      { status: 400 }
    );
  }

  const userProfile = await db.user.findUnique({
    where: {
      userId: user.uid,
    },
  });

  // Generate tokens
  const accessToken = await createJwtToken({ userId: user.uid }, "10s");
  const refreshToken = await createJwtToken({ userId: user.uid }, "7d");

  // Encrypt tokens
  const encryptedAccessToken = await encryptToken(
    accessToken,
    TOKEN_SECRET_KEY!
  );
  const encryptedRefreshToken = await encryptToken(
    refreshToken,
    REFRESH_TOKEN_SECRET_KEY!
  );

  const response = NextResponse.json({
    message: userProfile ? "User already exists" : "User created successfully",
  });

  response.cookies.set(ACCESS_TOKEN, encryptedAccessToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: TIME_EXPIRE,
  });

  response.cookies.set(REFRESH_TOKEN, encryptedRefreshToken, {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: TIME_EXPIRE,
  });

  if (!userProfile) {
    await db.user.create({
      data: {
        userId: user.uid,
        name: user.userName,
        email: user.email,
        imageUrl: user.userImage ?? "",
      },
    });
  }

  return response;
}
