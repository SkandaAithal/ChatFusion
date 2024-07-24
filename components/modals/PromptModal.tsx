import Image from "next/image";
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

const PromptModal: React.FC<PromptModalProps> = ({
  isModalOpen,
  showModal,
  modalTitle,
  handlePrimaryAction,
  handleCloseModalAction,
  showLogo = false,
  primaryBtnText,
  closeBtnText = "Cancel",
  modalDescription,
  customModalElement,
  isPrimaryBtnLoading = false,
}) => {
  const handlePrimaryBtnClick = () => {
    if (handlePrimaryAction) {
      handlePrimaryAction();
    }
  };

  const handleCloseModalBtnClick = () => {
    if (handleCloseModalAction) {
      handleCloseModalAction();
    }
    showModal();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={showModal}>
      <DialogContent
        className="flex flex-col items-center justify-center text-center space-y-4 py-10 bg-card w-[90vw] max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-[50vw]"
        hideClose
      >
        {showLogo ? (
          <div className="overflow-hidden">
            <Image
              src="/assets/chat-fusion.png"
              alt="Chat fusion logo"
              width={100}
              height={100}
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="grid gap-2">
          <DialogTitle className="text-xl min-[400px]:text-2xl !m-0 md:text-3xl">
            {modalTitle}
          </DialogTitle>
          {modalDescription ? (
            <DialogDescription className="text-base max-w-lg">
              {modalDescription}
            </DialogDescription>
          ) : null}
        </div>
        {customModalElement ? customModalElement : null}
        <DialogFooter className="w-full">
          <div className="flex flex-col md:flex-row justify-center mx-auto items-center gap-5 w-full">
            <Button
              onClick={handleCloseModalBtnClick}
              size="lg"
              className="outline-none border border-none w-[60%] md:w-auto focus:outline-none"
            >
              {closeBtnText}
            </Button>
            {primaryBtnText && handlePrimaryAction ? (
              <Button
                onClick={handlePrimaryBtnClick}
                variant="destructive"
                size="lg"
                className="outline-none border border-none w-[60%] md:w-auto focus:outline-none"
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
