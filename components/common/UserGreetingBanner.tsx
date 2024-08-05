"use client";

import { useAuth } from "@/lib/providers/auth-provider";
import CreateServer from "../server-components/CreateServer";
import { Button } from "../ui/button";
import Image from "next/image";
import { LANDING_PAGE_IMAGES } from "@/lib/constants";
import React from "react";
import Scroller from "./Scroller";
import { useApp } from "@/lib/providers/app-provider";

const UserGreetingBanner = () => {
  const { user } = useAuth();
  const { isMobile } = useApp();

  const renderCreateServerButton = (showModal: () => void) => (
    <Button variant="chatfusion" className="w-fit" onClick={showModal}>
      Create Your Server
    </Button>
  );

  return (
    <div className="grid place-content-center md:grid-cols-2 w-full md:px-20 overflow-hidden">
      <div className="flex flex-col gap-4 my-auto items-center md:items-start py-8 px-4">
        <div className="typewriter text-2xl md:text-3xl font-bold w-fit">
          <h1>Hey {user.userName}!</h1>
        </div>
        <p className="text-base md:text-lg max-w-md text-center md:text-left">
          Welcome! Start by creating your first server and explore texting,
          audio, and video calling.
        </p>
        <CreateServer
          renderCreateServerTriggerComponent={renderCreateServerButton}
        />
      </div>

      <div className="w-full  md:h-screen grid place-content-center">
        <Scroller
          direction="right"
          flexDirection={isMobile ? "row" : "column"}
          speed="slow"
        >
          {LANDING_PAGE_IMAGES.map((src) => (
            <Image
              src={src}
              alt="landing-page"
              width={400}
              height={400}
              key={src}
              className="object-cover rounded-xl w-60 h-60 md:w-80 md:h-80 lg:w-96 lg:h-96"
            />
          ))}
        </Scroller>
      </div>
    </div>
  );
};

export default UserGreetingBanner;
