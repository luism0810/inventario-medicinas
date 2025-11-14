import { db } from '$lib/prisma';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { recordAuditLog } from '$lib/audit';

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q') ?? '';

	const allUsers = await db.user.findMany({
		orderBy: {
			username: 'asc'
		},
		select: {
			id: true,
			username: true,
			role: true,
			active: true
		}
	});

	const users = allUsers.filter((u) => u.username.toLowerCase().includes(q.toLowerCase()));

	return { users, q };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!locals.user) {
			return fail(401, { message: 'No autorizado.' });
		}

		if (!id) {
			return fail(400, { message: 'Se requiere el ID del usuario.' });
		}

		const idAsNumber = Number(id);

		// Prevent admin from deleting themselves
		if (idAsNumber === locals.user.id) {
			return fail(400, { message: 'No puedes eliminar tu propio usuario.' });
		}

		try {
			await db.user.delete({
				where: {
					id: idAsNumber
				}
			});
			await recordAuditLog(
				locals.user.id,
				'Usuario Eliminado',
				`Usuario con ID ${id} eliminado.`
			);
		} catch (error) {
			return fail(500, { message: 'Error al eliminar el usuario.' });
		}

		return { status: 200, message: 'Usuario eliminado' };
	}
};
