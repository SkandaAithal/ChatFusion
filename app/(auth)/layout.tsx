import { Metadata } from "next";
import React, { ReactNode } from "react";
export const metadata: Metadata = {
  title: "User Account",
  description: "Chat app with text, audio and video calls",
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className=" min-h-screen flex justify-center items-center ">
      {children}
    </div>
  );
}
