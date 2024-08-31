import React, { ReactNode } from "react";
import SidebarLayout from "../../components/common/SidebarLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex">
      <SidebarLayout />
      <div className="h-screen overflow-y-auto w-full pt-16 md:pt-4">
        {children}
      </div>
    </div>
  );
}
