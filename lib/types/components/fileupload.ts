import { Json } from "@uploadthing/shared";
import { UploadThingError } from "uploadthing/server";

export interface FileUploadProps {
  endPoint: "serverImage" | "messageFile";
  customFileUploadIcon?: JSX.Element;
  getUploadStatus?: (isUpload: boolean) => void;
  onUploadProgress?: (progress: number) => void;
  onClientUploadComplete: (filesArr: FileDataModel[]) => void;
  onUploadError: (e: UploadThingError<Json>) => void;
  getCustomFileUploadErrors?: (emsg: string) => void;
}

export interface FileDataModel {
  customId?: any;
  key: string;
  name: string;
  serverData?: any;
  size: number;
  type: string;
  url: string;
}
