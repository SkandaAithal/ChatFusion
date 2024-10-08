"use client";

import React, { useEffect, useState } from "react";
import ServerBadge from "./ServerBadge";
import PromptModal from "../modals/PromptModal";
import { CircularProgress } from "../common/CircularProgress";
import { BiImageAlt } from "react-icons/bi";
import { CreateServerFormData } from "@/lib/types/common";
import { useForm } from "react-hook-form";
import {
  createServerFormSchema,
  FILE_UPLOAD_SERVER_IMAGE,
} from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { UploadThingError } from "uploadthing/server";
import { Json } from "@uploadthing/shared";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";
import FileUplaod from "../common/FileUpload";
import { twMerge } from "tailwind-merge";
import { Input } from "../ui/input";
import useToast from "@/lib/hooks/use-toast";
import usePostMutation from "@/lib/hooks/use-post-mutation";
import { CreateServerProps } from "@/lib/types/components/create-server";
import { SERVERS, SERVERS_API } from "@/lib/routes";
import { getAPIUrl } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ServerCreationResponse } from "@/lib/types/queries/servers";

const CreateServer: React.FC<CreateServerProps> = ({
  renderCreateServerTriggerComponent,
}) => {
  const router = useRouter();
  const { showErrorToast, showToast } = useToast();
  const { performPostRequest, data, error, isLoading } =
    usePostMutation<ServerCreationResponse>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState("");

  const form = useForm<CreateServerFormData>({
    resolver: zodResolver(createServerFormSchema),
    defaultValues: {
      serverName: "",
      imageUrl: "",
    },
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  const getImageUploadingStatus = (isUpload: boolean) => {
    setIsUploading(isUpload);
  };

  const getImageUploadProgress = (progress: number) => {
    setUploadProgress(progress);
  };

  const handleCreateServer = async (data: CreateServerFormData) => {
    performPostRequest(getAPIUrl(SERVERS_API), {
      ...data,
    });
  };

  const handleCancelBtnClick = () => {
    form.reset();
  };

  const handleImageUploadError = (err: UploadThingError<Json>) => {
    if (err.message.includes("FileSizeMismatch")) {
      setUploadError("Maximum File Size: 1MB");
    } else {
      setUploadError(
        "An error occurred while uploading the image. Please try again."
      );
    }
  };

  const getCustomFileUploadErrors = (message: string) => {
    setUploadError(message);
  };

  useEffect(() => {
    if (error) {
      showErrorToast(error.message);
    } else if (data) {
      form.reset();
      setIsModalOpen(false);
      showToast(data.message);
      router.push(SERVERS);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  const renderAddImageIcon = (imgUrl: string) =>
    imgUrl ? (
      <></>
    ) : (
      <div className="absolute bg-primary dark:bg-black p-2 rounded-full bottom-0 right-0 z-30">
        <BiImageAlt />
      </div>
    );

  const renderImageUploadIcon = (imgUrl: string) => (
    <div className="relative flex items-center justify-center">
      <ServerBadge
        className="bg-background h-24 w-24"
        icon={renderAddImageIcon(imgUrl)}
        serverImage={imgUrl}
      />
      {isUploading && (
        <>
          {uploadProgress === 0 || uploadProgress === 100 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="spin-loader" />
            </div>
          ) : (
            <CircularProgress progress={uploadProgress} />
          )}
        </>
      )}
    </div>
  );

  const renderCreateServerModalElement = () => {
    return (
      <Form {...form}>
        <form className="space-y-6 w-full" onSubmit={(e) => e.preventDefault()}>
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <FileUplaod
                    endPoint={FILE_UPLOAD_SERVER_IMAGE}
                    getUploadStatus={getImageUploadingStatus}
                    onUploadProgress={getImageUploadProgress}
                    onClientUploadComplete={(files) => {
                      field.onChange(files[0].url);
                      setUploadError("");
                    }}
                    onUploadError={handleImageUploadError}
                    getCustomFileUploadErrors={getCustomFileUploadErrors}
                    customFileUploadIcon={renderImageUploadIcon(field.value)}
                  />
                </FormControl>
                <FormMessage
                  className={twMerge(
                    uploadError || form.formState.errors.imageUrl?.message
                      ? "text-red-500"
                      : "dark:text-primary text-muted-foreground"
                  )}
                >
                  {uploadError ? uploadError : "Server image"}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serverName"
            render={({ field }) => (
              <FormItem className="md:w-[60%]  mx-auto">
                <FormControl>
                  <Input placeholder="Server name" {...field} />
                </FormControl>
                <FormMessage className="text-red-500">
                  {form.formState.errors.serverName?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </form>
      </Form>
    );
  };

  return (
    <>
      {renderCreateServerTriggerComponent(showModal)}

      <PromptModal
        isModalOpen={isModalOpen}
        showModal={setIsModalOpen}
        modalTitle="Create your server"
        modalDescription="Easily create and customize your own servers with unique names, icons, and themes."
        handlePrimaryAction={form.handleSubmit(handleCreateServer)}
        primaryBtnText="Create"
        customModalElement={renderCreateServerModalElement()}
        isPrimaryBtnLoading={isLoading}
        handleCloseModalAction={handleCancelBtnClick}
      />
    </>
  );
};

export default CreateServer;
