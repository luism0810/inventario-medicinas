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
    const codigo = data.get('codigo') as string;
    const direccion = data.get('direccion') as string;
    const responsable = data.get('responsable') as string;
    const cedulaRif = data.get('cedulaRif') as string;

    const formData = {
        nombre,
        codigo,
        direccion,
        responsable,
        cedulaRif
    };

    if (!nombre || !codigo || !direccion || !responsable || !cedulaRif) {
      return fail(400, { ...formData, error: 'Todos los campos son requeridos' });
    }

    try {
      await db.cliente.create({
        data: { nombre, codigo, direccion, responsable, cedulaRif },
      });
      await recordAuditLog(locals.user.id, 'Cliente Creado', `Cliente "${nombre}" creado.`);
    } catch (e) {
      const error = e as { code?: string };
      // P2002 is the Prisma code for unique constraint violation
      if (error.code === 'P2002') {
        return fail(400, { ...formData, error: 'El código o la cédula/RIF ya existen.' });
      }
      return fail(500, { ...formData, error: 'Error al crear el cliente.' });
    }

    throw redirect(303, '/clientes');
  },
};
