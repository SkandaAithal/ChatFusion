"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../lib/providers/auth-provider";
import { usePathname, useRouter } from "next/navigation";
import { HOME, LOGIN, PROTECTED_ROUTES, SIGN_UP } from "@/lib/routes";
import PageLoader from "../ui/page-loader";
import { isUserValid } from "@/lib/utils/auth";

export const ProtectedRoute: React.FunctionComponent<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const { setIsLoggedin } = useAuth();
  const currentPathname = usePathname();
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      if (isUserValid()) {
        setIsLoggedin(true);
        if (PROTECTED_ROUTES.includes(currentPathname)) {
          setIsCheckingAuth(false);
        } else if (currentPathname === LOGIN || currentPathname === SIGN_UP) {
          router.push(HOME);
        } else {
          setIsCheckingAuth(false);
        }
      } else {
        setIsLoggedin(false);
        if (PROTECTED_ROUTES.includes(currentPathname)) {
          router.push(LOGIN);
        } else if (currentPathname === LOGIN || currentPathname === SIGN_UP) {
          setIsCheckingAuth(false);
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
