import { db } from '$lib/prisma';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { recordAuditLog } from '$lib/audit';

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q') ?? '';

	const allClientes = await db.cliente.findMany({
		orderBy: {
			nombre: 'asc'
		}
	});

	const clientes = allClientes.filter((c) => c.nombre.toLowerCase().includes(q.toLowerCase()));

	return { clientes, q };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'No autorizado.' });
		}

		const data = await request.formData();
		const id = data.get('id');

		if (!id) {
			return fail(400, { message: 'Se requiere el ID del cliente.' });
		}

		try {
			await db.cliente.delete({
				where: {
					id: Number(id)
				}
			});
			await recordAuditLog(locals.user.id, 'Cliente Eliminado', `Cliente con ID ${id} eliminado.`);
		} catch (error) {
			return fail(500, { message: 'Error al eliminar el cliente.' });
		}

		return { status: 200, message: 'cliente eliminado' };
	}
};
