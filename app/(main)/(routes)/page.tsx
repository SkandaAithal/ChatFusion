"use client";

import { useState } from "react";
import authorizedRoute from "@/components/auth-components/AuthorizedRoute";
import UserAvatar from "@/components/common/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { SiDiscord } from "react-icons/si";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";

function Home() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    setIsDialogOpen(false);
  };
  return (
    <div className="">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="outline-none border border-none"
            aria-label="Customise options"
          >
            <UserAvatar />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-40 mx-4">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />

          <DropdownMenuItem className="w-full">
            Profile
            <DropdownMenuShortcut>
              <CgProfile size={20} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="w-full" onClick={handleDialogOpen}>
            Log out
            <DropdownMenuShortcut>
              <MdLogout size={20} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className="flex flex-col items-center justify-center text-center space-y-4 p-6 w-80 max-w-full"
          hideClose
        >
          <DialogTitle className="flex gap-3">
            <SiDiscord /> Logout
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to logout?
          </DialogDescription>
          <DialogFooter>
            <div className=" flex justify-center items-center gap-5 w-full">
              <Button
                onClick={handleDialogClose}
                className="outline-none border border-none focus:outline-none "
              >
                Cancel
              </Button>
              <Button onClick={handleLogout} variant={"destructive"}>
                Logout
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default authorizedRoute(Home);
