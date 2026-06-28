import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { auth } from "$lib/server/auth";

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get("name")?.toString();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const passwordConf = formData.get("password-conf")?.toString();

    if (!name || !email || !password || !passwordConf) {
      return fail(400, { error: "All fields are required." });
    }

    if (password !== passwordConf) {
      return fail(400, { error: "Passwords do not match!" });
    }

    if (password.length < 8) {
      return fail(400, { error: "Password must be at least 8 characters long." });
    }

    try {
      await auth.api.signUpEmail({
        body: {
          name,
          password,
          email,
        }
      })
      throw redirect(303, "/sign-in?message=signup_success");
    } catch (error) {
      if (error && typeof error === "object" && "status" in error) {
        throw error;
      }
      console.error("Sign up error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to create account.";
      return fail(400, { error: errorMessage });
    }
  }
}