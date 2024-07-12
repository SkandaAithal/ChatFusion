import React from "react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { useAuth } from "../providers/auth-provider";

const SocialLogins: React.FC = () => {
  const {
    isLoading,
    isGithubLoading,
    isGoogleLoading,
    handleGitHubSignIn,
    handleGoogleSignIn,
  } = useAuth();

  return (
    <div className="grid gap-4">
      <Button
        onClick={handleGoogleSignIn}
        className="gap-4 w-full"
        loading={isGoogleLoading}
        disabled={isLoading}
        loaderTheme="dark"
      >
        <FcGoogle size={25} />
        <p className="text-base">Sign in with Google</p>
      </Button>
      <Button
        onClick={handleGitHubSignIn}
        className=" gap-4 w-full"
        loading={isGithubLoading}
        disabled={isLoading}
        loaderTheme="dark"
      >
        <FaGithub size={25} />
        <p className="text-base">Sign in with GitHub</p>
      </Button>

      <div className="flex items-center w-full">
        <div className="flex-1 h-[0.25px] bg-slate-500"></div>
        <div className="text-slate-500 text-center mx-2">or</div>
        <div className="flex-1 h-[0.25px] bg-slate-500"></div>
      </div>
    </div>
  );
};

export default SocialLogins;
