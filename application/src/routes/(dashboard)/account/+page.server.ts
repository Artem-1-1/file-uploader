import { fail } from "@sveltejs/kit";
import { UTFile } from "uploadthing/server";
import { updateUserAvatar } from "$lib/server/users";
import { utapi } from "$lib/server/uploadthing";
import type { Actions } from "./$types";

export const actions: Actions = {
  updateAvatar : async ({ request, locals }) => {
    const user = locals.user;
    if (!user?.id) {
      return fail(401, { message: 'Not authorized' });
    }

    const data = await request.formData();
    const file = data.get('avatar') as File | null;

    if (!file || file.size === 0) {
      return fail(400, { message: 'File not selected' });
    }

    const utFile = new UTFile([file], file.name, { type: file.type });
    const uploadResult = await utapi.uploadFiles(utFile);

    if (uploadResult.error) {
      console.error('Upload error в UploadThing:', uploadResult.error);
      return fail(500, { message: 'Failed to upload file' });
    }

    const newPhotoUrl = uploadResult.data.ufsUrl;
    const newPhotoKey = uploadResult.data.key;

    try {
      await updateUserAvatar(user.id, newPhotoUrl, newPhotoKey);
    } catch (error) {
      console.error('Error updating avatar in the database:', error);
      return fail(500, { message: 'Save error' });
    }
    return { success : true, newPhotoUrl };
  }
}