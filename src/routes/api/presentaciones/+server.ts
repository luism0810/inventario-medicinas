import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { db } from '$lib/prisma';
import { recordAuditLog } from '$lib/audit';

export const GET: RequestHandler = async ({ locals }) => {
    if (!locals.user) {
        return json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const presentaciones = await db.presentacion.findMany({
            orderBy: { nombre: 'asc' },
        });
        return json(presentaciones);
    } catch (error) {
        console.error('Error al obtener presentaciones:', error);
        return json({ error: 'Error interno del servidor' }, { status: 500 });
    }
};

export const POST: RequestHandler = async ({ request, locals }) => {
    if (!locals.user) {
        return json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const { nombre } = await request.json();

        if (!nombre) {
            return json({ error: 'El nombre de la presentación es requerido' }, { status: 400 });
        }

        const existingPresentacion = await db.presentacion.findUnique({
            where: { nombre },
        });

        if (existingPresentacion) {
            return json({ error: 'Ya existe una presentación con este nombre' }, { status: 400 });
        }

        const newPresentacion = await db.presentacion.create({
            data: { nombre },
        });

        await recordAuditLog(locals.user.id, 'Presentacion Creada', `Presentación creada: ${newPresentacion.nombre} (ID: ${newPresentacion.id})`);

        return json(newPresentacion, { status: 201 });
    } catch (error) {
        console.error('Error al crear presentación:', error);
        return json({ error: 'Error interno del servidor' }, { status: 500 });
    }
};
