import { db } from '$lib/prisma';
import type { PageServerLoad, Actions } from './$types';
import { fail } from '@sveltejs/kit';
import { recordAuditLog } from '$lib/audit';

export const load: PageServerLoad = async ({ url }) => {
	const q = url.searchParams.get('q') ?? '';

	const allProductos = await db.producto.findMany({
		orderBy: {
			nombre: 'asc'
		}
	});

	const productos = allProductos.filter((p) => p.nombre.toLowerCase().includes(q.toLowerCase()));

	return { productos, q };
};

export const actions: Actions = {
	delete: async ({ request, locals }) => {
		const data = await request.formData();
		const id = data.get('id');

		if (!locals.user) {
			return fail(401, { message: 'No autorizado.' });
		}

		if (!id) {
			return fail(400, { message: 'Se requiere el ID del producto.' });
		}

		try {
			await db.producto.delete({
				where: {
					id: Number(id)
				}
			});
			await recordAuditLog(locals.user.id, 'Producto Eliminado', `Producto con ID ${id} eliminado.`);
		} catch (error) {
			return fail(500, { message: 'Error al eliminar el producto.' });
		}

		return { status: 200, message: 'Producto eliminado' };
	}
};

