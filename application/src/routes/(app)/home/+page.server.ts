import type { PageServerLoad, Actions } from './$types';
import { redirect, fail } from '@sveltejs/kit';
import { getUserFiles, getFolderPath } from '$lib/server/files';
import { db } from '$lib/server/db';
import { file } from '$lib/server/db/schema';
import { eq, and, isNull, type SQL } from "drizzle-orm"; 

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user?.id) {
    throw redirect(303, "/sign-in");
  }

  const parentId = url.searchParams.get('parentId');
  const files = await getUserFiles(locals.user.id, parentId);

  let breadcrumbsPath: { id: string, name: string}[] = [];
  let backToId: string | null = null;

  if (parentId) {
    const fullPath = await getFolderPath(parentId, locals.user.id);
    if (fullPath.length > 0) {
      breadcrumbsPath = fullPath.map(f => ({ id: f.id, name: f.name}))
      backToId = fullPath[fullPath.length - 1].parentId;
    }
  }
  
  return { 
    files,
    parentId,
    breadcrumbsPath,
    backToId };
};

export const actions: Actions = {
  createFolder: async ({ request, locals }) => {
    if (!locals.user?.id) {
      return fail(401, { error: "Unauthorized" });
    }

    const formData = await request.formData();
    const name = formData.get("name")?.toString().trim();
    const parentId = formData.get("parentId")?.toString() || null;
    const userId = locals.user.id;

    if (!name) {
      return fail(400, { error: "Folder name cannot be empty", name });
    }

    try {
      if (parentId) {
        const parentFolder = await db.query.file.findFirst({
          where: and(
            eq(file.id, parentId),
            eq(file.userId, userId),
            eq(file.type, "folder"),
            isNull(file.deletedAt)
          )
        });
        if (!parentFolder) {
          return fail(404, { error: "Parent folder not found or access denied", name });
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
        return fail(409, { error: "Folder already exists", name });
      }

      await db.insert(file)
        .values({
          userId,
          parentId: parentId || null,
          name,
          type: "folder",
          size: 0
        });
        return { success: true };  
    } catch (error) {
      console.error("Error creating folder:", error);
      return fail(500, { error: "Failed to create folder", name });
    }
  }
}