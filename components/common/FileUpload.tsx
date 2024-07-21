import { useUploadThing } from "@/lib/hooks/use-uploadthing";
import { useAuth } from "@/lib/providers/auth-provider";
import { FileUploadProps } from "@/lib/types/components/fileupload";
import { useDropzone } from "@uploadthing/react";
import { useCallback, useEffect, useState } from "react";
import { generateClientDropzoneAccept } from "uploadthing/client";

const FileUplaod: React.FC<FileUploadProps> = ({
  endPoint,
  customFileUploadIcon,
  getUploadStatus,
  onUploadProgress,
  onUploadError,
  onClientUploadComplete,
  getCustomFileUploadErrors,
}) => {
  const { user } = useAuth();
  const [files, setFiles] = useState<File[]>([]);
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
  }, []);

  const { startUpload, permittedFileInfo, isUploading } = useUploadThing(
    endPoint,
    {
      onClientUploadComplete,
      onUploadError,
      onUploadProgress: (progress: number) => {
        if (onUploadProgress) {
          onUploadProgress(progress);
        }
      },
      skipPolling: true,
      headers: {
        authorization: user?.uid ?? "",
      },
    }
  );

  useEffect(() => {
    if (files.length === 1) {
      startUpload(files);
      setFiles([]);
    } else if (getCustomFileUploadErrors && files.length >= 1) {
      getCustomFileUploadErrors("Limit: One image per upload.");
      setFiles([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files]);

  useEffect(() => {
    if (getUploadStatus) {
      getUploadStatus(isUploading);
    }
    if (!isUploading && onUploadProgress) {
      onUploadProgress(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUploading]);

  const fileTypes = permittedFileInfo?.config
    ? Object.keys(permittedFileInfo?.config)
    : [];

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: fileTypes ? generateClientDropzoneAccept(fileTypes) : undefined,
  });

  return (
    <div {...getRootProps()} className="w-fit mx-auto">
      <input {...getInputProps()} />
      {customFileUploadIcon ? (
        customFileUploadIcon
      ) : (
        <div>
          <div>
            {files.length > 0 && <div>Upload {files.length} files</div>}
          </div>
          Drop files here!
        </div>
      )}
    </div>
  );
};

export default FileUplaod;
