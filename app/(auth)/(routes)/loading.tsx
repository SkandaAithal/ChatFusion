import PageLoader from "@/components/ui/page-loader";
import { Metadata } from "next";
import React from "react";
export const metadata: Metadata = {
  title: "Loading...",
  description: "Chat app with text, audio and video calls",
};
const AnimatedLoader: React.FC = () => {
  return <PageLoader />;
};

export default AnimatedLoader;
