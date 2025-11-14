import { db } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { recordAuditLog } from '$lib/audit';
import pkg from '@prisma/client';
const { Presentacion } = pkg;

export const load: PageServerLoad = async ({ params }) => {
  const producto = await db.producto.findUnique({
    where: { id: Number(params.id) },
  });

  if (!producto) {
    throw new Error('Producto no encontrado');
  }

  return { producto };
};

export const actions: Actions = {
  update: async ({ request, params, locals }) => {
    if (!locals.user) {
      return fail(401, { message: 'No autorizado.' });
    }

    const data = await request.formData();
    const nombre = data.get('nombre') as string;
    const presentacion = data.get('presentacion') as Presentacion;
    const precioRaw = data.get('precio') as string;
    const stockMinimoRaw = data.get('stock_minimo') as string || '0';
    const stockMaximoRaw = data.get('stock_maximo') as string || '0';

    const precio = parseFloat(precioRaw.replace(',', '.'));
    const stock_minimo = parseInt(stockMinimoRaw, 10);
    const stock_maximo = parseInt(stockMaximoRaw, 10);

    if (!nombre) {
      return fail(400, { nombre, precio: precioRaw, stock_minimo: stockMinimoRaw, stock_maximo: stockMaximoRaw, error: 'El nombre es obligatorio.' });
    }

    if (isNaN(precio) || precio <= 0) {
      return fail(400, { nombre, precio: precioRaw, stock_minimo: stockMinimoRaw, stock_maximo: stockMaximoRaw, error: 'El precio debe ser un número positivo.' });
    }

    const productWithSameName = await db.producto.findFirst({
        where: {
            nombre: nombre,
            id: { not: Number(params.id) }
        }
    });

    if (productWithSameName) {
        return fail(400, {
            nombre,
            precio: precioRaw,
            stock_minimo: stockMinimoRaw,
            stock_maximo: stockMaximoRaw,
            error: 'Ya existe un producto con este nombre.'
        });
    }

    try {
      await db.producto.update({
        where: { id: Number(params.id) },
        data: { nombre, presentacion, precio, stock_minimo, stock_maximo },
      });
      await recordAuditLog(locals.user.id, 'Producto Actualizado', `Producto con ID ${params.id} actualizado. Nombre: "${nombre}".`);
    } catch (error) {
      console.error('Error updating product:', error);
      return fail(500, { message: 'Error al actualizar el producto.' });
    }

    throw redirect(303, '/productos');
  },
};
