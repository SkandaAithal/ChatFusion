"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers/auth-provider";
import { EXPIRY_TIME, TOKEN } from "@/lib/constants";
import { HOME } from "@/lib/routes";

const redirectIfLoggedIn = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P> => {
  const RedirectIfLoggedIn: React.FC<P> = (props) => {
    const { isLoggedin } = useAuth();
    const router = useRouter();
    const accessToken = localStorage.getItem(TOKEN);
    const expiryTimeStr = localStorage.getItem(EXPIRY_TIME);
    const tokenExpireTime = expiryTimeStr ? JSON.parse(expiryTimeStr) : null;

    if (isLoggedin || (!!accessToken && tokenExpireTime > Date.now())) {
      router.push(HOME);
      return null;
    } else {
      return <WrappedComponent {...(props as P)} />;
    }
  };

  return RedirectIfLoggedIn;
};

export default redirectIfLoggedIn;
