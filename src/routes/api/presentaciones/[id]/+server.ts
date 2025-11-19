import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/prisma';
import { recordAuditLog } from '$lib/audit';

export const GET: RequestHandler = async ({ params, locals }) => {
    if (!locals.user) {
        return json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const id = parseInt(params.id);
        if (isNaN(id)) {
            return json({ error: 'ID inválido' }, { status: 400 });
        }

        const presentacion = await db.presentacion.findUnique({
            where: { id },
        });

        if (!presentacion) {
            return json({ error: 'Presentación no encontrada' }, { status: 404 });
        }
        return json(presentacion);
    } catch (error) {
        console.error('Error al obtener presentación:', error);
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

        const { nombre } = await request.json();

        if (!nombre) {
            return json({ error: 'El nombre de la presentación es requerido' }, { status: 400 });
        }

        const existingPresentacion = await db.presentacion.findUnique({
            where: { id: { not: id }, nombre },
        });

        if (existingPresentacion) {
            return json({ error: 'Ya existe otra presentación con este nombre' }, { status: 400 });
        }

        const updatedPresentacion = await db.presentacion.update({
            where: { id },
            data: { nombre },
        });

        await recordAuditLog(locals.user.id, 'Presentacion Actualizada', `Presentación actualizada: ${updatedPresentacion.nombre} (ID: ${updatedPresentacion.id})`);

        return json(updatedPresentacion);
    } catch (error) {
        console.error('Error al actualizar presentación:', error);
        return json({ error: 'Error interno del servidor' }, { status: 500 });
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

        const existingPresentacion = await db.presentacion.findUnique({
            where: { id },
            include: { productos: true },
        });

        if (!existingPresentacion) {
            return json({ error: 'Presentación no encontrada' }, { status: 404 });
        }

        if (existingPresentacion.productos.length > 0) {
            return json({ error: 'No se puede eliminar la presentación porque tiene productos asociados' }, { status: 400 });
        }

        await db.presentacion.delete({
            where: { id },
        });

        await recordAuditLog(locals.user.id, 'Presentacion Eliminada', `Presentación eliminada (ID: ${id})`);

        return json({ message: 'Presentación eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar presentación:', error);
        return json({ error: 'Error interno del servidor' }, { status: 500 });
    }
};
