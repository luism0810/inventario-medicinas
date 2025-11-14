import { db } from '$lib/prisma';

export async function recordAuditLog(userId: number, action: string, details: string) {
	try {
		await db.auditLog.create({
			data: {
				userId,
				action,
				details
			}
		});
	} catch (error) {
		console.error('Error recording audit log:', error);
		// Optionally, handle this error more robustly, e.g., send to an external logging service
	}
}
