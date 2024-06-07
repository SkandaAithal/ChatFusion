"use client";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { AuthContextType } from "@/lib/types/auth";
import { EXPIRY_TIME, TOKEN } from "@/lib/constants";
import { usePathname, useRouter } from "next/navigation";
import { authReducer, initailAuthState, refreshToken } from "@/lib/utils/auth";
import { LOGIN, PROTECTED_ROUTES } from "@/lib/routes";
import usePersistentReducer from "@/lib/hooks/use-persistent-reducer";

const AuthContext = createContext<AuthContextType | null>(null);
const USER_INFO = "userInfo";
export const AuthProvider: React.FunctionComponent<
  React.PropsWithChildren<unknown>
> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [state, dispatch] = usePersistentReducer(
    authReducer,
    initailAuthState,
    USER_INFO
  );
  const accessToken = localStorage.getItem(TOKEN);
  const expiryTimeStr = localStorage.getItem(EXPIRY_TIME);
  const tokenExpireTime = expiryTimeStr ? JSON.parse(expiryTimeStr) : null;

  const validateUser = async () => {
    try {
      const expiryTimeStr = localStorage.getItem(EXPIRY_TIME);
      const tokenExpireTime = expiryTimeStr ? JSON.parse(expiryTimeStr) : null;
      if (!(tokenExpireTime > Date.now())) {
        await refreshToken();
      }
    } catch (e) {
      setIsLoggedin(false);
      router.push(LOGIN);
    }
  };

  const storageEventListener = useCallback((event: any) => {
    if (event.key === TOKEN || event.key === EXPIRY_TIME) {
      if (
        !event.storageArea?.[TOKEN] ||
        !event.storageArea?.[EXPIRY_TIME] ||
        !event.storageArea?.[USER_INFO]
      ) {
        setIsLoggedin(false);
        router.push(LOGIN);
      }
    }
  }, []);

  useEffect(() => {
    if (PROTECTED_ROUTES.includes(pathname)) {
      if (accessToken) {
        if (!(tokenExpireTime > Date.now())) {
          router.push(LOGIN);
        } else {
          setIsLoggedin(true);
        }
      } else {
        router.push(LOGIN);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("storage", storageEventListener);
    return () => {
      window.removeEventListener("storage", storageEventListener);
    };
  }, [storageEventListener]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    if (isLoggedin) {
      interval = setInterval(validateUser, 5000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedin]);

  return (
    <AuthContext.Provider
      value={{ isLoggedin, setIsLoggedin, state, dispatch }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
