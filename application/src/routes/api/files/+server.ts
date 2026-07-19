import { json, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";
import { permanentlyDeleteUserFile, renameUserFile, restoreUserFile, softDeleteUserFile, getFileForDownload } from "$lib/server/files";
import { UPLOADTHING_APP_ID } from "$env/static/private";

const FileIdSchema = z.object({
  fileId: z.string().min(1, "Missing fileId")
})

const PatchActionSchema = z.discriminatedUnion("action", [
  FileIdSchema.extend({ action: z.literal("basket") }),
  FileIdSchema.extend({ action: z.literal("restore") }),
  FileIdSchema.extend({ action: z.literal("rename"), newName: z.string().min(1, "Missing newName")})
]);

const handleServerError = (error: unknown, context: string) => {
  console.error(`API ${context} Error:`, error);
  return json({ error: "Internal Server Error" }, { status: 500 });
};


export const GET: RequestHandler = async({ url, locals}) => {
  const userId = locals.user?.id;
  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const queryResult = FileIdSchema.safeParse({ fileId: url.searchParams.get("fileId")});
  if (!queryResult.success) {
    return json({ error: queryResult.error.issues[0].message }, { status: 400 });
  }
  const { fileId } = queryResult.data;

  try {
    const fileData = await getFileForDownload(userId, fileId);
    const fileUrl = `https://${UPLOADTHING_APP_ID}.ufs.sh/f/${fileData.storagePath}`;
    const utResponse = await fetch(fileUrl);

    if (!utResponse.ok) {
      console.error(`UploadThing fetch failed with status: ${utResponse.status}`);
      return json({ error: "Failed to fetch file from storage" }, { status: 500 });
    }

    return new Response(utResponse.body, {
      headers: {
        "Content-Type": fileData.mimeType || "application/octet-stream",
        "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(fileData.name)}`,
        "Cache-Control": "private, max-age=3600"
      }
    })
  } catch (error) {
    console.error("API Get Download Error: ", error);
    return handleServerError(error, "Get Download");
  }
}

export const PATCH: RequestHandler = async({ request, locals }) => {
  const userId = locals.user?.id;
  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const parseResult = PatchActionSchema.safeParse(body);
    if (!parseResult.success) {
      const firstError = parseResult.error.issues[0];
      const errorMessage = firstError.message === "Required" ? `Missing ${firstError.path.join(".")}` : firstError.message;
      return json({ error: errorMessage }, { status: 400 });
    }

    const data = parseResult.data;

    switch (data.action) {
      case "basket":
        await softDeleteUserFile(userId, data.fileId);
        break
      case "restore":
        await restoreUserFile(userId, data.fileId);
        break
      case "rename":
        await renameUserFile(userId, data.fileId, data.newName)
    }
    
  return json({ success: true});
  } catch(error) {
    return handleServerError(error, "Patch");
  }
};

export const DELETE: RequestHandler = async({ request, locals }) => {
  const userId = locals.user?.id;
  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const parseResult = FileIdSchema.safeParse(body);

    if (!parseResult.success) {
      return json({ error: parseResult.error.issues[0].message }, { status: 400 });
    }

    const { fileId } = parseResult.data;
    await permanentlyDeleteUserFile(userId, fileId)

    return json({ success: true});
  } catch (error) {
    return handleServerError(error, "Delete");
  }
}