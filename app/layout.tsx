import type { Metadata } from "next";
import { AR_One_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/providers/theme-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/lib/providers/auth-provider";
import ProtectedRoute from "@/components/auth-components/ProtectedRoute";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";
import { APP_THEME } from "@/lib/constants";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          storageKey={APP_THEME}
        >
          <AuthProvider>
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <ToastContainer />
            <ProtectedRoute>{children}</ProtectedRoute>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
