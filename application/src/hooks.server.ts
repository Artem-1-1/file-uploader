import { redirect, type Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });
	const theme = event.cookies.get('theme') || 'light';

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	const pathname = event.url.pathname;
	const isAuthApi = pathname.startsWith('/api/auth');
	const isUploadthingApi = pathname.startsWith('/api/uploadthing');

	const authPages = ['/sign-in', '/sign-up']
	if( event.locals.user && authPages.includes(pathname)) {
		throw redirect(303, '/home');
	}

	if (pathname.startsWith('/admin')) {
		if (!event.locals.user) {
			throw redirect(303, '/sign-in');
		}
		if (event.locals.user.role !== 'admin') {
			throw redirect(303, '/home');
		}
	}
	
	const publicRoutes = ['/', '/sign-up', '/sign-in', '/users/forgot-password', '/users/reset-password'];
	const isPublicRoute = publicRoutes.includes(pathname) || isAuthApi || isUploadthingApi;;

	if (!isPublicRoute && !event.locals.user) {
		throw redirect(303, '/sign-in');
	}

	return svelteKitHandler({ 
    event, 
    resolve: (evt) => resolve(evt, {
        transformPageChunk: ({ html }) => {
          const themeClass = theme === 'dark' ? 'dark-mode' : '';
          return html
            .replace('<html', `<html class="${themeClass}"`)
            .replace('<body', `<body class="${themeClass}"`);
        }
    }), 
    auth, 
    building 
});
};

export const handle: Handle = handleBetterAuth;
