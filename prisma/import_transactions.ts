import { PrismaClient } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();

interface TransactionCsvRow {
  FECHA: string;
  NUMERO: string; // This will be the 'id' for Ingreso/Salida
  CLIENTE: string; // Can be Proveedor or Cliente name
  PRODUCTO: string;
  CANTIDAD: string;
  'PRECIO UNITARIO': string;
  Observaciones: string; // New field
}

export async function importEntradas() {
  console.log('Iniciando carga de entradas desde entradas.csv...');
  const csvFilePath = path.resolve(__dirname, 'entradas.csv');
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

  const records: TransactionCsvRow[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ';', // Delimiter changed to semicolon as per user
    trim: true,
    bom: true,
  });

  let transactionCount = 0;
  let errorCount = 0;

  // Group records by NUMERO
  const groupedRecords = new Map<string, TransactionCsvRow[]>();
  for (const record of records) {
    if (!groupedRecords.has(record.NUMERO)) {
      groupedRecords.set(record.NUMERO, []);
    }
    groupedRecords.get(record.NUMERO)?.push(record);
  }

  for (const [numero, transactionRows] of groupedRecords.entries()) {
    try {
      await prisma.$transaction(async (tx) => {
        const firstRow = transactionRows[0]; // Use first row for common transaction data
        const fechaParts = firstRow.FECHA.split('/');
        const fecha = new Date(
          Number(fechaParts[2]),
          Number(fechaParts[1]) - 1,
          Number(fechaParts[0])
        );

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

        // Create ONE Ingreso
        const ingreso = await tx.ingreso.create({
          data: {
            id: parseInt(numero), // Use the grouped NUMERO as ID
            documento: firstRow.Observaciones || '', // Use Observaciones from first row
            proveedorId: proveedor.id,
            fecha: fecha,
          },
        });

        // Create IngresoProducto for EACH row in the group
        for (const row of transactionRows) {
          const cantidad = parseFloat(row.CANTIDAD.replace(',', '.'));
          if (isNaN(cantidad) || cantidad <= 0) {
            console.warn(`NUMERO ${numero}, Producto ${row.PRODUCTO}: Cantidad inválida (${row.CANTIDAD}). Saltando.`);
            continue; // Skip this product, but continue with others in the same transaction
          }

          let producto = await tx.producto.findUnique({
            where: { nombre: row.PRODUCTO },
          });
          if (!producto) {
            const precio = parseFloat(row['PRECIO UNITARIO'].replace(',', '.'));
            producto = await tx.producto.create({
              data: {
                nombre: row.PRODUCTO,
                precio: isNaN(precio) ? 0 : precio,
                existencia: 0,
                stock_minimo: 0,
                stock_maximo: 0,
              },
            });
          }

          await tx.ingresoProducto.create({
            data: {
              ingresoId: ingreso.id,
              productoId: producto.id,
              cantidad: Math.round(cantidad),
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
        transactionCount++;
      });
      console.log(`Imported Entrada NUMERO: ${numero}`);
    } catch (error) {
      console.error(`Error importing Entrada NUMERO ${numero}:`, error);
      errorCount++;
    }
  }
  console.log(`--- Resumen de Importación de Entradas ---`);
  console.log(`Total de registros procesados: ${records.length}`);
  console.log(`Entradas importadas exitosamente: ${transactionCount}`);
  console.log(`Entradas con errores/omitidas: ${errorCount}`);
}

export async function importSalidas() {
  console.log('Iniciando carga de salidas desde salidas.csv...');
  const csvFilePath = path.resolve(__dirname, 'salidas.csv');
  const fileContent = fs.readFileSync(csvFilePath, { encoding: 'utf-8' });

  const records: TransactionCsvRow[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ';', // Delimiter changed to semicolon as per user
    trim: true,
    bom: true,
  });

  let transactionCount = 0;
  let errorCount = 0;

  // Group records by NUMERO
  const groupedRecords = new Map<string, TransactionCsvRow[]>();
  for (const record of records) {
    if (!groupedRecords.has(record.NUMERO)) {
      groupedRecords.set(record.NUMERO, []);
    }
    groupedRecords.get(record.NUMERO)?.push(record);
  }

  for (const [numero, transactionRows] of groupedRecords.entries()) {
    try {
      await prisma.$transaction(async (tx) => {
        const firstRow = transactionRows[0]; // Use first row for common transaction data
        const fechaParts = firstRow.FECHA.split('/');
        const fecha = new Date(
          Number(fechaParts[2]),
          Number(fechaParts[1]) - 1,
          Number(fechaParts[0])
        );

        let cliente = await tx.cliente.findUnique({
          where: { nombre: firstRow.CLIENTE },
        });
        if (!cliente) {
          cliente = await tx.cliente.create({
            data: {
              nombre: firstRow.CLIENTE,
              direccion: 'Dirección por defecto',
              responsable: 'Responsable por defecto',
              cedulaRif: 'V-00000000',
            },
          });
        }

        // Create ONE Salida
        const salida = await tx.salida.create({
          data: {
            id: parseInt(numero), // Use the grouped NUMERO as ID
            documento: firstRow.Observaciones || null, // Use Observaciones from first row
            clienteId: cliente.id,
            fecha: fecha,
          },
        });

        // Create SalidaProducto for EACH row in the group
        for (const row of transactionRows) {
          const cantidad = parseFloat(row.CANTIDAD.replace(',', '.'));
          if (isNaN(cantidad) || cantidad <= 0) {
            console.warn(`NUMERO ${numero}, Producto ${row.PRODUCTO}: Cantidad inválida (${row.CANTIDAD}). Saltando.`);
            continue; // Skip this product, but continue with others in the same transaction
          }

          let producto = await tx.producto.findUnique({
            where: { nombre: row.PRODUCTO },
          });
          if (!producto) {
            const precio = parseFloat(row['PRECIO UNITARIO'].replace(',', '.'));
            producto = await tx.producto.create({
              data: {
                nombre: row.PRODUCTO,
                precio: isNaN(precio) ? 0 : precio,
                existencia: 0,
                stock_minimo: 0,
                stock_maximo: 0,
              },
            });
          }

          // Check for sufficient stock before decrementing
          if (producto.existencia < cantidad) {
            console.warn(`NUMERO ${numero}, Producto ${producto.nombre}: Stock insuficiente (${producto.existencia}) para la salida (${cantidad}). Saltando decremento de stock.`);
            // Optionally, you could throw an error here to rollback the whole transaction
            // For now, we'll just log a warning and proceed without decrementing for this item
          } else {
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
        transactionCount++;
      });
      console.log(`Imported Salida NUMERO: ${numero}`);
    } catch (error) {
      console.error(`Error importing Salida NUMERO ${numero}:`, error);
      errorCount++;
    }
  }
  console.log(`--- Resumen de Importación de Salidas ---`);
  console.log(`Total de registros procesados: ${records.length}`);
  console.log(`Salidas importadas exitosamente: ${transactionCount}`);
  console.log(`Salidas con errores/omitidas: ${errorCount}`);
}
