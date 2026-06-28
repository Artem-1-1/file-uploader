import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { auth } from "$lib/server/auth";

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return fail(400, { error: "Email and password are required." });
    }

    try {
      await auth.api.signInEmail({ body: { email, password } });
      throw redirect(303, "/home");
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error) throw error;
      return fail(400, { error: "Invalid email or password." });
    }
  }
}