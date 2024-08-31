import { USER_ID } from "@/lib/constants";
import { db } from "@/lib/db";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const userId = request.headers.get(USER_ID);

  const userProfile = await db.user.findUnique({
    where: {
      userId: userId as string,
    },
  });
  return NextResponse.json({ user: userProfile });
}
