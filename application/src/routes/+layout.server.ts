import type { LayoutServerLoad } from "./$types";
import { getUserById } from "$lib/server/users";

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
  const currentTheme = cookies.get('theme') || 'light';

  if (!locals.user?.id) {
    return { 
      user: null,
      theme: currentTheme
     };
  }

  const freshUser = await getUserById(locals.user.id);

  return {
    user: freshUser ? {
      id: freshUser.id,
      name: freshUser.name,
      email: freshUser.email,
      image: freshUser.image,
      role: freshUser.role,
      storageUsed: freshUser.storageUsed,
      storageLimit: freshUser.storageLimit,
    } : null,
    theme: currentTheme
  };
};