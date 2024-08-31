"use client";

import { useApp } from "@/lib/providers/app-provider";
import Image from "next/image";
import React from "react";
import { twMerge } from "tailwind-merge";

function AuthCardHeader({ title }: { title: string }) {
  const { isAuthLoading } = useApp();
  return (
    <div className="flex justify-center items-center gap-2 py-2">
      <Image
        src="/assets/chat-fusion.png"
        alt="Chat fusion logo"
        width={50}
        height={50}
        className={twMerge(isAuthLoading ? "spin" : "")}
      />
      <h1 className="text-2xl font-bold">{title}</h1>
    </div>
  );
}

export default AuthCardHeader;
