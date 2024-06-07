import Image from "next/image";
import React from "react";

function AuthCardHeader({ title }: { title: string }) {
  return (
    <div className="flex gap-3 justify-center items-center">
      <Image
        src="/assets/discord-logo.gif"
        alt="Discord logo"
        width={70}
        height={70}
      />
      <h1 className="text-2xl font-bold  ">{title}</h1>
    </div>
  );
}

export default AuthCardHeader;
