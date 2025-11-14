import { db } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { recordAuditLog } from '$lib/audit';

export const load: PageServerLoad = async () => {
  // Fetch clients instead of suppliers
  const clientes = await db.cliente.findMany({
    orderBy: {
      nombre: 'asc',
    },
  });
  const productos = await db.producto.findMany({
    where: {
      existencia: {
        gt: 0, // Greater than 0
      },
    },
    orderBy: {
      nombre: 'asc',
    },
  });
  return { clientes, productos };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401, { message: 'No autorizado.' });
    }

    const data = await request.formData();
    const clienteId = data.get('clienteId'); // Changed from proveedorId

    const formPayload: { [key: string]: any } = {
        clienteId: clienteId ? Number(clienteId) : null
    };

    const productosSalida: { productoId: number; cantidad: number }[] = [];
    for (const [key, value] of data.entries()) {
      if (key.startsWith('cantidad_')) {
        const productoId = Number(key.split('_')[1]);
        const cantidad = Number(value);
        formPayload[key] = value;
        if (cantidad > 0) {
          productosSalida.push({ productoId, cantidad });
        }
      }
    }

    // Changed validation: documento is now optional
    if (!clienteId) {
      return fail(400, { ...formPayload, error: 'Cliente es requerido.' }); // Updated error message
    }

    if (productosSalida.length === 0) {
      return fail(400, { ...formPayload, error: 'Debe seleccionar al menos un producto.' }); // Updated error message
    }

    try {
      await db.$transaction(async (tx) => {
        // Check for sufficient stock before creating the transaction
        for (const item of productosSalida) {
          const producto = await tx.producto.findUnique({
            where: { id: item.productoId },
          });
          if (!producto || producto.existencia < item.cantidad) {
            throw new Error(`Stock insuficiente para el producto: ${producto?.nombre}. Disponible: ${producto?.existencia}, Requerido: ${item.cantidad}`);
          }
        }

        // Create a new Salida
        const salida = await tx.salida.create({
          data: {
            clienteId: Number(clienteId),
          },
        });

        // Create SalidaProducto entries and update stock
        for (const item of productosSalida) {
          await tx.salidaProducto.create({
            data: {
              salidaId: salida.id,
              productoId: item.productoId,
              cantidad: item.cantidad,
            },
          });

          // Decrement stock
          await tx.producto.update({
            where: { id: item.productoId },
            data: {
              existencia: {
                decrement: item.cantidad,
              },
            },
          });
        }
        await recordAuditLog(locals.user.id, 'Salida Registrada', `Salida con ID ${salida.id} registrada.`);
      });
    } catch (error: any) {
      console.error(error);
      // Check if the error is the one we threw for insufficient stock
      if (error.message.startsWith('Stock insuficiente')) {
          return fail(400, { ...formPayload, error: error.message });
      }
      return fail(500, { ...formPayload, error: 'Error al registrar la salida.' }); // Updated error message
    }

    throw redirect(303, '/salidas'); // Redirect to salidas
  },
};