import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	if (locals.user.role !== 'ADMIN') {
		throw redirect(303, '/'); // Redirect non-admin users to home
	}

	return {
		user: locals.user
	};
};
