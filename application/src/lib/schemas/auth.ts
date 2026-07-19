import { z } from "zod";

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, { error: "Username must be at least 3 character." })
      .max(30, { error: "Username must be at most 30 character" }),
    email: z
      .email({ error: "Please enter a valid email address" }),
    password: z
      .string()
      .min(8, { error: "Password must be at least 8 characters." }),
    "password-conf": z
      .string()
      .min(1, { error: "Please confirm your password." }),
  })
  .refine((data) => data.password === data["password-conf"], {
    message: "Passwords do not match.",
    path: ["password-conf"],
  });

export const signInSchema = z.object({
  email: z.email({ error: "Please enter a valid email address." }),
  password: z.string().min(1, { error: "Password is required." }),
});  