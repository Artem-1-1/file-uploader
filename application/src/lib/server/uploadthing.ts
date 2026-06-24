import { createUploadthing, type FileRouter } from "uploadthing/server";
import { auth } from "./auth";

const f = createUploadthing();

export  const ourFileRouter = {
  fileUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
    pdf: { maxFileSize: "16MB", maxFileCount: 1 }
  })

  .middleware(async ({req}) => {
    const session = await auth.api.getSession({ headers: req.headers})

    if (!session || !session.user) {
      throw new Error("Unauthorized")
    }
    return { userId: session.user.id}
  })
  .onUploadComplete(async ({metadata, file}) => {
    console.log("File successfully uploaded to the cloud:", file.url);
    console.log("User ID who uploaded the file:", metadata.userId);
  }),
} satisfies FileRouter;

export type ourFileRouter = typeof ourFileRouter;