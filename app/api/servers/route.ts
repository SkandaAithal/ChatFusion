import { v4 as uuidV4 } from "uuid";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { MemberRole } from "@prisma/client";
import { USER_ID } from "@/lib/constants";
import { getServersByRole } from "@/lib/utils/server-actions";

export async function POST(request: NextRequest) {
  try {
    const { serverName, imageUrl } = await request.json();

    const userId = request.headers.get(USER_ID) as string;

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
    return NextResponse.json(
      {
        message:
          "Something went wrong while creating the server. Please try again later.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const userId = request.headers.get(USER_ID) as string;
  const servers = await getServersByRole(userId);
  return NextResponse.json(servers);
}
