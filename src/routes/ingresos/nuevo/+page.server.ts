import { db } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { recordAuditLog } from '$lib/audit';
import { superValidate } from 'sveltekit-superforms/server';
import { IngresoSchema } from './schema';

export const load: PageServerLoad = async () => {
  const proveedores = await db.proveedor.findMany({
    orderBy: {
      nombre: 'asc',
    },
  });
  const productos = await db.producto.findMany({
    orderBy: {
      nombre: 'asc',
    },
  });

  const form = await superValidate(IngresoSchema);

  return { form, proveedores, productos };
};

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.user) {
      return fail(401, { message: 'No autorizado.' });
    }

    const form = await superValidate(event, IngresoSchema);
    if (!form.valid) {
      return fail(400, { form });
    }

    const { documento, proveedorId, productos } = form.data;

    try {
      await db.$transaction(async (tx) => {
        const ingreso = await tx.ingreso.create({
          data: {
            documento,
            proveedorId,
          },
        });

        // The schema ensures productos is not undefined here
        for (const item of productos!) {
          await tx.ingresoProducto.create({
            data: {
              ingresoId: ingreso.id,
              productoId: item.productoId,
              cantidad: item.cantidad,
            },
          });

          await tx.producto.update({
            where: { id: item.productoId },
            data: {
              existencia: {
                increment: item.cantidad,
              },
            },
          });
        }
        await recordAuditLog(event.locals.user!.id, 'Ingreso Registrado', `Ingreso con documento "${documento}" registrado.`);
      });
    } catch (error) {
      console.error(error);
      return fail(500, { form, error: 'Error al registrar el ingreso.' });
    }

    throw redirect(303, '/ingresos');
  },
};
