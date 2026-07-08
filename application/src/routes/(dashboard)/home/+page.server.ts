import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getUserFiles } from '$lib/server/files'; 

export const load: PageServerLoad = async ({ locals, url }) => {
  if (!locals.user?.id) {
    throw redirect(303, "/sign-in");
  }

  const parentId = url.searchParams.get('parentId');
  const files = await getUserFiles(locals.user.id);
  
  return { 
    files,
    parentId };
};