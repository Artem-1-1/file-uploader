import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { permanentlyDeleteUserFile, renameUserFile, restoreUserFile, softDeleteUserFile, getFileForDownload } from "$lib/server/files";
import { UPLOADTHING_APP_ID } from "$env/static/private";

export const GET: RequestHandler = async({ url, locals}) => {
  const userId = locals.user?.id;
  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const fileId = url.searchParams.get("fileId");
  if (!fileId) {
    return json({ error: "Missing fileId" }, { status: 400 });
  }

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
  } catch (error: any) {
    console.error("API Get Download Error: ", error);
    return json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export const PATCH: RequestHandler = async({ request, locals }) => {
  const userId = locals.user?.id;
  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fileId, action, newName } = await request.json();

  if (!fileId || !action) {
    return json({ error: "Missing fileId or action" }, { status: 400 });
  }
  if (action === "basket") {
    await softDeleteUserFile(userId, fileId)
  } else if (action === "rename") {
    if (!newName) return json({ error: "Missing newName" }, { status: 400 });
    await renameUserFile(userId, fileId, newName)
  } else if (action === "restore"){
    await restoreUserFile(userId, fileId)
  }
   else {
    return json({ error: "Invalid action" }, { status: 400 });
  }

  return json({ success: true});
  } catch(error: any) {
    console.error("API Patch Error: ", error);
    return json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async({ request, locals }) => {
  const userId = locals.user?.id;
  if (!userId) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fileId } = await request.json();

    if (!fileId) {
    return json({ error: "Missing fileId." }, { status: 400 });
    }

    await permanentlyDeleteUserFile(userId, fileId);
    return json({ success: true});
  } catch (error: any) {
    console.error("API Delete Error: ", error);
    return json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}