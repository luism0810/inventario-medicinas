import { db } from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const page = Number(url.searchParams.get('page') ?? '1');
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const totalSalidas = await db.salida.count();
  const totalPages = Math.ceil(totalSalidas / pageSize);

  const salidas = await db.salida.findMany({
    skip,
    take: pageSize,
    include: {
      cliente: true, // Changed from proveedor
      productos: {
        include: {
          producto: true,
        },
      },
    },
    orderBy: {
      id: 'desc',
    },
  });

  return {
    salidas, // Changed from ingresos
    currentPage: page,
    totalPages,
  };
};
