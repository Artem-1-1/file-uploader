import { env } from '$env/dynamic/private';
import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins'
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { sendEmail } from './email';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	trustedOrigins: [env.ORIGIN],
	database: drizzleAdapter(db, { provider: 'pg' }),
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({user, url, token}, request) => {
			const frontendUrl = `${env.ORIGIN}/users/reset-password/?token=${token}`;
			await sendEmail({
				to: user.email,
				subject: "Reset your password",
				text: `Click the link to reset your password: ${frontendUrl}`,
			})
		}},
	user: {
		additionalFields: {
			storageUsed: { type: "number", defaultValue: 0 },
			storageLimit: { type: "number", defaultValue: 1024 * 1024 * 1024  }
		}
	},
	plugins: [
		admin(),
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});

export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
