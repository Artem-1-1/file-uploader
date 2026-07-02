import type { LayoutServerLoad } from "./$types";
import { getUserById } from "$lib/server/users";

export const load: LayoutServerLoad = async ({ locals }) => {
  if (!locals.user?.id) {
    return { user: null };
  }

  const freshUser = await getUserById(locals.user.id);

  return {
    user: freshUser ? {
      id: freshUser.id,
      name: freshUser.name,
      email: freshUser.email,
      image: freshUser.image,
      role: freshUser.role,
    } : null
  };
};