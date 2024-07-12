"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../providers/auth-provider";
import { usePathname, useRouter } from "next/navigation";
import { EXPIRY_TIME, TOKEN } from "@/lib/constants";
import { HOME, LOGIN, PROTECTED_ROUTES, SIGN_UP } from "@/lib/routes";
import PageLoader from "../ui/page-loader";

export const ProtectedRoute: React.FunctionComponent<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const { setIsLoggedin } = useAuth();
  const currentPathname = usePathname();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const accessToken =
      typeof window !== "undefined" ? localStorage.getItem(TOKEN) : null;
    const expiryTimeStr =
      typeof window !== "undefined" ? localStorage.getItem(EXPIRY_TIME) : null;
    const tokenExpireTime = expiryTimeStr ? JSON.parse(expiryTimeStr) : null;

    const checkAuth = () => {
      if (accessToken && tokenExpireTime && tokenExpireTime > Date.now()) {
        setIsLoggedin(true);
        if (PROTECTED_ROUTES.includes(currentPathname)) {
          setIsCheckingAuth(false);
        } else {
          router.push(HOME);
        }
      } else {
        setIsLoggedin(false);
        if (PROTECTED_ROUTES.includes(currentPathname)) {
          router.push(LOGIN);
        } else if (currentPathname === LOGIN || currentPathname === SIGN_UP) {
          setIsCheckingAuth(false);
        } else {
          router.push(HOME);
        }
      }
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPathname]);

  if (isCheckingAuth) {
    return <PageLoader />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
