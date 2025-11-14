import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/prisma';
import bcrypt from 'bcrypt';
import { Role } from '@prisma/client';
import type { PageServerLoad, Actions } from './$types';
import { recordAuditLog } from '$lib/audit';

export const load: PageServerLoad = async ({ params }) => {
	const id = Number(params.id);
	if (isNaN(id)) {
		throw redirect(303, '/admin/users');
	}

	const user = await db.user.findUnique({
		where: { id },
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

export const actions: Actions = {
	update: async ({ request, params, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'No autorizado.' });
		}

		const id = Number(params.id);
		if (isNaN(id)) {
			return fail(400, { message: 'ID de usuario inválido.' });
		}

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

		if (existingUser && existingUser.id !== id) {
			return fail(400, { message: 'El nombre de usuario ya existe.' });
		}

		try {
			await db.user.update({
				where: { id },
				data: {
					username: username.toString(),
					role: role.toString() as Role,
					active
				}
			});
			await recordAuditLog(
				locals.user.id,
				'Usuario Actualizado',
				`Detalles del usuario con ID ${id} actualizados.`
			);
		} catch (error) {
			console.error('Error updating user:', error);
			return fail(500, { message: 'Error al actualizar el usuario.' });
		}

		throw redirect(303, '/admin/users');
	},

	changePassword: async ({ request, params, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'No autorizado.' });
		}

		const id = Number(params.id);
		if (isNaN(id)) {
			return fail(400, { message: 'ID de usuario inválido.' });
		}

		const data = await request.formData();
		const newPassword = data.get('newPassword');

		if (!newPassword) {
			return fail(400, { message: 'La nueva contraseña no puede estar vacía.' });
		}

		const hashedPassword = await bcrypt.hash(newPassword.toString(), 10);

		try {
			await db.user.update({
				where: { id },
				data: {
					password: hashedPassword
				}
			});
			await recordAuditLog(
				locals.user.id,
				'Contraseña Cambiada',
				`Contraseña del usuario con ID ${id} cambiada.`
			);
		} catch (error) {
			console.error('Error changing password:', error);
			return fail(500, { message: 'Error al cambiar la contraseña.' });
		}

		return { success: true, message: 'Contraseña cambiada exitosamente.' };
	}
};
