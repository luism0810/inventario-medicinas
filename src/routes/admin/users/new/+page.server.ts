import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/prisma';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

export const actions = {
	create: async ({ request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');
		const role = data.get('role');
		const active = data.get('active') === 'on';

		if (!username || !password || !role) {
			return fail(400, { message: 'Faltan campos obligatorios.' });
		}

		const existingUser = await db.user.findUnique({
			where: { username: username.toString() }
		});

		if (existingUser) {
			return fail(400, { message: 'El nombre de usuario ya existe.' });
		}

		const hashedPassword = await bcrypt.hash(password.toString(), 10);

		try {
			await db.user.create({
				data: {
					username: username.toString(),
					password: hashedPassword,
					role: role.toString() as Role,
					active
				}
			});
		} catch (error) {
			console.error('Error creating user:', error);
			return fail(500, { message: 'Error al crear el usuario.' });
		}

		throw redirect(303, '/admin/users');
	}
};
