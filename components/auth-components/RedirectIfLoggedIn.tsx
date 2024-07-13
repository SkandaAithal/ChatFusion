"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../providers/auth-provider";
import { EXPIRY_TIME, TOKEN, USER_INFO } from "@/lib/constants";
import { HOME } from "@/lib/routes";
import { useRouter } from "next/navigation";
import PageLoader from "../ui/page-loader";

const redirectIfLoggedIn = <P extends object>(
  WrappedComponent: React.ComponentType<P>
): React.ComponentType<P> => {
  const RedirectIfLoggedIn: React.FC<P> = (props) => {
    const { isLoggedin } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const accessToken = localStorage.getItem(TOKEN);
      const expiryTimeStr = localStorage.getItem(EXPIRY_TIME);
      const tokenExpireTime = expiryTimeStr ? JSON.parse(expiryTimeStr) : null;
      const user =
        typeof window !== "undefined" ? localStorage.getItem(USER_INFO) : null;
      const userId = user ? JSON.parse(user).uid : null;
      if (
        isLoggedin ||
        (!!accessToken && tokenExpireTime > Date.now() && userId)
      ) {
        router.push(HOME);
      } else {
        setIsLoading(false);
      }
    }, [isLoggedin, router]);

    if (isLoading) {
      return <PageLoader />;
    }

    return <WrappedComponent {...(props as P)} />;
  };

  return RedirectIfLoggedIn;
};

export default redirectIfLoggedIn;
