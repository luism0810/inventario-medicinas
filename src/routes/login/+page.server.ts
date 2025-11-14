import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/prisma';
import bcrypt from 'bcrypt';

export const actions = {
	login: async ({ cookies, request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (!username || !password) {
			return fail(400, { message: 'Faltan el usuario o la contraseña.' });
		}

		const user = await db.user.findUnique({
			where: { username: username.toString() }
		});

		if (!user) {
			return fail(400, { message: 'Usuario o contraseña incorrectos.' });
		}

		if (!user.active) {
			return fail(403, { message: 'El usuario está inactivo. Contacte al administrador.' });
		}

		const passwordMatch = await bcrypt.compare(password.toString(), user.password);

		if (!passwordMatch) {
			return fail(400, { message: 'Usuario o contraseña incorrectos.' });
		}

		// Create session
		const session = await db.session.create({
			data: {
				userId: user.id,
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 7 days
			}
		});

		cookies.set('session', session.id, {
			path: '/',
			httpOnly: true,
			sameSite: 'strict',
			secure: process.env.NODE_ENV === 'production',
			maxAge: 60 * 60 * 24 * 7 // 1 week
		});

		throw redirect(303, '/');
	}
};
