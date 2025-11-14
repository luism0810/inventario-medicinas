import { db } from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const page = Number(url.searchParams.get('page') ?? '1');
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const totalIngresos = await db.ingreso.count();
  const totalPages = Math.ceil(totalIngresos / pageSize);

  const ingresos = await db.ingreso.findMany({
    skip,
    take: pageSize,
    include: {
      proveedor: true,
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
    ingresos,
    currentPage: page,
    totalPages,
  };
};
