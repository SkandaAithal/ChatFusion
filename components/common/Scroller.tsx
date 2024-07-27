"use client";
import React, { ReactNode } from "react";
import useScrollerAnimation from "@/lib/hooks/use-scroll-animation";

interface ScrollerProps {
  children: ReactNode;
  direction?: "left" | "right";
  speed?: "fast" | "slow";
  flexDirection?: "row" | "column";
}

const Scroller: React.FC<ScrollerProps> = ({
  children,
  direction = "left",
  speed = "normal",
  flexDirection = "column",
}) => {
  useScrollerAnimation();

  return (
    <div
      className="scroller"
      data-direction={direction}
      data-speed={speed}
      data-flex-direction={flexDirection}
    >
      <div className="scroller__inner">{children}</div>
    </div>
  );
};

export default Scroller;
