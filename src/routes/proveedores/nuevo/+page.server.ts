import { db } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { recordAuditLog } from '$lib/audit';

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401, { message: 'No autorizado.' });
    }

    const data = await request.formData();
    const nombre = data.get('nombre') as string;
    const direccion = data.get('direccion') as string;
    const telefono = data.get('telefono') as string;

    const formData = {
        nombre,
        direccion,
        telefono
    };

    if (!nombre) {
      return fail(400, { ...formData, error: 'El nombre es requerido.' });
    }

    try {
      await db.proveedor.create({
        data: { nombre, direccion, telefono },
      });
      await recordAuditLog(locals.user.id, 'Proveedor Creado', `Proveedor "${nombre}" creado.`);
    } catch (e) {
      const error = e as { code?: string };
      // P2002 is the Prisma code for unique constraint violation
      if (error.code === 'P2002') {
        return fail(400, { ...formData, error: 'El proveedor ya existe.' });
      }
      return fail(500, { ...formData, error: 'Error al crear el proveedor.' });
    }

    throw redirect(303, '/proveedores');
  },
};
