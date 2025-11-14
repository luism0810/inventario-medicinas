import { db } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { recordAuditLog } from '$lib/audit';

export const load: PageServerLoad = async ({ params }) => {
  const cliente = await db.cliente.findUnique({
    where: { id: Number(params.id) },
  });

  if (!cliente) {
    throw new Error('Cliente no encontrado');
  }

  return { cliente };
};

export const actions: Actions = {
  update: async ({ request, params, locals }) => {
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
      await db.cliente.update({
        where: { id: Number(params.id) },
        data: { nombre, codigo, direccion, responsable, cedulaRif },
      });
      await recordAuditLog(locals.user.id, 'Cliente Actualizado', `Cliente con ID ${params.id} actualizado. Nombre: "${nombre}".`);
    } catch (e) {
      const error = e as { code?: string };
      if (error.code === 'P2002') {
        return fail(400, { ...formData, error: 'El código o la cédula/RIF ya existen.' });
      }
      return fail(500, { ...formData, error: 'Error al actualizar el cliente.' });
    }

    throw redirect(303, '/clientes');
  },
};
