"use client";

import React from "react";
import CreateServer from "./CreateServer";
import { Button } from "../ui/button";
import { useQuery } from "@tanstack/react-query";
import { isEmpty, queryData } from "@/lib/utils";
import AllServersByRole from "./AllServersByRole";
import { SERVERS_API } from "@/lib/routes";

const AllServers = () => {
  const { data } = useQuery({
    queryKey: ["server"],
    queryFn: () => queryData(SERVERS_API),
  });

  const renderCreateServerButton = (showModal: () => void) => (
    <Button
      variant="chatfusion"
      className="w-fit mx-auto my-5"
      onClick={showModal}
    >
      Create Your Server
    </Button>
  );

  return isEmpty(data) ? (
    <div className="grid place-content-center h-screen w-full px-4">
      <h1 className="text-base md:text-lg max-w-md text-center">
        You’re not part of any servers at the moment. Kick things off by
        creating your own!
      </h1>
      <CreateServer
        renderCreateServerTriggerComponent={renderCreateServerButton}
      />
    </div>
  ) : (
    <AllServersByRole {...data} />
  );
};

export default AllServers;
