/*
  Warnings:

  - You are about to drop the column `orden` on the `Ingreso` table. All the data in the column will be lost.
  - You are about to drop the column `orden` on the `Salida` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ingreso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "documento" TEXT NOT NULL,
    "proveedorId" INTEGER NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Ingreso_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ingreso" ("documento", "fecha", "id", "proveedorId") SELECT "documento", "fecha", "id", "proveedorId" FROM "Ingreso";
DROP TABLE "Ingreso";
ALTER TABLE "new_Ingreso" RENAME TO "Ingreso";
CREATE TABLE "new_Salida" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "documento" TEXT,
    "clienteId" INTEGER NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Salida_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Salida" ("clienteId", "documento", "fecha", "id") SELECT "clienteId", "documento", "fecha", "id" FROM "Salida";
DROP TABLE "Salida";
ALTER TABLE "new_Salida" RENAME TO "Salida";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
