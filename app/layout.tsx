import type { Metadata } from "next";
import { AR_One_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/lib/providers/auth-provider";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { APP_THEME } from "@/lib/constants";
import TanStackProvider from "@/lib/providers/tanstack-provider";
import { AppProvider } from "@/lib/providers/app-provider";

const oprnSans = AR_One_Sans({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: { template: "%s", default: "Chat Fusion" },
  description: "Connect via text, audio and video calls",
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={oprnSans.className}>
        <TanStackProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey={APP_THEME}
          >
            <AuthProvider>
              <AppProvider>
                <NextSSRPlugin
                  routerConfig={extractRouterConfig(ourFileRouter)}
                />
                <ToastContainer />
                {children}
              </AppProvider>
            </AuthProvider>
          </ThemeProvider>
        </TanStackProvider>
      </body>
    </html>
  );
}
