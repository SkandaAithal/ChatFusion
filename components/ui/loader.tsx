import { cn } from "@/lib/utils";
import React from "react";
import { TbLoader } from "react-icons/tb";

interface LoaderProps {
  theme?: "light" | "dark";
}

const Loader: React.FC<LoaderProps> = ({ theme = "light" }) => {
  const loaderClassName = theme === "dark" ? "text-gray-800" : "text-white";

  return (
    <div className="flex justify-center items-center">
      <TbLoader className={cn("animate-spin", loaderClassName)} size={20} />
    </div>
  );
};

export default Loader;
