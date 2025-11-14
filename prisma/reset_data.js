import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
    try {
        await prisma.$transaction(async (tx) => {
            // 1. Delete all SalidaProducto records
            await tx.salidaProducto.deleteMany();
            console.log('Deleted all SalidaProducto records.');
            // 2. Delete all IngresoProducto records
            await tx.ingresoProducto.deleteMany();
            console.log('Deleted all IngresoProducto records.');
            // 3. Delete all Salida records
            await tx.salida.deleteMany();
            console.log('Deleted all Salida records.');
            // 4. Delete all Ingreso records
            await tx.ingreso.deleteMany();
            console.log('Deleted all Ingreso records.');
            // 5. Reset existencia for all Producto records to 0
            await tx.producto.updateMany({
                data: {
                    existencia: 0,
                },
            });
            console.log('Reset existencia for all Producto records to 0.');
        });
        console.log('Database reset successful!');
    }
    catch (error) {
        console.error('Error resetting database:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
main();
