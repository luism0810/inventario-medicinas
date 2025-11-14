import { db } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { recordAuditLog } from '$lib/audit';

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
  return { proveedores, productos };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401, { message: 'No autorizado.' });
    }

    const data = await request.formData();
    const documento = data.get('documento') as string;
    const proveedorId = data.get('proveedorId');

    const formPayload: { [key: string]: any } = {
        documento,
        proveedorId: proveedorId ? Number(proveedorId) : null
    };

    const productosIngresados: { productoId: number; cantidad: number }[] = [];
    for (const [key, value] of data.entries()) {
      if (key.startsWith('cantidad_')) {
        const productoId = Number(key.split('_')[1]);
        const cantidad = Number(value);
        formPayload[key] = value;
        if (cantidad > 0) {
          productosIngresados.push({ productoId, cantidad });
        }
      }
    }

    if (!documento || !proveedorId) {
      return fail(400, { ...formPayload, error: 'Documento y proveedor son requeridos.' });
    }

    if (productosIngresados.length === 0) {
      return fail(400, { ...formPayload, error: 'Debe ingresar al menos un producto.' });
    }

    try {
      await db.$transaction(async (tx) => {
        const ingreso = await tx.ingreso.create({
          data: {
            documento,
            proveedorId: Number(proveedorId),
          },
        });

        for (const item of productosIngresados) {
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
      });
      await recordAuditLog(locals.user.id, 'Ingreso Registrado', `Ingreso con documento "${documento}" registrado.`);
    } catch (error) {
      console.error(error);
      return fail(500, { ...formPayload, error: 'Error al registrar el ingreso.' });
    }

    throw redirect(303, '/ingresos');
  },
};
