import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { PromptModalProps } from "@/lib/types/components/modal";
import { useApp } from "@/lib/providers/app-provider";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import LazyImage from "../ui/lazy-image";

const PromptModal: React.FC<PromptModalProps> = ({
  isModalOpen,
  showModal,
  modalTitle,
  handlePrimaryAction,
  handleCloseModalAction,
  showLogo = false,
  primaryBtnText,
  closeBtnText = "Cancel",
  modalDescription = "",
  customModalElement,
  isPrimaryBtnLoading = false,
}) => {
  const { isMobile } = useApp();
  const handlePrimaryBtnClick = () => {
    if (handlePrimaryAction) {
      handlePrimaryAction();
    }
  };

  const handleCloseModalBtnClick = () => {
    if (handleCloseModalAction) {
      handleCloseModalAction();
    }
    showModal(false);
  };

  return isMobile ? (
    <Drawer open={isModalOpen} onOpenChange={showModal}>
      <DrawerContent className="flex flex-col items-center justify-center text-center space-y-4 bg-card px-8">
        {showLogo ? (
          <div className="overflow-hidden">
            <LazyImage
              src="/assets/chat-fusion.png"
              alt="Chat fusion logo"
              width={100}
              height={100}
              className="object-cover"
              isLazyLoad
            />
          </div>
        ) : null}
        <div className="grid gap-2">
          <DrawerHeader>
            <DrawerTitle className="text-center"> {modalTitle}</DrawerTitle>
            <DrawerDescription className="text-center">
              {modalDescription}
            </DrawerDescription>
          </DrawerHeader>
        </div>
        {customModalElement ? customModalElement : null}
        <DrawerFooter className="w-full">
          <div className="flex flex-col justify-center mx-auto mb-6 items-center gap-5 w-full">
            {primaryBtnText && handlePrimaryAction ? (
              <Button
                onClick={handlePrimaryBtnClick}
                variant="destructive"
                size="lg"
                className="outline-none border border-none w-full"
                type="button"
                disabled={isPrimaryBtnLoading}
                loading={isPrimaryBtnLoading}
                loaderTheme="light"
              >
                {primaryBtnText}
              </Button>
            ) : null}
            <Button
              onClick={handleCloseModalBtnClick}
              size="lg"
              className="outline-none border border-none w-full"
            >
              {closeBtnText}
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isModalOpen} onOpenChange={showModal}>
      <DialogContent
        className="flex flex-col items-center justify-center text-center space-y-4 py-10 bg-card w-[90vw] max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-[50vw]"
        hideClose
      >
        {showLogo ? (
          <div className="overflow-hidden">
            <LazyImage
              src="/assets/chat-fusion.png"
              alt="Chat fusion logo"
              width={100}
              height={100}
              className="object-cover"
              isLazyLoad
            />
          </div>
        ) : null}
        <div className="grid gap-2">
          <DialogTitle className="text-xl min-[400px]:text-2xl !m-0 md:text-3xl">
            {modalTitle}
          </DialogTitle>
          <DialogDescription className="text-base max-w-lg">
            {modalDescription}
          </DialogDescription>
        </div>
        {customModalElement ? customModalElement : null}
        <DialogFooter className="w-full">
          <div className="flex justify-center mx-auto items-center gap-5 w-full">
            <Button
              onClick={handleCloseModalBtnClick}
              size="lg"
              className="outline-none border border-none w-auto"
            >
              {closeBtnText}
            </Button>
            {primaryBtnText && handlePrimaryAction ? (
              <Button
                onClick={handlePrimaryBtnClick}
                variant="destructive"
                size="lg"
                className="outline-none border border-none w-auto"
                type="button"
                disabled={isPrimaryBtnLoading}
                loading={isPrimaryBtnLoading}
                loaderTheme="light"
              >
                {primaryBtnText}
              </Button>
            ) : null}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromptModal;
