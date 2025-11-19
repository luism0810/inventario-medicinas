import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/prisma';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const producto = await db.producto.findUnique({
			where: { id: parseInt(params.id) }
		});
		
		if (!producto) {
			return json({ error: 'Producto no encontrado' }, { status: 404 });
		}
		
		return json(producto);
	} catch (error) {
		return json({ error: 'Error al obtener producto' }, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}
	
	try {
		const data = await request.json();
		const producto = await db.producto.update({
			where: { id: parseInt(params.id) },
			data
		});
		
		return json(producto);
	} catch (error) {
		return json({ error: 'Error al actualizar producto' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}
	
	try {
		await db.producto.delete({
			where: { id: parseInt(params.id) }
		});
		
		return json({ message: 'Producto eliminado' });
	} catch (error) {
		return json({ error: 'Error al eliminar producto' }, { status: 500 });
	}
};