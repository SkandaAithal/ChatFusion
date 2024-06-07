"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../providers/auth-provider";
import { LOGIN } from "@/lib/routes";
import { EXPIRY_TIME, TOKEN } from "@/lib/constants";

const authorizedRoute = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P> => {
  const AuthorizedRoute: React.FC<P> = (props) => {
    const { isLoggedin } = useAuth();
    const router = useRouter();
    const accessToken = localStorage.getItem(TOKEN);
    const expiryTimeStr = localStorage.getItem(EXPIRY_TIME);
    const tokenExpireTime = expiryTimeStr ? JSON.parse(expiryTimeStr) : null;

    if (isLoggedin || (!!accessToken && tokenExpireTime > Date.now())) {
      return <WrappedComponent {...(props as P)} />;
    } else {
      router.push(LOGIN);
      return null;
    }
  };

  return AuthorizedRoute;
};

export default authorizedRoute;
