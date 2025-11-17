import { db } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { recordAuditLog } from '$lib/audit';
import { superValidate } from 'sveltekit-superforms/server';
import { SalidaSchema } from './schema';

export const load: PageServerLoad = async () => {
  const clientes = await db.cliente.findMany({
    orderBy: {
      nombre: 'asc',
    },
  });
  const productos = await db.producto.findMany({
    where: {
      existencia: {
        gt: 0,
      },
    },
    orderBy: {
      nombre: 'asc',
    },
  });

  const form = await superValidate(SalidaSchema);

  return { form, clientes, productos };
};

export const actions: Actions = {
  default: async (event) => {
    if (!event.locals.user) {
      return fail(401, { message: 'No autorizado.' });
    }

    const form = await superValidate(event, SalidaSchema);
    if (!form.valid) {
      return fail(400, { form });
    }

    const { clienteId, productos: productosSalida } = form.data;

    try {
      await db.$transaction(async (tx) => {
        const productIds = productosSalida.map((p) => p.productoId);
        const productos = await tx.producto.findMany({
          where: { id: { in: productIds } },
        });
        const productosMap = new Map(productos.map((p) => [p.id, p]));

        for (const item of productosSalida) {
          const producto = productosMap.get(item.productoId);
          if (!producto || producto.existencia < item.cantidad) {
            throw new Error(`Stock insuficiente para ${producto?.nombre}. Disponible: ${producto?.existencia}, Requerido: ${item.cantidad}`);
          }
        }

        const salida = await tx.salida.create({
          data: {
            clienteId,
          },
        });

        for (const item of productosSalida) {
          const producto = productosMap.get(item.productoId);
          await tx.salidaProducto.create({
            data: {
              salidaId: salida.id,
              productoId: item.productoId,
              cantidad: item.cantidad,
              precio: producto!.precio,
            },
          });

          await tx.producto.update({
            where: { id: item.productoId },
            data: {
              existencia: {
                decrement: item.cantidad,
              },
            },
          });
        }
        await recordAuditLog(event.locals.user!.id, 'Salida Registrada', `Salida con ID ${salida.id} registrada.`);
      });
    } catch (error: any) {
      console.error(error);
      if (error.message.startsWith('Stock insuficiente')) {
        return fail(400, { form, error: error.message });
      }
      return fail(500, { form, error: 'Error al registrar la salida.' });
    }

    throw redirect(303, '/salidas');
  },
};