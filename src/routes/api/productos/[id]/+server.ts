import { db } from '$lib/prisma';
import { json, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// PUT /api/productos/[id] - Update an existing product
export const PUT: RequestHandler = async ({ request, params }) => {
    try {
        const id = parseInt(params.id as string);
        if (isNaN(id)) {
            throw error(400, 'ID de producto inválido.');
        }

        const productData = await request.json();

        // Basic validation for nombre if present
        if (productData.nombre && typeof productData.nombre !== 'string') {
            throw error(400, 'El nombre del producto debe ser una cadena de texto.');
        }

        // Check for unique name, excluding the current product being updated
        if (productData.nombre) {
            const existingProduct = await db.producto.findFirst({
                where: {
                    nombre: productData.nombre,
                    NOT: {
                        id: id,
                    },
                },
            });

            if (existingProduct) {
                throw error(409, 'Ya existe otro producto con este nombre.');
            }
        }

        // Remove existencia from productData to prevent direct updates
        const { existencia, ...dataToUpdate } = productData;

        const updatedProduct = await db.producto.update({ where: { id }, data: dataToUpdate });
        return json(updatedProduct);
    } catch (err: any) {
        if (err.status) {
            throw err; // Re-throw SvelteKit errors
        }
        console.error('Error updating product:', err);
        throw error(500, err.message || 'Error interno del servidor al actualizar el producto.');
    }
};

// DELETE /api/productos/[id] - Delete a product
export const DELETE: RequestHandler = async ({ params }) => {
    try {
        const id = parseInt(params.id as string);
        if (isNaN(id)) {
            throw error(400, 'ID de producto inválido.');
        }

        await db.producto.delete({ where: { id } });
        return new Response(null, { status: 204 }); // No Content
    } catch (err: any) {
        if (err.code === 'P2025') { // Prisma error code for record not found
            throw error(404, 'Producto no encontrado.');
        }
        console.error('Error deleting product:', err);
        throw error(500, err.message || 'Error interno del servidor al eliminar el producto.');
    }
};
