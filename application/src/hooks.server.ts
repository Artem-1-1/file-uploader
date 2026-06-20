import { redirect, type Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	const pathname = event.url.pathname;

	const publicRoutes = ['/', '/sign-up', '/sign-in'];
	const isAuthApi = pathname.startsWith('/api/auth');
	const isPublicRoute = publicRoutes.includes(pathname) || isAuthApi;

	if (!isPublicRoute && !event.locals.user) {
		throw redirect(303, '/sign-in');
	}

	if (pathname.startsWith('/admin')) {
		if (!event.locals.user) {
			throw redirect(303, '/sign-in');
		}

		if (event.locals.user.role !== 'admin') {
			throw redirect(303, '/'); 
		}
	}

	if (event.locals.user && (pathname === '/sign-in' || pathname === '/sign-up')) {
		throw redirect(303, '/dashboard'); 
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = handleBetterAuth;
