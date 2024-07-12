"use client";

import { useState } from "react";
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
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { useAuth } from "@/components/providers/auth-provider";
import { AuthActionTypes } from "@/lib/types/auth";
import { useRouter } from "next/navigation";
import { LOGIN } from "@/lib/routes";
import Image from "next/image";

function Home() {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { dispatch } = useAuth();
  const handleDialogOpen = () => {
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
  };
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.clear();
    router.push(LOGIN);
    setIsDialogOpen(false);
    dispatch({ type: AuthActionTypes.SIGN_OUT_USER });
  };
  return (
    <>
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
          className="flex flex-col items-center justify-center text-center space-y-4 py-10 bg-card w-[90vw] max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-[50vw]"
          hideClose
        >
          <div className="h-28 w-28 overflow-hidden">
            <Image
              src="/assets/chat-fusion.png"
              alt="Chat fusion logo"
              width={140}
              height={140}
              className="object-cover scale-150"
            />
          </div>
          <DialogTitle className="text-xl min-[400px]:text-2xl !m-0 md:text-3xl">
            Are you sure you want to Logout?
          </DialogTitle>

          <DialogFooter className="w-full">
            <div className="flex flex-col md:flex-row justify-center mx-auto items-center gap-5 w-full">
              <Button
                onClick={handleDialogClose}
                size="lg"
                className="outline-none border border-none w-[60%] md:w-auto focus:outline-none"
              >
                Cancel
              </Button>
              <Button
                onClick={handleLogout}
                variant="destructive"
                size="lg"
                className="outline-none border border-none w-[60%] md:w-auto focus:outline-none"
              >
                Logout
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Home;
