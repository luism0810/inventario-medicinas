import { db } from '$lib/prisma';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { recordAuditLog } from '$lib/audit';

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q') ?? '';

	const allProveedores = await db.proveedor.findMany({
		orderBy: {
			nombre: 'asc'
		}
	});

	const proveedores = allProveedores.filter((p) => p.nombre.toLowerCase().includes(q.toLowerCase()));

	return { proveedores, q };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		if (!locals.user) {
			return fail(401, { message: 'No autorizado.' });
		}

		const data = await request.formData();
		const id = data.get('id');

		if (!id) {
			return fail(400, { message: 'Se requiere el ID del proveedor.' });
		}

		try {
			await db.proveedor.delete({
				where: {
					id: Number(id)
				}
			});
			await recordAuditLog(locals.user.id, 'Proveedor Eliminado', `Proveedor con ID ${id} eliminado.`);
		} catch (error) {
			return fail(500, { message: 'Error al eliminar el proveedor.' });
		}

		return { status: 200, message: 'proveedor eliminado' };
	}
};
