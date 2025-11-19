import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/prisma';

export const GET: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}

	try {
		const id = parseInt(params.id);
		
		if (isNaN(id)) {
			return json({ error: 'ID inválido' }, { status: 400 });
		}

		const producto = await db.producto.findUnique({
			where: { id },
			include: {
				presentacion: {
					select: {
						id: true,
						nombre: true,
					}
				}
			}
		});
		
		if (!producto) {
			return json({ error: 'Producto no encontrado' }, { status: 404 });
		}
		
		return json(producto);
	} catch (error) {
		console.error('Error al obtener producto:', error);
		return json({ error: 'Error interno del servidor' }, { status: 500 });
	}
};

export const PATCH: RequestHandler = async ({ params, request, locals }) => {
	if (!locals.user) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}
	
	try {
		const id = parseInt(params.id);
		
		if (isNaN(id)) {
			return json({ error: 'ID inválido' }, { status: 400 });
		}

		const data = await request.json();
		
		// Verificar que el producto existe
		const existingProduct = await db.producto.findUnique({
			where: { id }
		});
		
		if (!existingProduct) {
			return json({ error: 'Producto no encontrado' }, { status: 404 });
		}
		
		// Si se está actualizando el código, verificar que no exista otro con el mismo código
		if (data.codigo && data.codigo !== existingProduct.codigo) {
			const duplicateCode = await db.producto.findUnique({
				where: { codigo: data.codigo }
			});
			
			if (duplicateCode) {
				return json({ error: 'El código ya está en uso por otro producto' }, { status: 400 });
			}
		}
		
		const producto = await db.producto.update({
			where: { id },
			data: {
				...data,
				presentacionId: data.presentacionId ? Number(data.presentacionId) : undefined,
				updatedAt: new Date()
			}
		});
		
		return json({ 
			message: 'Producto actualizado exitosamente',
			producto 
		});
		
	} catch (error) {
		console.error('Error al actualizar producto:', error);
		return json({ error: 'Error al actualizar producto' }, { status: 500 });
	}
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
	if (!locals.user) {
		return json({ error: 'No autorizado' }, { status: 401 });
	}
	
	try {
		const id = parseInt(params.id);
		
		if (isNaN(id)) {
			return json({ error: 'ID inválido' }, { status: 400 });
		}

		// Verificar que el producto existe
		const existingProduct = await db.producto.findUnique({
			where: { id }
		});
		
		if (!existingProduct) {
			return json({ error: 'Producto no encontrado' }, { status: 404 });
		}
		
		// Verificar si hay existencia antes de eliminar
		if (existingProduct.existencia > 0) {
			return json({ 
				error: 'No se puede eliminar un producto con existencia en stock' 
			}, { status: 400 });
		}
		
		await db.producto.delete({
			where: { id }
		});
		
		return json({ 
			message: 'Producto eliminado exitosamente' 
		});
		
	} catch (error) {
		console.error('Error al eliminar producto:', error);
		
		// Manejar error de restricción de clave foránea
		if (error.code === 'P2003') {
			return json({ 
				error: 'No se puede eliminar el producto porque está siendo usado en el sistema' 
			}, { status: 400 });
		}
		
		return json({ error: 'Error al eliminar producto' }, { status: 500 });
	}
};