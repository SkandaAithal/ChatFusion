"use server";

import { db } from "../db";
import { MemberRole } from "@prisma/client";
import { cookies } from "next/headers";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

export async function getTokenFromCookies(key: string) {
  const token = cookies().get(key)?.value;
  return token;
}

export const deleteCookies = async () => {
  cookies().delete(ACCESS_TOKEN);
  cookies().delete(REFRESH_TOKEN);
};
export const getAllServers = async (userId: string) => {
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          userId: userId as string,
        },
      },
    },
  });
  return servers;
};

export const getServersByRole = async (userId: string) => {
  const members = await db.member.findMany({
    where: {
      userId: userId as string,
    },
    include: {
      server: true,
    },
  });

  const servers = {
    admin: members
      .filter((member) => member.role === MemberRole.ADMIN)
      .map((member) => member.server),
    moderator: members
      .filter((member) => member.role === MemberRole.MODERATOR)
      .map((member) => member.server),
    guest: members
      .filter((member) => member.role === MemberRole.GUEST)
      .map((member) => member.server),
  };
  return servers;
};
