import { eq, and, isNull, isNotNull, inArray, desc } from "drizzle-orm";
import { db } from "$lib/server/db";
import { file } from "../db/schema";
import { utapi } from "../uploadthing";

export async function getUserFiles(userId: string) {
  return await db
    .select({
      id: file.id,
      name: file.name,
      type: file.type,
      size: file.size,
      mimeType: file.mimeType,
      path: file.storagePath,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    })
    .from(file)
    .where(
      and(
        eq(file.userId, userId),
        isNull(file.deletedAt)
      )
    )
    .orderBy(desc(file.createdAt));
}

export async function renameUserFile(userId: string, fileId: string, newName: string) {
  if (!newName || newName.trim() === "") {
    throw new Error("File name cannot be empty.");
  }

  const [updatedFile] = await db
    .update(file)
    .set({name: newName.trim(), updatedAt: new Date()})
    .where(
      and(
        eq(file.id, fileId),
        eq(file.userId, userId)
      )
    )
    .returning({ id: file.id });
  if (!updatedFile) {
    throw new Error("File not found or access denied");
  }
  return { success: true };  
}

export async function getDeletedUserFiles(userId: string) {
  return await db.query.file.findMany({
    where: and(
      eq(file.userId, userId),
      isNotNull(file.deletedAt)
    ),
    orderBy: (files, {desc}) => [desc(files.deletedAt)]
  })
}

export async function softDeleteUserFile(userId: string, fileId: string) {
  const [targetFile] = await db
    .select({
      id: file.id,
      type: file.type
    })
    .from(file)
    .where(
      and(
        eq(file.id, fileId),
        eq(file.userId, userId),
        isNull(file.deletedAt)
      )
    )
    .limit(1);

  if (!targetFile) {
    throw new Error("File not found, access denied, or already deleted.");
  }

  const idsToSoftDelete: string[] = [fileId];

  if (targetFile.type === "folder") {
    await collectFolderContentsForSoftDelete(userId, fileId, idsToSoftDelete);
  }

  await db
    .update(file)
    .set({ deletedAt: new Date() })
    .where(
      and(
        inArray(file.id, idsToSoftDelete),
        eq(file.userId, userId)
      )
    );

  return { success: true };
}

async function collectFolderContentsForSoftDelete(
  userId: string, 
  folderId: string, 
  allIds: string[]
) {
  const children = await db
    .select({ 
      id: file.id, 
      type: file.type
    })
    .from(file)
    .where(
      and(
        eq(file.parentId, folderId),
        eq(file.userId, userId),
        isNull(file.deletedAt)
      )
    );

  for (const child of children) {
    allIds.push(child.id);
    
    if (child.type === "folder") {
      await collectFolderContentsForSoftDelete(userId, child.id, allIds);
    }
  }
}

export async function permanentlyDeleteUserFile(userId: string, fileId: string) {
  const [targetFile] = await db
  .select({
    storagePath: file.storagePath,
    type: file.type
  })
  .from(file)
  .where(
    and(
      eq(file.id, fileId),
      eq(file.userId, userId)
    )
  )
  .limit(1)

  if(!targetFile) {
    throw new Error("File not found or access denied.")
  }

  const idsToDelete: string[] = [fileId];
  const keysToDelete: string[] = [];

  if (targetFile.type === "folder") {
    await collectFolderContentsForPermDelete(userId, fileId, idsToDelete, keysToDelete);
  } else if (targetFile.storagePath) {
    keysToDelete.push(targetFile.storagePath);
  }

  await db
    .delete(file)
    .where(
      and(
        inArray(file.id, idsToDelete),
        eq(file.userId, userId)
      )
    );

  if (keysToDelete.length > 0) {
    try {
      await utapi.deleteFiles(keysToDelete);
    } catch (error) {
      console.error("Failed to delete files from UploadThing:", error);
    }
  }
  return { success: true}
}

async function collectFolderContentsForPermDelete(
  userId: string, 
  folderId: string, 
  allIds: string[], 
  allKeys: string[]
) {
  const children = await db
    .select({ 
      id: file.id, 
      type: file.type, 
      storagePath: file.storagePath 
    })
    .from(file)
    .where(
      and(
        eq(file.parentId, folderId),
        eq(file.userId, userId)
      )
    );

  for (const child of children) {
    allIds.push(child.id);
    
    if (child.type === "folder") {
      await collectFolderContentsForPermDelete(userId, child.id, allIds, allKeys);
    } else if (child.storagePath) {
      allKeys.push(child.storagePath); 
    }
  }
}