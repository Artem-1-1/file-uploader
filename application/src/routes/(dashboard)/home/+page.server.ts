import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const parentId = url.searchParams.get('parentId');

  return {
    parentId
  };
};