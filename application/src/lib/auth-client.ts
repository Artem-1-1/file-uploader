import { createAuthClient } from "better-auth/svelte";
import { adminClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
    baseURL: "http://localhost:5173", 
    plugins: [adminClient()]
})

export const { signIn, signUp, signOut, useSession } = createAuthClient()