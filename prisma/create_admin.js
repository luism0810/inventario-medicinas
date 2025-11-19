import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import readline from 'readline';
const prisma = new PrismaClient();
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function main() {
    console.log('--- Creación de Usuario Administrador ---');
    rl.question('Introduce el nombre de usuario para el administrador: ', async (username) => {
        if (!username) {
            console.error('El nombre de usuario no puede estar vacío.');
            rl.close();
            return;
        }
        rl.question('Introduce la contraseña para el administrador: ', async (password) => {
            if (!password) {
                console.error('La contraseña no puede estar vacía.');
                rl.close();
                return;
            }
            try {
                const hashedPassword = await bcrypt.hash(password, 10);
                const existingUser = await prisma.user.findUnique({
                    where: { username }
                });
                if (existingUser) {
                    console.error(`El usuario "${username}" ya existe.`);
                    return;
                }
                const user = await prisma.user.create({
                    data: {
                        username,
                        password: hashedPassword,
                        role: 'ADMIN',
                        active: true
                    }
                });
                console.log(`\n¡Usuario administrador "${user.username}" creado exitosamente!`);
                console.log('Ahora puedes iniciar la aplicación (`npm run dev`) y acceder con estas credenciales.');
            }
            catch (e) {
                console.error('Ocurrió un error al crear el usuario:', e);
            }
            finally {
                await prisma.$disconnect();
                rl.close();
            }
        });
    });
}
main().catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
});
