import { v4 as uuidV4 } from "uuid";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    const { serverName, imageUrl, userId } = await request.json();

    if (!userId) {
      return new NextResponse("UnAuthorized user", { status: 401 });
    }

    const server = await db.server.create({
      data: {
        userId,
        name: serverName,
        imageUrl,
        inviteCode: uuidV4(),
        channels: {
          create: [{ name: "general", userId: userId }],
        },
        members: {
          create: [{ userId: userId, role: MemberRole.ADMIN }],
        },
      },
    });

    return NextResponse.json({
      message: "Server created successfully",
      server,
    });
  } catch (err) {
    return new NextResponse(
      "Something went wrong while creating the server. Please try again later.",
      { status: 500 }
    );
  }
}
