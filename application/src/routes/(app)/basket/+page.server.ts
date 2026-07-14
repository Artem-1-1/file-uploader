import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getDeletedUserFiles } from "$lib/server/files";

export const load: PageServerLoad = async({ locals }) => {
  if (!locals.user?.id) {
    throw redirect(303, "/sign-in");
  }

  const deletedFiles = await getDeletedUserFiles(locals.user.id);

  return { 
    deletedFiles
  };
}