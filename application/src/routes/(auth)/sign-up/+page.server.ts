import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { auth } from "$lib/server/auth";
import { signUpSchema } from "$lib/schemas/auth";

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const getData = Object.fromEntries(formData.entries());

    const result = signUpSchema.safeParse(getData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      const errors: Record<string, string> = {};
      for (const [key, messages] of Object.entries(fieldErrors)) {
        if (messages?.[0]) {
          errors[key] = messages[0];
        }
      }

      return fail(400, {
        error: "Please fix the errors below.",
        errors,
      });
    }

    const { name, email, password } = result.data;
    
    try {
      await auth.api.signUpEmail({
        body: { name, password, email }
      });
    } catch (error) {
      if (error && typeof error === 'object' && 'status' in error && 'location' in error) {
        throw error;
      }

      console.error("Sign up error:", error);

      let errorMessage = "Failed to create account.";
      
      if (error && typeof error === "object" && "body" in error) {
        const authError = error as { body: { message?: string; code?: string } };
        if (authError.body.message) {
          errorMessage = authError.body.message;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      return fail(400, { error: errorMessage, errors: {} as Record<string, string> });
    }
    throw redirect(303, "/sign-in?message=signup_success");
  }
}