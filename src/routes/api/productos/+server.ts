import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/prisma';

export const GET: RequestHandler = async ({ url, locals }) => {
	// Verificar autenticación
	if (!locals.user) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		// Parámetros de paginación y búsqueda
		const page = parseInt(url.searchParams.get('page') || '1');
		const limit = parseInt(url.searchParams.get('limit') || '10');
		const search = url.searchParams.get('search') || '';
		
		const skip = (page - 1) * limit;
		
		// Construir filtro de búsqueda
		const where = search ? {
			OR: [
				{ nombre: { contains: search, mode: 'insensitive' } },
				{ descripcion: { contains: search, mode: 'insensitive' } },
				{ codigo: { contains: search, mode: 'insensitive' } }
			]
		} : {};
		
		// Consultas paralelas para mejor performance
		const [productos, total] = await Promise.all([
			db.producto.findMany({
				where,
				skip,
				take: limit,
				orderBy: { nombre: 'asc' },
				select: {
					id: true,
					nombre: true,
					codigo: true,
					presentacion: {
						select: {
							id: true,
							nombre: true,
						}
					},
					precio: true,
					existencia: true,
					stock_minimo: true,
					stock_maximo: true,
				}
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
		console.error('Error al obtener productos:', error);
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}
	
	try {
		const data = await request.json();
		
		// Validaciones básicas
		if (!data.nombre || !data.codigo || !data.presentacionId) {
			return json({ error: 'Nombre, código y presentación son requeridos' }, { status: 400 });
		}
		
		// Verificar si el código ya existe
		const existingProduct = await db.producto.findUnique({
			where: { codigo: data.codigo }
		});
		
		if (existingProduct) {
			return json({ error: 'El código del producto ya existe' }, { status: 400 });
		}
		
		const producto = await db.producto.create({
			data: {
				nombre: data.nombre,
				codigo: data.codigo,
				presentacion: { connect: { id: data.presentacionId } },
				precio: data.precio || 0,
				existencia: data.existencia || 0,
				stock_minimo: data.stock_minimo || 0,
				stock_maximo: data.stock_maximo || 0,
			}
		});
		
		return json({ 
			message: 'Producto creado exitosamente',
			producto 
		}, { status: 201 });
		
	} catch (error) {
		console.error('Error al crear producto:', error);
		return json({ error: 'Error al crear producto' }, { status: 500 });
	}
};