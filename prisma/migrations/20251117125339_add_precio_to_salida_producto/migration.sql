/*
  Warnings:

  - Added the required column `precio` to the `SalidaProducto` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SalidaProducto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "salidaId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio" REAL NOT NULL,
    CONSTRAINT "SalidaProducto_salidaId_fkey" FOREIGN KEY ("salidaId") REFERENCES "Salida" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SalidaProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SalidaProducto" ("cantidad", "id", "productoId", "salidaId") SELECT "cantidad", "id", "productoId", "salidaId" FROM "SalidaProducto";
DROP TABLE "SalidaProducto";
ALTER TABLE "new_SalidaProducto" RENAME TO "SalidaProducto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
