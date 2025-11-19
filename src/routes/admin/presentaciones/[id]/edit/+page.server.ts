import { db } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { recordAuditLog } from '$lib/audit';

export const load: PageServerLoad = async ({ params, locals }) => {
    if (!locals.user || locals.user.role !== 'ADMIN') {
        throw redirect(302, '/');
    }

    const id = Number(params.id);
    const presentacion = await db.presentacion.findUnique({
        where: { id },
    });

    if (!presentacion) {
        throw fail(404, { message: 'Presentación no encontrada.' });
    }

    return { presentacion };
};

export const actions: Actions = {
    default: async ({ request, params, locals }) => {
        if (!locals.user || locals.user.role !== 'ADMIN') {
            return fail(401, { message: 'No autorizado.' });
        }

        const id = Number(params.id);
        const data = await request.formData();
        const nombre = data.get('nombre')?.toString();

        if (!nombre) {
            return fail(400, { nombre, error: 'El nombre de la presentación es obligatorio.' });
        }

        try {
            const existingPresentacion = await db.presentacion.findFirst({
                where: {
                    nombre,
                    id: { not: id },
                },
            });

            if (existingPresentacion) {
                return fail(400, { nombre, error: 'Ya existe otra presentación con este nombre.' });
            }

            const updatedPresentacion = await db.presentacion.update({
                where: { id },
                data: { nombre },
            });

            await recordAuditLog(locals.user.id, 'Presentacion Actualizada (Admin)', `Presentación actualizada: ${updatedPresentacion.nombre} (ID: ${updatedPresentacion.id})`);
            return { success: true };
        } catch (error) {
            console.error('Error updating presentation:', error);
            return fail(500, { nombre, error: 'Error interno del servidor al actualizar la presentación.' });
        }
    },
};
