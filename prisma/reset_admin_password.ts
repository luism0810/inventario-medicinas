import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
	console.log('--- Restablecer Contraseña de Administrador ---');

	const username = process.argv[2];
	const password = process.argv[3];

	if (!username || !password) {
		console.error('Uso: npx ts-node prisma/reset_admin_password.ts <username> <new_password>');
		await prisma.$disconnect();
		process.exit(1);
		return;
	}

	try {
		const existingUser = await prisma.user.findUnique({
			where: { username }
		});

		if (!existingUser) {
			console.error(`El usuario "${username}" no existe.`);
			await prisma.$disconnect();
			process.exit(1);
			return;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = await prisma.user.update({
			where: {
				username
			},
			data: {
				password: hashedPassword
			}
		});

		console.log(`\n¡Contraseña para "${user.username}" restablecida exitosamente!`);
	} catch (e) {
		console.error('Ocurrió un error al restablecer la contraseña:', e);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

main().catch((e) => {
	console.error(e);
	prisma.$disconnect();
	process.exit(1);
});
