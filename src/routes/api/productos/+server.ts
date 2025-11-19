import { json, error } from '@sveltejs/kit';
import { db } from '$lib/prisma';
import { recordAuditLog } from '$lib/audit';

export async function POST({ request, locals }) {
    const { nombre, codigo, precio, presentacion, stock_minimo, stock_maximo } = await request.json();

    if (!locals.user) {
        throw error(401, 'No autorizado');
    }

    // Validaciones
    if (!nombre || !codigo) {
        throw error(400, 'Nombre y código son campos requeridos.');
    }
    if (stock_minimo > stock_maximo) {
        throw error(400, 'El stock mínimo no puede ser mayor que el stock máximo.');
    }

    try {
        // Check for unique name
        const existingProduct = await db.producto.findUnique({
            where: { nombre: nombre },
        });

        if (existingProduct) {
            throw error(409, 'Ya existe un producto con este nombre.');
        }

        // Check for unique code
        const existingProductWithCode = await db.producto.findUnique({
            where: { codigo: codigo },
        });

        if (existingProductWithCode) {
            throw error(409, 'Ya existe un producto con este código.');
        }

        const newProduct = await db.producto.create({
            data: {
                nombre,
                codigo,
                precio: parseFloat(precio),
                presentacion,
                existencia: 0, // Always start with 0 existence
                stock_minimo: parseInt(stock_minimo),
                stock_maximo: parseInt(stock_maximo),
            },
        });

        await recordAuditLog(locals.user.id, 'Producto Creado', `Producto ${newProduct.nombre} (ID: ${newProduct.id}) creado.`);

        return json(newProduct, { status: 201 });
    } catch (err: any) {
        if (err.status) {
            throw err; // Re-throw SvelteKit errors
        }
        console.error('Error creating product:', err);
        throw error(500, err.message || 'Error interno del servidor al crear el producto.');
    }
}
