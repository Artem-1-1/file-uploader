import { json } from "@sveltejs/kit";
import type { RequestHandler } from "./$types";
import { permanentlyDeleteUserFile, renameUserFile, restoreUserFile, softDeleteUserFile } from "$lib/server/files";

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