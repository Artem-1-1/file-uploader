import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { auth } from "$lib/server/auth";
import { signInSchema } from "$lib/schemas/auth";

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const getData = Object.fromEntries(formData.entries());

    const result = signInSchema.safeParse(getData);

    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const [key, messages] of Object.entries(result.error.flatten().fieldErrors)) {
        if (messages?.[0]) errors[key] = messages[0];
      }
      return fail(400, { error: "Please fix the errors below.", errors });
    }

    const { email, password } = result.data;

    try {
      await auth.api.signInEmail({ body: { email, password } });
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error && 'location' in error) {
        throw error; 
      }
      console.error("Auth error:", error);
      const errors: Record<string, string> = {};
      return fail(400, { error: "Invalid email or password.", errors  });
    }
    throw redirect(303, "/home");  
  }
}