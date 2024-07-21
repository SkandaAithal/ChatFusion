import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = (uid: string) => {
  if (!uid) throw new UploadThingError("UnAuthorized user");
  return { userId: uid };
};
export const ourFileRouter = {
  serverImage: f({
    "image/png": { maxFileSize: "1MB", maxFileCount: 1, minFileCount: 0 },
    "image/jpeg": { maxFileSize: "1MB", maxFileCount: 1, minFileCount: 0 },
  })
    .middleware((req) => {
      return handleAuth(req.req.headers.get("authorization") ?? "");
    })
    .onUploadComplete(() => {}),
  messageFile: f(["image"])
    .middleware((req) => {
      return handleAuth(req.req.headers.get("authorization") ?? "");
    })
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
