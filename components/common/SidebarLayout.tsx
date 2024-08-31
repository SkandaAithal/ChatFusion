"use client";

import React, { useState } from "react";
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
  const [isPanelOpen, setShowPanel] = useState(false);

  const showPanel = () => setShowPanel(true);

  const renderAddServerBadge = (showModal: () => void) => (
    <TooltipComponent tooltipText="Create server" placement="right">
      <div>
        <ServerBadge isCreateServer handleClick={showModal} />
      </div>
    </TooltipComponent>
  );

  const renderSideBar = () => (
    <div className="flex flex-col gap-3 justify-end items-center h-screen w-fit p-3 bg-secondary sticky top-0">
      <ModeToggle />
      <CreateServer renderCreateServerTriggerComponent={renderAddServerBadge} />
      <UserAvatar />
    </div>
  );

  const renderSidePanelTrigger = () => (
    <Button
      variant="transparent"
      className="sticky top-0 py-6"
      onClick={showPanel}
    >
      <HiOutlineMenuAlt2 size={24} />
    </Button>
  );

  return isMobile ? (
    <>
      <div className="w-full fixed top-0 bg-background z-20">
        {renderSidePanelTrigger()}
      </div>
      <SidePanel
        panelContent={renderSideBar()}
        side="left"
        showPanel={setShowPanel}
        isPanelOpen={isPanelOpen}
      />
    </>
  ) : (
    renderSideBar()
  );
};

export default SidebarLayout;
