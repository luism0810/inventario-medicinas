import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/prisma';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';

export const load = async ({ params }) => {
	const user = await db.user.findUnique({
		where: { id: parseInt(params.id) },
		select: {
			id: true,
			username: true,
			role: true,
			active: true
		}
	});

	if (!user) {
		throw redirect(303, '/admin/users');
	}

	return { user };
};

export const actions = {
	update: async ({ request, params }) => {
		const data = await request.formData();
		const username = data.get('username');
		const role = data.get('role');
		const active = data.get('active') === 'on';

		if (!username || !role) {
			return fail(400, { message: 'Faltan campos obligatorios.' });
		}

		const existingUser = await db.user.findUnique({
			where: { username: username.toString() }
		});

		if (existingUser && existingUser.id !== parseInt(params.id)) {
			return fail(400, { message: 'El nombre de usuario ya existe.' });
		}

		try {
			await db.user.update({
				where: { id: parseInt(params.id) },
				data: {
					username: username.toString(),
					role: role.toString() as Role,
					active
				}
			});
		} catch (error) {
			console.error('Error updating user:', error);
			return fail(500, { message: 'Error al actualizar el usuario.' });
		}

		return { success: true, message: 'Usuario actualizado exitosamente.' };
	},

	changePassword: async ({ request, params }) => {
		const data = await request.formData();
		const newPassword = data.get('newPassword');

		if (!newPassword) {
			return fail(400, { message: 'La nueva contraseña no puede estar vacía.' });
		}

		const hashedPassword = await bcrypt.hash(newPassword.toString(), 10);

		try {
			await db.user.update({
				where: { id: parseInt(params.id) },
				data: {
					password: hashedPassword
				}
			});
		} catch (error) {
			console.error('Error changing password:', error);
			return fail(500, { message: 'Error al cambiar la contraseña.' });
		}

		return { success: true, message: 'Contraseña cambiada exitosamente.' };
	},

	delete: async ({ params }) => {
		try {
			await db.user.delete({
				where: { id: parseInt(params.id) }
			});
		} catch (error) {
			console.error('Error deleting user:', error);
			return fail(500, { message: 'Error al eliminar el usuario.' });
		}

		throw redirect(303, '/admin/users');
	}
};
