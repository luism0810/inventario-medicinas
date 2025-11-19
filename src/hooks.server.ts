import { db } from '$lib/prisma';
import { redirect } from '@sveltejs/kit';

const unprotectedRoutes = ['/login', '/reset-password'];

export const handle = async ({ event, resolve }) => {
    // Ejecutar logout primero para permitir limpiar la sesión incluso sin token válido
    if (event.url.pathname === '/logout') {
        const sessionToken = event.cookies.get('session');
        event.cookies.delete('session', { path: '/' });
        if (sessionToken) {
            await db.session.delete({ where: { id: sessionToken } }).catch(() => {});
        }
        throw redirect(303, '/login');
    }

    const isApi = event.url.pathname.startsWith('/api');
    const sessionToken = event.cookies.get('session');

    if (!sessionToken) {
        event.locals.user = null;
        // Para rutas de UI redirigir a login; para API devolver 401 JSON
        if (!unprotectedRoutes.includes(event.url.pathname)) {
            if (isApi) {
                return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            throw redirect(303, '/login');
        }
    } else {
        const session = await db.session.findUnique({
            where: { id: sessionToken },
            include: { user: true }
        });

        if (session && session.user) {
            // eliminar campos sensibles y normalizar role
            const { password, ...userSafe } = session.user as any;
            userSafe.role = userSafe.role ?? null;
            event.locals.user = userSafe;
        } else {
            // token inválido: limpiar cookie y responder apropiadamente
            event.cookies.delete('session', { path: '/' });
            event.locals.user = null;
            if (!unprotectedRoutes.includes(event.url.pathname)) {
                if (isApi) {
                    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                        status: 401,
                        headers: { 'Content-Type': 'application/json' }
                    });
                }
                throw redirect(303, '/login');
            }
        }
    }

    return resolve(event);
};
