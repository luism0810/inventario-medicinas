import { db } from '$lib/prisma';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const auditLogs = await db.auditLog.findMany({
		include: {
			user: {
				select: {
					username: true
				}
			}
		},
		orderBy: {
			timestamp: 'desc'
		}
	});

	return {
		auditLogs
	};
};
