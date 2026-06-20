import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async(event) => {
  return {
    user: event.locals.user ? {
      id: event.locals.user.id,
      name: event.locals.user.name,
      email: event.locals.user.email,
      role: event.locals.user.role,
    } : null
  };
};