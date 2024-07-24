"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "../../lib/providers/auth-provider";
import { getInitials } from "@/lib/utils";
import { FaUserAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { AuthActionTypes } from "@/lib/types/auth";
import { LOGIN } from "@/lib/routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MdLogout } from "react-icons/md";
import PromptModal from "../modals/PromptModal";
import TooltipComponent from "../ui/tooltip";
import { useTheme } from "next-themes";
import { APP_THEME } from "@/lib/constants";
function UserAvatar() {
  const router = useRouter();
  const { theme } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { dispatch, user, setIsAuthLoading } = useAuth();
  const showModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const userImage = user.userImage;
  const userName = user.userName;
  const initials = getInitials(userName);

  const handleLogout = async () => {
    setIsAuthLoading(false);
    await signOut(auth);
    router.push(LOGIN);
    localStorage.clear();
    localStorage.setItem(APP_THEME, theme as string);
    setIsModalOpen(false);
    dispatch({ type: AuthActionTypes.SIGN_OUT_USER });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="outline-none border border-none rounded-full h-16 w-16 overflow-hidden"
            aria-label="Customise options"
          >
            <TooltipComponent tooltipText={userName} placement="right">
              <Avatar className="cursor-pointer w-full h-full">
                {userImage ? (
                  <AvatarImage
                    src={userImage}
                    className="hover:scale-125  duration-300"
                  />
                ) : (
                  <AvatarFallback className="text-2xl hover:scale-110  duration-300">
                    {initials ? initials : <FaUserAlt />}
                  </AvatarFallback>
                )}
              </Avatar>
            </TooltipComponent>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="w-full">
            Profile
            <DropdownMenuShortcut>
              <FaUserAlt size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="w-full" onClick={showModal}>
            Log out
            <DropdownMenuShortcut>
              <MdLogout size={20} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <PromptModal
        isModalOpen={isModalOpen}
        showModal={showModal}
        showLogo
        modalTitle="Are you sure you want to Logout?"
        handlePrimaryAction={handleLogout}
        primaryBtnText="Logout"
      />
    </>
  );
}

export default UserAvatar;
