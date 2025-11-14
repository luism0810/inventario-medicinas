import { db } from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const users = await db.user.findMany({
		select: {
			id: true,
			username: true,
			role: true,
			active: true
		}
	});

	return {
		users
	};
};
