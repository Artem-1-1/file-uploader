import { createUploadthing, type FileRouter, UTApi } from "uploadthing/server";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";
import { eq, and, isNull, sql } from "drizzle-orm";
import { db } from "$lib/server/db";
import { file, user } from "$lib/server/db/schema";
import { auth } from "./auth";
import { UPLOADTHING_TOKEN } from "$env/static/private";

export const utapi = new UTApi({ token: UPLOADTHING_TOKEN });

const f = createUploadthing();

export const OurFileRouter = {
  fileUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 50 },
    pdf: { maxFileSize: "16MB", maxFileCount: 10 },
    text: { maxFileSize: "4MB", maxFileCount: 10 },
  })
  .input(z.object({
    parentId: z.string().nullable(),
  }))
  .middleware(async ({ req, input, files }) => { 
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) throw new UploadThingError("Unauthorized");

    const currentUser = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: { id: true, storageUsed: true, storageLimit: true }
    });
    if (!currentUser) throw new UploadThingError("User not found");

    const totalUploadSize = files.reduce((acc, f) => acc + f.size, 0);

    const expectedStorageUsed = currentUser.storageUsed + totalUploadSize;
    if (expectedStorageUsed > currentUser.storageLimit) {
      throw new UploadThingError("Storage limit exceeded. Upgrade your plan.");
    }

    for (const uploadedFile of files) {
      const existingFile = await db.query.file.findFirst({
        where: and(
          eq(file.userId, session.user.id),
          eq(file.name, uploadedFile.name), 
          input.parentId ? eq(file.parentId, input.parentId) : isNull(file.parentId),
          isNull(file.deletedAt)
        )
      });

      if (existingFile) {
        throw new UploadThingError(`File "${uploadedFile.name}" already exists`);
      }
    }

    return {
      userId: currentUser.id,
      parentId: input.parentId,
    };
  })
  .onUploadComplete(async ({ metadata, file: uploadFile }) => {
    try {
      return await db.transaction(async (tx) => {
        const [updatedUser] = await tx.update(user)
          .set({ storageUsed: sql`${user.storageUsed} + ${uploadFile.size}` })
          .where(and(
            eq(user.id, metadata.userId),
            sql`${user.storageUsed} + ${uploadFile.size} <= ${user.storageLimit}`
          ))
          .returning();

        if (!updatedUser) throw new UploadThingError("Storage limit exceeded.");

        const [newFile] = await tx.insert(file).values({
          userId: metadata.userId,
          parentId: metadata.parentId,
          name: uploadFile.name,
          type: "file",
          size: uploadFile.size,
          mimeType: uploadFile.type,
          storagePath: uploadFile.key,
        }).returning();

        return { fileId: newFile.id, url: uploadFile.ufsUrl };
      });
    } catch (error) {
      console.error("Database transaction failed during upload:", error);
      await utapi.deleteFiles([uploadFile.key]).catch(console.error);
      if (error instanceof UploadThingError) throw error;
      throw new UploadThingError("Failed to save file metadata.");
    }
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof OurFileRouter;