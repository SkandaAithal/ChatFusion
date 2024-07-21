import UserAvatar from "@/components/common/UserAvatar";
import CreateServer from "@/components/server-components/CreateServer";

import { ModeToggle } from "@/components/ui/mode-toggle";

const Home = () => {
  return (
    <div className="flex flex-col gap-3 justify-end items-center h-screen w-fit p-3 bg-background">
      <ModeToggle />
      <CreateServer />
      <UserAvatar />
    </div>
  );
};

export default Home;
