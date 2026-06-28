import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { auth } from "$lib/server/auth";

export const load: PageServerLoad = async() => {
  return {};
}

export const actions: Actions = {
  default: async({ request }) => {
    const formData = await request.formData();
    const email = formData.get('email')?.toString();

    if (!email) {
      return fail(400, {error: 'Email required.'})
    }

    try {
      await auth.api.requestPasswordReset({
        body: {
          email,
          redirectTo: 'http://localhost:5173/users/reset-password/',
        },
      });
      return {
        message: 'If an account with this email exists, we have sent a link.'
      };
    } catch(error) {
      console.error('Password reset error:', error);
      return fail(500, {error: "Internal Server Error"})
    }
  }
}