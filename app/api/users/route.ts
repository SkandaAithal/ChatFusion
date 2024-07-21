import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const user = await request.json();

  if (user?.uid) {
    const userProfile = await db.user.findUnique({
      where: {
        userId: user.uid,
      },
    });

    if (userProfile)
      return NextResponse.json({
        message: "User already exist",
      });

    await db.user.create({
      data: {
        userId: user.uid,
        name: user.userName,
        email: user.email,
        imageUrl: user.userImage ?? "",
      },
    });
  }

  return NextResponse.json({ message: "User created successfully" });
}
