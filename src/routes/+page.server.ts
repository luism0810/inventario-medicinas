import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/prisma';

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const lowStockProducts = await db.producto.findMany({
		where: {
			stock_minimo: {
				gt: 0
			},
			existencia: {
				lte: db.producto.fields.stock_minimo
			}
		},
		orderBy: {
			existencia: 'asc'
		}
	});

	return {
		user: locals.user,
		lowStockProducts
	};
};
