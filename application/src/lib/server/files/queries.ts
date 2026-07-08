import { eq, and, isNull } from "drizzle-orm";
import { db } from "$lib/server/db";
import { file } from "../db/schema";

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
    .orderBy(file.createdAt);
}