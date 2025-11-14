import { db } from '$lib/prisma';
import { redirect } from '@sveltejs/kit';

const unprotectedRoutes = ['/login', '/reset-password'];

export const handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('session');

	if (!sessionToken) {
		if (!unprotectedRoutes.includes(event.url.pathname)) {
			throw redirect(303, '/login');
		}
	} else {
		const session = await db.session.findUnique({
			where: { id: sessionToken },
			include: { user: true }
		});

		if (session) {
			event.locals.user = session.user;
		} else {
			// Invalid session token, clear cookie
			event.cookies.delete('session', { path: '/' });
			if (!unprotectedRoutes.includes(event.url.pathname)) {
				throw redirect(303, '/login');
			}
		}
	}

    // Logout logic
	if (event.url.pathname === '/logout') {
		event.cookies.delete('session', { path: '/' });
		if(sessionToken) {
			await db.session.delete({ where: { id: sessionToken } }).catch(() => {});
		}
		throw redirect(303, '/login');
	}


	return resolve(event);
};
