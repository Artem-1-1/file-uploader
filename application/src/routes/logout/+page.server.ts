import { redirect } from "@sveltejs/kit";
import { auth } from "$lib/server/auth";
import type { Actions } from "./$types";

export const actions: Actions = {
  default: async ({ cookies, request }) => {
    await auth.api.signOut({
      headers: request.headers
    });

    cookies.delete('better-auth.session_token', { path: '/' });
    cookies.delete('session', { path: '/' });

    cookies.set('theme', 'light', { 
      path: '/', 
      maxAge: 365 * 24 * 60 * 60,
      sameSite: 'lax'
    });
    
    throw redirect(303, '/sign-in');
  }
};