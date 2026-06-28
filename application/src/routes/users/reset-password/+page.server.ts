import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { auth } from "$lib/server/auth";

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const newPassword = formData.get('newPassword')?.toString();
    const confirmPassword = formData.get('confirmPassword')?.toString();
    const token = formData.get('token')?.toString();

    if (!token) {
      return fail(400, { error: 'Invalid link' });
    }

    if (!newPassword || newPassword.length < 8) {
      return fail(400, { error: 'Password must be at least 8 characters long' });
    }
        
    if (newPassword !== confirmPassword) {
      return fail(400, { error: 'Passwords do not match' });
    }

    try {
      await auth.api.resetPassword({
        body: {
          newPassword,
          token,
        }
      });
    } catch (error) {
      console.error('Password reset error:', error);
    }
    throw redirect(303, '/sign-in?message=password_reset_success');
  }
}