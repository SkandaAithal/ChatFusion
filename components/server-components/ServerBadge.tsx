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
  onClick,
  className = "",
  icon,
  serverImage,
}) => {
  const { user } = useAuth();
  const userName = user.userName;
  const initials = getInitials(userName);
  const handleBtnClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <Button
      variant="outline"
      onClick={handleBtnClick}
      className={twMerge(
        "relative h-16 w-16 rounded-full text-chat_fusion hover:text-white dark:hover:text-cyan-600",
        serverImage ? "hover:bg-transparent" : "",
        className
      )}
    >
      {isCreateServer ? (
        <FiPlus size={28} />
      ) : serverImage ? (
        <LazyImage src={serverImage} alt={userName} className="rounded-full" />
      ) : (
        <p className="text-2xl">{initials}</p>
      )}
      {icon ? icon : <></>}
    </Button>
  );
};

export default ServerBadge;
