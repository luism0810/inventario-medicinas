import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/prisma';
import { audit } from '$lib/audit';

export const load = async () => {
    const presentaciones = await db.presentacion.findMany({
        orderBy: { nombre: 'asc' },
    });
    return { presentaciones };
};

export const actions = {
    default: async ({ request, locals }) => {
        const session = await locals.auth.validate();
        if (!session) {
            throw redirect(302, '/login');
        }

        const data = await request.formData();
        const nombre = data.get('nombre')?.toString();
        const codigo = data.get('codigo')?.toString();
        const presentacionId = parseInt(data.get('presentacionId')?.toString() || '');
        const precio = parseFloat(data.get('precio')?.toString() || '0');
        const stock_minimo = parseInt(data.get('stock_minimo')?.toString() || '0');
        const stock_maximo = parseInt(data.get('stock_maximo')?.toString() || '0');

        if (!nombre || !codigo || isNaN(presentacionId)) {
            return fail(400, { message: 'Nombre, Código y Presentación son campos requeridos.' });
        }

        if (stock_minimo > stock_maximo) {
            return fail(400, { message: 'El stock mínimo no puede ser mayor que el stock máximo.' });
        }

        try {
            // Check for unique name
            const existingProduct = await db.producto.findUnique({
                where: { nombre: nombre },
            });

            if (existingProduct) {
                return fail(400, { message: 'Ya existe un producto con este nombre.' });
            }

            const newProduct = await db.producto.create({
                data: {
                    nombre,
                    codigo,
                    presentacion: { connect: { id: presentacionId } },
                    precio,
                    existencia: 0, // New products start with 0 existence
                    stock_minimo,
                    stock_maximo,
                },
            });

            await audit('CREATE_PRODUCT', session.userId, `Producto creado: ${newProduct.nombre} (ID: ${newProduct.id})`);

            throw redirect(302, '/productos');
        } catch (error: any) {
            console.error('Error creating product:', error);
            return fail(500, { message: error.message || 'Error interno del servidor al crear el producto.' });
        }
    },
};