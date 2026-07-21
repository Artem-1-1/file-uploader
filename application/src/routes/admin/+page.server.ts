import { auth, type User } from "$lib/server/auth";
import { error } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ( event ) => {
  const response = await auth.api.listUsers({
    headers: event.request.headers,
    query: { limit: 20, offset: 0}
  })
  // console.log(response.users);
  return { 
    users: response.users as User[],
    total: response.total }
}

export const actions: Actions = {
  changeRole: async({ request, locals}) => {
    if (locals.user?.role !== "admin") {
      throw error(403, "Forbidden");
    }

    const data = await request.formData();
    const userId = data.get("userId") as string;
    const role = data.get("role") as "user" | "admin";

    await auth.api.setRole({
      body: { userId, role },
      headers: request.headers,
    })
    return { success: true}
  },

  banUser: async ({ request, locals }) => {
    if (locals.user?.role !== "admin") {
      throw error(403, "Forbidden");
    }

    const data = await request.formData();
    const userId = data.get("userId") as string;
    const reason = data.get("reason") as string; 

    await auth.api.banUser({
      body: { userId, banReason: reason,},
      headers: request.headers
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
      body: { userId },
      headers: request.headers
    });
    return { success: true };
  },

  deleteUser: async ({ request, locals}) => {
    if (locals.user?.role !== "admin") {
      throw error(403, "Forbidden");
    }

    const data = await request.formData();
    const userId = data.get("userId") as string;

    await auth.api.removeUser({
      body: { userId },
      headers: request.headers,
    })
    return { success: true };
  },

  updateStorage: async({ request, locals }) => {
    if (locals.user?.role !== "admin") {
      throw error(403, "Forbidden");
    }

    const data = await request.formData();
    const userId = data.get("userId") as string;
    const storageLimit = parseInt(data.get("storageLimit") as string, 10);

    await auth.api.adminUpdateUser({
    body: {
      userId: userId,
      data: {
        storageLimit: storageLimit,
      },
    },
    headers: request.headers,
  });
   return { success: true }; 
   }
}