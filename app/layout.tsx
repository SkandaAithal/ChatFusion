import type { Metadata } from "next";
import { AR_One_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/components/providers/auth-provider";
import ProtectedRoute from "@/components/auth-components/ProtectedRoute";

const oprnSans = AR_One_Sans({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Chat Fusion",
  description: "Chat app with text, audio and video calls",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={oprnSans.className}>
        <ToastContainer />
        <AuthProvider>
          <ProtectedRoute>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              forcedTheme="light"
              storageKey="discord-theme"
            >
              {children}
            </ThemeProvider>
          </ProtectedRoute>
        </AuthProvider>
      </body>
    </html>
  );
}
