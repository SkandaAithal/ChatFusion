import AllServers from "@/components/server-components/AllServers";
import { SERVERS_API } from "@/lib/routes";
import { queryData } from "@/lib/utils";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";

const Servers = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["server"],
    queryFn: () => queryData(SERVERS_API),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AllServers />
    </HydrationBoundary>
  );
};

export default Servers;
