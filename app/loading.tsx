import React from "react";

const AnimatedLoader: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-t-4 border-r-4 border-transparent border-t-discord border-r-discord rounded-full animate-spin"></div>
        <div className="absolute inset-1 border-4 border-t-4 border-r-4  border-transparent border-t-white border-r-white rounded-full animate-spin-slow"></div>
        <div className="absolute inset-2 border-4 border-t-4 border-r-4  border-transparent border-t-purple-500 border-r-purple-500  rounded-full animate-spin-reverse"></div>
      </div>
    </div>
  );
};

export default AnimatedLoader;
