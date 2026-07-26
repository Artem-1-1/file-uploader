import { eq, and, isNull, isNotNull, inArray, desc, sql, type SQL, type InferSelectModel } from "drizzle-orm";
import { db } from "$lib/server/db";
import { file } from "../db/schema";
import { utapi } from "../uploadthing";

export async function getUserFiles(userId: string, parentId: string | null = null) {
  const conditions: SQL[] = [
    eq(file.userId, userId),
    isNull(file.deletedAt)
  ];

  if (parentId) {
    conditions.push(eq(file.parentId, parentId));
  } else {
    conditions.push(isNull(file.parentId));
  }

  return await db
    .select({
      id: file.id,
      name: file.name,
      type: file.type,
      mimeType: file.mimeType,
      path: file.storagePath,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
      size: sql<number>`
        CASE 
          WHEN ${file.type} = 'folder' THEN get_folder_size(${file.id}::text)
          ELSE ${file.size}
        END
      `.mapWith(Number),
    })
    .from(file)
    .where(and(...conditions))
    .orderBy(desc(file.createdAt));
}

type FolderPathItem = Pick<InferSelectModel<typeof file>, 'id' | 'name' | 'parentId'>;

export async function getFolderPath(folderId: string, userId: string) {
  const path: FolderPathItem[] = [];
  let currentId: string | null = folderId;

  let depth = 0;
  const MAX_DEPTH = 20;
  
  while(currentId && depth < MAX_DEPTH) {
    const folder: FolderPathItem | undefined = await db.query.file.findFirst({
      where: and(
        eq(file.id, currentId),
        eq(file.userId, userId)
      ),
      columns: {id: true, name: true, parentId: true }
    });

    if (!folder) break;

    path.unshift({ id: folder.id, name: folder.name, parentId: folder.parentId});
    currentId = folder.parentId;
    depth++;
  }
  return path;
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
  const idsToDelete = await getFolderSubtreeIds(userId, fileId);

  if (idsToDelete.length === 0) {
    throw new Error("File not found.")
  }

  await db
    .update(file)
    .set({ deletedAt: new Date() })
    .where(
      and(
        inArray(file.id, idsToDelete),
        eq(file.userId, userId)
      )
    );

  return { success: true };
}

export async function permanentlyDeleteUserFile(userId: string, fileId: string) {
  const itemsToDelete = await getFolderSubtreeDetails(userId, fileId);

  if (itemsToDelete.length === 0) {
    throw new Error("File not found.");
  }

  const idsToDelete = itemsToDelete.map(item => item.id);
  const keysToDelete = itemsToDelete.map(item => item.storagePath).filter((path): path is string => !!path);

  if (keysToDelete.length > 0) {
    try {
      await utapi.deleteFiles(keysToDelete);
    } catch (error) {
      console.error("Failed to delete files from UploadThing:", error);
      throw new Error("Failed to delete files from storage. Please try again.");
    }
  }

  await db
    .delete(file)
    .where(
      and(
        inArray(file.id, idsToDelete),
        eq(file.userId, userId)
      )
    );

  return { success: true}
}


export async function restoreUserFile(userId: string, fileId: string) {
  const idsToRestore = await getFolderSubtreeIds(userId, fileId);

  if (idsToRestore.length === 0) {
    throw new Error("File not found.")
  }

  await db
    .update(file)
    .set({ deletedAt: null, updatedAt: new Date()})
    .where(
      and(
        inArray(file.id, idsToRestore),
        eq(file.userId, userId)
      )
    )

  return { success: true }  
} 

async function getFolderSubtreeDetails(userId: string, rootId: string): Promise<Array<{ id: string; storagePath: string | null }>> {
  const query = sql`
    WITH RECURSIVE folder_tree AS (
      SELECT ${file.id} AS id, ${file.storagePath} AS storage_path
      FROM ${file} 
      WHERE ${file.id} = ${rootId} AND ${file.userId} = ${userId}
      
      UNION ALL
      
      SELECT ${file.id}, ${file.storagePath}
      FROM ${file}
      INNER JOIN folder_tree ft ON ${file.parentId} = ft.id
      WHERE ${file.userId} = ${userId}
    )
    SELECT id, storage_path AS "storagePath" FROM folder_tree;
  `;

  const rows = await db.execute(query);
  return rows as unknown as Array<{ id: string; storagePath: string | null }>;
}

async function getFolderSubtreeIds(userId: string, rootId: string): Promise<string[]> {
  const details = await getFolderSubtreeDetails(userId, rootId);
  return details.map((row) => row.id);
}

export async function getFileForDownload(userId: string, fileId: string) {
  const [fileFromDb] = await db
    .select({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      type: file.type,
      storagePath: file.storagePath,
    })
    .from(file)
    .where(
      and(
        eq(file.id, fileId),
        eq(file.userId, userId),
        isNull(file.deletedAt)
      )
    );

  if (!fileFromDb) {
    throw new Error("File not found.");
  }

  if (fileFromDb.type === "folder") {
    throw new Error("Cannot download a folder directly");
  }

  if (!fileFromDb.storagePath) {
    throw new Error("File storage path is missing.");
  }

  return fileFromDb; 
}