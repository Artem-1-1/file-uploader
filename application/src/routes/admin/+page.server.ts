import { auth } from "$lib/server/auth";
import { error } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ( event ) => {
  const { users, total } = await auth.api.listUsers({
    headers: event.request.headers,
    query: { limit: 20, offset: 0}
  })
  return { users, total }
}

export const actions: Actions = {
  banUser: async ({ request, locals }) => {
    if (locals.user?.role !== "admin") {
      throw error(403, "Forbidden");
    }

    const data = await request.formData();
    const userId = data.get("userId") as string;

    await auth.api.banUser({
      body: {
        userId
      }
    })
  return { success: true };  
  },

  unbanUser: async({ request, locals }) => {
    if (locals.user?.role !== "admin") {
      throw error(403, "Forbidden");
    }

    const data = await request.formData();
    const userId = data.get("userId") as string;

    await auth.api.unbanUser({
      body: { userId}
    });
    return { success: true };
  },
}