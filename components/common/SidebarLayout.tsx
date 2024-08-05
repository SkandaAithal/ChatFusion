"use client";

import React from "react";
import { ModeToggle } from "../ui/mode-toggle";
import CreateServer from "../server-components/CreateServer";
import UserAvatar from "./UserAvatar";
import TooltipComponent from "../ui/tooltip";
import ServerBadge from "../server-components/ServerBadge";
import { useApp } from "@/lib/providers/app-provider";
import SidePanel from "../ui/sheet";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { Button } from "../ui/button";

const SidebarLayout = () => {
  const { isMobile } = useApp();

  const renderAddServerBadge = (showModal: () => void) => (
    <TooltipComponent tooltipText="Create server" placement="right">
      <div>
        <ServerBadge isCreateServer handleClick={showModal} />
      </div>
    </TooltipComponent>
  );

  const renderSideBar = () => (
    <div className="flex flex-col gap-3 justify-end items-center h-screen w-fit p-3 bg-secondary">
      <ModeToggle />
      <CreateServer renderCreateServerTriggerComponent={renderAddServerBadge} />
      <UserAvatar />
    </div>
  );

  const renderSidePanelTrigger = () => (
    <Button variant="transparent" className="fixed top-0 py-6">
      <HiOutlineMenuAlt2 size={24} />
    </Button>
  );
  return isMobile ? (
    <SidePanel
      panelContent={renderSideBar()}
      sheetTrigger={renderSidePanelTrigger()}
      side="left"
    />
  ) : (
    renderSideBar()
  );
};

export default SidebarLayout;
