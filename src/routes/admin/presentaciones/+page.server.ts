import { db } from '$lib/prisma';
import type { PageServerLoad, Actions } from './$types';
import { fail, redirect } from '@sveltejs/kit';
import { recordAuditLog } from '$lib/audit';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user || locals.user.role !== 'ADMIN') {
        throw redirect(302, '/');
    }

    const presentaciones = await db.presentacion.findMany({
        orderBy: { nombre: 'asc' },
    });

    return { presentaciones };
};

export const actions: Actions = {
    create: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'ADMIN') {
            return fail(401, { message: 'No autorizado.' });
        }

        const data = await request.formData();
        const nombre = data.get('nombre')?.toString();

        if (!nombre) {
            return fail(400, { nombre, error: 'El nombre de la presentación es obligatorio.' });
        }

        try {
            const existingPresentacion = await db.presentacion.findUnique({
                where: { nombre },
            });

            if (existingPresentacion) {
                return fail(400, { nombre, error: 'Ya existe una presentación con este nombre.' });
            }

            const newPresentacion = await db.presentacion.create({
                data: { nombre },
            });

            await recordAuditLog(locals.user.id, 'Presentacion Creada (Admin)', `Presentación creada: ${newPresentacion.nombre} (ID: ${newPresentacion.id})`);
            return { success: true };
        } catch (error) {
            console.error('Error creating presentation:', error);
            return fail(500, { nombre, error: 'Error interno del servidor al crear la presentación.' });
        }
    },

    delete: async ({ request, locals }) => {
        if (!locals.user || locals.user.role !== 'ADMIN') {
            return fail(401, { message: 'No autorizado.' });
        }

        const data = await request.formData();
        const id = data.get('id');

        if (!id) {
            return fail(400, { message: 'Se requiere el ID de la presentación.' });
        }

        try {
            const presentacion = await db.presentacion.findUnique({
                where: { id: Number(id) },
                include: { productos: true },
            });

            if (!presentacion) {
                return fail(404, { message: 'Presentación no encontrada.' });
            }

            if (presentacion.productos.length > 0) {
                return fail(400, { message: 'No se puede eliminar la presentación porque tiene productos asociados.' });
            }

            await db.presentacion.delete({
                where: { id: Number(id) },
            });

            await recordAuditLog(locals.user.id, 'Presentacion Eliminada (Admin)', `Presentación eliminada (ID: ${id}).`);
            return { success: true };
        } catch (error) {
            console.error('Error deleting presentation:', error);
            return fail(500, { message: 'Error al eliminar la presentación.' });
        }
    },
};
