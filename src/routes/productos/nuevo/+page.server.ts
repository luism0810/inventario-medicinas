import { db } from '$lib/prisma';
import { fail, redirect } from '@sveltejs/kit';
import { recordAuditLog } from '$lib/audit';
import pkg from '@prisma/client';
import type { PageServerLoad, Actions } from './$types';
const { Presentacion } = pkg;

export const load: PageServerLoad = async () => {
  return {
    presentaciones: Object.values(Presentacion)
  };
};

export const actions: Actions = {
  default: async ({ request, locals }) => {
    if (!locals.user) {
      return fail(401, { message: 'No autorizado.' });
    }

    const data = await request.formData();
    const nombre = data.get('nombre') as string;
    const presentacion = data.get('presentacion') as pkg.Presentacion;
    const precioRaw = data.get('precio') as string;
    const stockMinimoRaw = data.get('stock_minimo') as string || '0';
    const stockMaximoRaw = data.get('stock_maximo') as string || '0';

    const formData = {
      nombre,
      presentacion,
      precio: precioRaw,
      stock_minimo: stockMinimoRaw,
      stock_maximo: stockMaximoRaw,
    };

    const precio = parseFloat(precioRaw.replace(',', '.'));
    const existencia = 0; // Set existencia to 0 by default
    const stock_minimo = parseInt(stockMinimoRaw, 10);
    const stock_maximo = parseInt(stockMaximoRaw, 10);

    if (!nombre) {
      return fail(400, { ...formData, error: 'El nombre es obligatorio.' });
    }

    if (isNaN(precio) || precio <= 0) {
      return fail(400, { ...formData, error: 'El precio debe ser un número positivo.' });
    }

    try {
      await db.producto.create({
        data: { nombre, presentacion, precio, existencia, stock_minimo, stock_maximo },
      });
      await recordAuditLog(locals.user.id, 'Producto Creado', `Producto "${nombre}" creado.`);
    } catch (e) {
      const error = e as { code?: string };
      // P2002 is the Prisma code for unique constraint violation
      if (error.code === 'P2002') {
        return fail(400, { ...formData, error: 'El nombre del producto ya existe.' });
      }
      return fail(500, { ...formData, error: 'Error al crear el producto.' });
    }

    throw redirect(303, '/productos');
  },
};
