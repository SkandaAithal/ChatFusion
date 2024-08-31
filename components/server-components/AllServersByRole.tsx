import { ServersByRole } from "@/lib/types/queries/servers";
import React from "react";
import ServerBadge from "./ServerBadge";

const AllServersByRole: React.FC<ServersByRole> = ({
  admin,
  guest,
  moderator,
}) => {
  return (
    <div className="w-full p-4 md:p-6">
      <h1 className="text-5xl font-bold mb-8">Your Servers</h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {admin.map(({ id, name, imageUrl }) => (
          <div
            key={id}
            className="bg-card flex items-center justify-between p-6 rounded-lg shadow-lg hover:shadow-xl lg:hover:scale-105 transition-all duration-300"
          >
            <ServerBadge
              serverImage={imageUrl}
              lazyLoadServerImage
              className="w-20 h-20"
            />
            <h2 className="text-lg font-semibold capitalize">{name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllServersByRole;
