import React from "react";
import { FiPlus } from "react-icons/fi";
import { Button } from "../ui/button";
import { ServerBadgeProps } from "@/lib/types/components/server-badge";
import { twMerge } from "tailwind-merge";
import { getInitials } from "@/lib/utils";
import { useAuth } from "@/lib/providers/auth-provider";
import LazyImage from "../ui/lazy-image";

const ServerBadge: React.FC<ServerBadgeProps> = ({
  isCreateServer = false,
  handleClick,
  className = "",
  icon,
  serverImage,
}) => {
  const { user } = useAuth();
  const userName = user.userName;
  const initials = getInitials(userName);
  const handleBtnClick = () => {
    if (handleClick) {
      handleClick();
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleBtnClick}
      className={twMerge(
        "h-16 w-16 rounded-full p-0 flex items-center justify-center overflow-hidden text-chat_fusion hover:text-white dark:hover:text-cyan-600",
        serverImage ? "hover:bg-none" : "",
        className
      )}
    >
      {isCreateServer ? (
        <FiPlus size={28} />
      ) : serverImage ? (
        <LazyImage
          src={serverImage}
          alt={userName}
          className="rounded-full h-full w-full"
        />
      ) : (
        <p className="text-2xl">{initials}</p>
      )}
      {icon ? icon : <></>}
    </Button>
  );
};

export default ServerBadge;
