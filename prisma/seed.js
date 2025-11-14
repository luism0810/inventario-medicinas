import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { importEntradas, importSalidas } from './import_transactions.js';
// Solución para __dirname en módulos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();
async function main() {
    console.log('Iniciando el proceso de seeding...');
    // --- Limpiar tablas existentes (Salidas e Ingresos) ---
    console.log('Limpiando registros de SalidaProducto...');
    await prisma.salidaProducto.deleteMany();
    console.log('Limpiando registros de Salida...');
    await prisma.salida.deleteMany();
    console.log('Limpiando registros de IngresoProducto...');
    await prisma.ingresoProducto.deleteMany();
    console.log('Limpiando registros de Ingreso...');
    await prisma.ingreso.deleteMany();
    console.log('Tablas Salida e Ingreso limpiadas.');
    // --- Cargar Clientes ---
    try {
        const clientesPath = path.join(__dirname, 'clientes.csv');
        const clientesFile = fs.readFileSync(clientesPath, 'utf8');
        const clientesData = parse(clientesFile, {
            columns: true, // Lee la primera línea como cabeceras
            skip_empty_lines: true,
            delimiter: ';',
            bom: true,
        });
        console.log(`Encontrados ${clientesData.length} clientes en clientes.csv`);
        for (const [index, cliente] of clientesData.entries()) {
            const record = cliente;
            try {
                // Usa upsert para crear o actualizar, usando 'nombre' como identificador único
                await prisma.cliente.upsert({
                    where: { nombre: record.NOMBRE }, // Changed to nombre
                    update: {
                        codigo: record.CODIGO || null, // Handle optional codigo
                        direccion: record.DIRECCION || null,
                        responsable: record.RESPONSABLE || null,
                        cedulaRif: record.CEDULA || null
                    },
                    create: {
                        nombre: record.NOMBRE,
                        codigo: record.CODIGO || null, // Handle optional codigo
                        direccion: record.DIRECCION || null,
                        responsable: record.RESPONSABLE || null,
                        cedulaRif: record.CEDULA || null
                    }
                });
            }
            catch (error) {
                console.error(`Error procesando la fila de cliente ${index + 2}:`, cliente);
                throw error; // Lanza el error para que sea capturado por el catch principal
            }
        }
        console.log('Clientes cargados exitosamente.');
    }
    catch (error) {
        console.error('\n--- ERROR CARGANDO CLIENTES ---');
        throw error; // Lanza el error para que sea capturado por el catch principal
    }
    // --- Cargar Productos ---
    try {
        const productosPath = path.join(__dirname, 'productos.csv');
        const productosFile = fs.readFileSync(productosPath, 'utf8');
        const productosData = parse(productosFile, {
            columns: true, // Lee la primera línea como cabeceras
            skip_empty_lines: true,
            delimiter: ';',
            bom: true,
        });
        console.log(`Encontrados ${productosData.length} productos en productos.csv`);
        for (const [index, producto] of productosData.entries()) {
            const record = producto;
            try {
                // Para productos, simplemente creamos. Si hay un duplicado, lo informamos y continuamos.
                await prisma.producto.create({
                    data: {
                        nombre: record.NOMBRE,
                        precio: parseFloat(record.PRECIO) || 0,
                        existencia: parseInt(record.STOCK, 10) || 0
                    }
                });
            }
            catch (error) {
                // Si el error es un duplicado (P2002), lo ignoramos y continuamos.
                if (error.code === 'P2002') {
                    console.warn(`ADVERTENCIA: Producto en la fila ${index + 2} ya existe, se omite.`);
                }
                else {
                    console.error(`Error procesando la fila de producto ${index + 2}:`, producto);
                    throw error; // Lanza cualquier otro error
                }
            }
        }
        console.log('Productos cargados exitosamente.');
    }
    catch (error) {
        console.error(`
--- ERROR CARGANDO PRODUCTOS ---`);
        console.error('Asegúrate de que productos.csv está en la carpeta prisma y que las columnas NOMBRE, PRECIO, y STOCK existen.');
        throw error; // Lanza el error para que sea capturado por el catch principal
    }
    // --- Cargar Entradas ---
    try {
        console.log(`
Iniciando carga de entradas...`);
        await importEntradas();
        console.log(`Entradas cargadas exitosamente.`);
    }
    catch (error) {
        console.error(`
--- ERROR CARGANDO ENTRADAS ---`);
        throw error;
    }
    // --- Cargar Salidas ---
    try {
        console.log(`
Iniciando carga de salidas...`);
        await importSalidas();
        console.log(`Salidas cargadas exitosamente.`);
    }
    catch (error) {
        console.error(`
--- ERROR CARGANDO SALIDAS ---`);
        throw error;
    }
    console.log(`
Seeding finalizado exitosamente.`);
}
main()
    .catch((e) => {
    console.error('\n--- FALLO EL SCRIPT DE SEEDING ---');
    console.error('Nombre del Error:', e.name);
    console.error('Mensaje del Error:', e.message);
    // Prisma a menudo incluye un código de error específico
    if (e.code) {
        console.error('Código de Prisma:', e.code);
    }
    console.error('\nStack del Error:\n', e.stack);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
