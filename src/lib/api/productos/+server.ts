import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/prisma';

export const GET: RequestHandler = async ({ url }) => {
	try {
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const search = url.searchParams.get('search') || '';
		
		const skip = (page - 1) * limit;
		
		const where = search ? {
			OR: [
				{ nombre: { contains: search, mode: 'insensitive' } },
				{ descripcion: { contains: search, mode: 'insensitive' } }
			]
		} : {};
		
		const [productos, total] = await Promise.all([
			db.producto.findMany({
				where,
				skip,
				take: limit,
				orderBy: { nombre: 'asc' }
			}),
			db.producto.count({ where })
		]);
		
		return json({
			productos,
			pagination: {
				page,
				limit,
				total,
				pages: Math.ceil(total / limit)
			}
		});
	} catch (error) {
		return json({ error: 'Error al obtener productos' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}
	
	try {
		const data = await request.json();
		const producto = await db.producto.create({
			data: {
				...data,
				existencia: 0 // Stock inicial
			}
		});
		
		return json(producto, { status: 201 });
	} catch (error) {
		return json({ error: 'Error al crear producto' }, { status: 500 });
	}
};