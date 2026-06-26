import { json } from "@sveltejs/kit";
import { db } from "$lib/server/db";
import { file } from "$lib/server/db/schema";
import { eq, and, isNull, type SQL } from "drizzle-orm";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, locals }) => {
  if (!locals.user) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }
  
  const { name, parentId } = await request.json();
  const userId = locals.user.id;

  try {
    if (parentId) {
      const parentFolder = await db.query.file.findFirst({
        where: and(
          eq(file.id, parentId),
          eq(file.userId, userId),
          eq(file.type, 'folder'),
          isNull(file.deletedAt)
        )
      });

      if (!parentFolder) {
        return json({ error: "Parent folder not found or access denied" }, { status: 404 });
      }
    }

    const whereConditions: SQL[] = [
      eq(file.userId, userId),
      eq(file.name, name),
      isNull(file.deletedAt)
    ];

    if (parentId) {
      whereConditions.push(eq(file.parentId, parentId));
    } else {
      whereConditions.push(isNull(file.parentId));
    }

    const existing = await db.query.file.findFirst({
      where: and(...whereConditions)
    });

    if (existing) {
      return json({ error: "Folder already exists" }, { status: 409 });
    }

    const [newFolder] = await db.insert(file).values({
      userId,
      parentId: parentId || null,
      name,
      type: 'folder',
      size: 0,
    }).returning();

    return json(newFolder, { status: 201 });

  } catch (error) {
    console.error("Error creating folder:", error);
    return json({ error: "Failed to create folder" }, { status: 500 });
  }
};