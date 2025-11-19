/*
  Warnings:

  - You are about to drop the column `presentacion` on the `Producto` table. All the data in the column will be lost.
  - Added the required column `presentacionId` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Presentacion" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Producto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT,
    "presentacionId" INTEGER NOT NULL,
    "precio" REAL NOT NULL,
    "existencia" INTEGER NOT NULL,
    "stock_minimo" INTEGER NOT NULL DEFAULT 0,
    "stock_maximo" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Producto_presentacionId_fkey" FOREIGN KEY ("presentacionId") REFERENCES "Presentacion" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Producto" ("codigo", "existencia", "id", "nombre", "precio", "stock_maximo", "stock_minimo") SELECT "codigo", "existencia", "id", "nombre", "precio", "stock_maximo", "stock_minimo" FROM "Producto";
DROP TABLE "Producto";
ALTER TABLE "new_Producto" RENAME TO "Producto";
CREATE UNIQUE INDEX "Producto_nombre_key" ON "Producto"("nombre");
CREATE UNIQUE INDEX "Producto_codigo_key" ON "Producto"("codigo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Presentacion_nombre_key" ON "Presentacion"("nombre");
