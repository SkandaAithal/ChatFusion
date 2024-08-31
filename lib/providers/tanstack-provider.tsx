"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  isServer,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { LOGIN } from "../routes";
import { useApp } from "./app-provider";

const TanStackProvider = ({ children }: { children: ReactNode }) => {
  const [is401Error, setIs401Error] = useState(false);
  const router = useRouter();
  const pathName = usePathname();
  const { setIsAuthLoading } = useApp();

  function makeQueryClient() {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          retry: (failureCount, error) => {
            if (error instanceof AxiosError && error.response?.status === 401) {
              setIs401Error(true);
              return false;
            }
            return failureCount < 2;
          },
        },
        mutations: {
          retry: (failureCount, error) => {
            if (error instanceof AxiosError && error.response?.status === 401) {
              setIs401Error(true);
              return false;
            }
            return failureCount < 2;
          },
        },
      },
    });
  }

  let browserQueryClient: QueryClient | undefined = undefined;

  function getQueryClient() {
    if (isServer) {
      return makeQueryClient();
    } else {
      if (!browserQueryClient) browserQueryClient = makeQueryClient();
      return browserQueryClient;
    }
  }

  useEffect(() => {
    if (is401Error) {
      router.push(LOGIN);
      setIsAuthLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [is401Error]);

  useEffect(() => {
    if (pathName === LOGIN) {
      setIs401Error(false);
    }
  }, [pathName]);

  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default TanStackProvider;
