import React from "react";
import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa6";
import { AuthActionTypes, SocialLoginsProps } from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import { setTokenAndExpiryTime } from "@/lib/utils/auth";
import { useAuth } from "../providers/auth-provider";
import { HOME } from "@/lib/routes";
import { toast } from "react-toastify";

const SocialLogins: React.FC<SocialLoginsProps> = ({
  signInWithGoogle,
  signInWithGithub,
  isGoogleLoading,
  isGithubLoading,
  isLoading,
}) => {
  const router = useRouter();
  const { setIsLoggedin, dispatch } = useAuth();

  const handleGoogleSignIn = async () => {
    const user = await signInWithGoogle();
    if (user) {
      const payload = {
        uid: user.user.uid,
        userName: user.user.displayName,
        email: user.user.email,
        userImage: user.user.photoURL,
      };
      setTokenAndExpiryTime(user.user);
      setIsLoggedin(true);
      dispatch({ type: AuthActionTypes.CREATE_USER, payload });
      toast.success("Signed in successfully", {
        position: "top-center",
        hideProgressBar: true,
        theme: "dark",
      });
      router.push(HOME);
    }
  };

  const handleGitHubSignIn = async () => {
    const user = await signInWithGithub();
    if (user) {
      const payload = {
        uid: user.user.uid,
        userName: user.user.displayName,
        email: user.user.email,
        userImage: user.user.photoURL,
      };
      setTokenAndExpiryTime(user.user);
      setIsLoggedin(true);
      dispatch({ type: AuthActionTypes.CREATE_USER, payload });
      toast.success("Signed in successfully", {
        position: "top-center",
        hideProgressBar: true,
        theme: "dark",
      });
      router.push(HOME);
    }
  };

  return (
    <div className="grid gap-4">
      <Button
        onClick={handleGoogleSignIn}
        className=" gap-4 w-full"
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
