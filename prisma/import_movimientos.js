import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url'; // New import
// Solución para __dirname en módulos ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const prisma = new PrismaClient();
export async function importMovimientos() {
    const csvFilePath = path.resolve(__dirname, 'movimientos.csv');
    const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });
    const records = await new Promise((resolve, reject) => {
        parse(fileContent, {
            delimiter: ';',
            columns: true,
            skip_empty_lines: true,
            trim: true,
        }, (err, output) => {
            if (err)
                return reject(err);
            resolve(output);
        });
    });
    // Group records by ORDEN
    const groupedRecords = new Map();
    for (const record of records) {
        if (!groupedRecords.has(record.ORDEN)) {
            groupedRecords.set(record.ORDEN, []);
        }
        groupedRecords.get(record.ORDEN)?.push(record);
    }
    let transactionCount = 0;
    let errorCount = 0;
    for (const [orden, transactionRows] of groupedRecords.entries()) {
        try {
            await prisma.$transaction(async (tx) => {
                const firstRow = transactionRows[0];
                const isIngreso = firstRow.ENTRADA && parseFloat(firstRow.ENTRADA.replace(',', '.')) > 0;
                const isSalida = firstRow.SALIDA && parseFloat(firstRow.SALIDA.replace(',', '.')) > 0;
                if (isIngreso && isSalida) {
                    console.warn(`Skipping ORDEN ${orden}: Ambiguous transaction type (both ENTRADA and SALIDA have values).`);
                    errorCount++;
                    return;
                }
                if (!isIngreso && !isSalida) {
                    console.warn(`Skipping ORDEN ${orden}: No ENTRADA or SALIDA quantity found.`);
                    errorCount++;
                    return;
                }
                const fechaParts = firstRow.FECHA.split('/');
                const fecha = new Date(Number(fechaParts[2]), Number(fechaParts[1]) - 1, Number(fechaParts[0]));
                const documento = firstRow.DOCUMENTO || null;
                if (isIngreso) {
                    // Handle Ingreso
                    let proveedor = await tx.proveedor.findUnique({
                        where: { nombre: firstRow.CLIENTE },
                    });
                    if (!proveedor) {
                        proveedor = await tx.proveedor.create({
                            data: {
                                nombre: firstRow.CLIENTE,
                                direccion: 'Dirección por defecto',
                                telefono: 'Teléfono por defecto',
                            },
                        });
                    }
                    const ingreso = await tx.ingreso.create({
                        data: {
                            documento: documento || '', // Documento is String, not String?
                            proveedorId: proveedor.id,
                            fecha: fecha,
                        },
                    });
                    for (const row of transactionRows) {
                        const cantidad = parseFloat(row.ENTRADA.replace(',', '.'));
                        if (isNaN(cantidad) || cantidad <= 0)
                            continue;
                        let producto = await tx.producto.findUnique({
                            where: { nombre: row.PRODUCTO },
                        });
                        if (!producto) {
                            const precio = parseFloat(row['PRECIO UNITARIO'].replace(',', '.'));
                            producto = await tx.producto.create({
                                data: {
                                    nombre: row.PRODUCTO,
                                    precio: isNaN(precio) ? 0 : precio,
                                    existencia: 0, // Will be incremented below
                                    stock_minimo: 0,
                                    stock_maximo: 0,
                                },
                            });
                        }
                        await tx.ingresoProducto.create({
                            data: {
                                ingresoId: ingreso.id,
                                productoId: producto.id,
                                cantidad: Math.round(cantidad), // Ensure integer quantity
                            },
                        });
                        await tx.producto.update({
                            where: { id: producto.id },
                            data: {
                                existencia: {
                                    increment: Math.round(cantidad),
                                },
                            },
                        });
                    }
                    console.log(`Imported Ingreso ORDEN: ${orden}`);
                }
                else if (isSalida) {
                    // Handle Salida
                    let cliente = await tx.cliente.findUnique({
                        where: { nombre: firstRow.CLIENTE },
                    });
                    if (!cliente) {
                        cliente = await tx.cliente.create({
                            data: {
                                nombre: firstRow.CLIENTE,
                                // codigo: `CLI-${firstRow.CLIENTE.substring(0, 5).toUpperCase()}`, // Removed dummy generation
                                direccion: 'Dirección por defecto',
                                responsable: 'Responsable por defecto',
                                cedulaRif: 'V-00000000',
                            },
                        });
                    }
                    const salida = await tx.salida.create({
                        data: {
                            documento: documento,
                            clienteId: cliente.id,
                            fecha: fecha,
                        },
                    });
                    for (const row of transactionRows) {
                        const cantidad = parseFloat(row.SALIDA.replace(',', '.'));
                        if (isNaN(cantidad) || cantidad <= 0)
                            continue;
                        let producto = await tx.producto.findUnique({
                            where: { nombre: row.PRODUCTO },
                        });
                        if (!producto) {
                            const precio = parseFloat(row['PRECIO UNITARIO'].replace(',', '.'));
                            producto = await tx.producto.create({
                                data: {
                                    nombre: row.PRODUCTO,
                                    precio: isNaN(precio) ? 0 : precio,
                                    existencia: 0, // Will be decremented below, but needs to exist
                                    stock_minimo: 0,
                                    stock_maximo: 0,
                                },
                            });
                        }
                        // Check for sufficient stock before decrementing
                        if (producto.existencia < cantidad) {
                            console.warn(`ORDEN ${orden}, Producto ${producto.nombre}: Stock insuficiente (${producto.existencia}) para la salida (${cantidad}). Saltando decremento de stock.`);
                            // Optionally, you could throw an error here to rollback the whole transaction
                            // For now, we'll just log a warning and proceed without decrementing for this item
                        }
                        else {
                            await tx.producto.update({
                                where: { id: producto.id },
                                data: {
                                    existencia: {
                                        decrement: Math.round(cantidad),
                                    },
                                },
                            });
                        }
                        await tx.salidaProducto.create({
                            data: {
                                salidaId: salida.id,
                                productoId: producto.id,
                                cantidad: Math.round(cantidad),
                            },
                        });
                    }
                    console.log(`Imported Salida ORDEN: ${orden}`);
                }
                transactionCount++;
            });
        }
        catch (error) {
            console.error(`Error importing ORDEN ${orden}:`, error);
            errorCount++;
        }
    }
    console.log(`\n--- Import Summary ---`);
    console.log(`Total transactions processed: ${groupedRecords.size}`);
    console.log(`Successfully imported: ${transactionCount} transactions`);
    console.log(`Transactions with errors/skipped: ${errorCount}`);
}
importMovimientos()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
