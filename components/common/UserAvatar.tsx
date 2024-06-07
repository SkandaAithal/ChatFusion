"use client";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "../providers/auth-provider";
import { getInitials } from "@/lib/utils";

function UserAvatar() {
  const { state } = useAuth();
  const userImage = state.userImage;
  const userName = state.userName;
  const initials = getInitials(userName);

  return (
    <Avatar className="cursor-pointer mx-4 mt-4">
      {userImage ? (
        <AvatarImage
          src={userImage}
          className="hover:scale-125  duration-300"
        />
      ) : (
        <AvatarFallback className="text-2xl hover:scale-110  duration-300">
          {initials}
        </AvatarFallback>
      )}
    </Avatar>
  );
}

export default UserAvatar;
