import { db } from '$lib/prisma';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const id = Number(params.id);

  if (isNaN(id)) {
    throw error(404, 'ID de salida inválido');
  }

  const salida = await db.salida.findUnique({
    where: { id },
    include: {
      cliente: true,
      productos: {
        include: {
          producto: true,
        },
      },
    },
  });

  if (!salida) {
    throw error(404, 'Salida no encontrada');
  }

  return { salida };
};
