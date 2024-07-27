import React, { ReactNode } from "react";
import SidebarLayout from "../../components/common/SidebarLayout";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <SidebarLayout />
      {children}
    </div>
  );
}
