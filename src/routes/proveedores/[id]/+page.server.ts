import { db } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { recordAuditLog } from '$lib/audit';

export const load: PageServerLoad = async ({ params }) => {
  const proveedor = await db.proveedor.findUnique({
    where: { id: Number(params.id) },
  });

  if (!proveedor) {
    throw new Error('Proveedor no encontrado');
  }

  return { proveedor };
};

export const actions: Actions = {
  update: async ({ request, params, locals }) => {
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

    if (!nombre || !direccion || !telefono) {
      return fail(400, { ...formData, error: 'Todos los campos son requeridos' });
    }

    try {
      await db.proveedor.update({
        where: { id: Number(params.id) },
        data: { nombre, direccion, telefono },
      });
      await recordAuditLog(locals.user.id, 'Proveedor Actualizado', `Proveedor con ID ${params.id} actualizado. Nombre: "${nombre}".`);
    } catch (e) {
      const error = e as { code?: string };
      if (error.code === 'P2002') {
        return fail(400, { ...formData, error: 'El código o la cédula/RIF ya existen.' });
      }
      return fail(500, { ...formData, error: 'Error al actualizar el proveedor.' });
    }

    throw redirect(303, '/proveedores');
  },
};
