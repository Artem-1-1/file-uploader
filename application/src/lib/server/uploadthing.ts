import { createUploadthing, type FileRouter } from "uploadthing/server";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { eq, and, isNull, sql } from "drizzle-orm";
import { db } from "$lib/server/db";
import { file, user } from "$lib/server/db/schema";
import { auth } from "./auth";

const f = createUploadthing();

export  const ourFileRouter = {
  fileUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 4 },
    pdf: { maxFileSize: "16MB", maxFileCount: 1 }
  })
  .input(z.object({
    parentId: z.string().nullable(),
    filename: z.string().min(1),
    fileSize: z.number().positive(),
  }))
  .middleware(async ({ req, input }) => {
    const session = await auth.api.getSession({ headers: req.headers})

    if (!session || !session.user) {
      throw new UploadThingError("Unauthorized")
    }

    const currentUser = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: { id: true, storageUsed: true, storageLimit: true }
    });

    if (!currentUser) throw new UploadThingError("User not found");

    const expectedStorageUsed = currentUser.storageUsed + input.fileSize;
    if (expectedStorageUsed > currentUser.storageLimit) {
      throw new UploadThingError("Storage limit exceeded. Upgrade your plan.");
    }

    const existingFile = await db.query.file.findFirst({
      where: and(
        eq(file.userId, session.user.id),
        eq(file.name, input.filename),
        input.parentId ? eq(file.parentId, input.parentId) : isNull(file.parentId),
        isNull(file.deletedAt)
      )
    });

    if (existingFile) {
      throw new UploadThingError("File with this name already exists in this folder");
    }

    return {
      userId: currentUser.id,
      parentId: input.parentId,
      filename: input.filename,
    };
  })
  .onUploadComplete(async ({metadata, file: uploadFile }) => {
      const [updatedUser] = await db.update(user)
      .set({ storageUsed: sql`${user.storageUsed} + ${uploadFile.size}` })
      .where(and(
        eq(user.id, metadata.userId),
        sql`${user.storageUsed} + ${uploadFile.size} <= ${user.storageLimit}`
      ))
      .returning();

    if (!updatedUser) {
      throw new UploadThingError("Storage limit exceeded.");
    }

    const [newFile] = await db.insert(file).values({
      userId: metadata.userId,
      parentId: metadata.parentId,
      name: metadata.filename,
      type: "file",
      size: uploadFile.size,
      mimeType: uploadFile.type,
      storagePath: uploadFile.key,
    }).returning();

    return { fileId: newFile.id, url: uploadFile.url};
  }),
} satisfies FileRouter;

export type ourFileRouter = typeof ourFileRouter;