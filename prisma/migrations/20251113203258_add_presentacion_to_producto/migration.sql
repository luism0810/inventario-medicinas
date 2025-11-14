-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Producto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "presentacion" TEXT NOT NULL DEFAULT 'UNIDAD',
    "precio" REAL NOT NULL,
    "existencia" INTEGER NOT NULL,
    "stock_minimo" INTEGER NOT NULL DEFAULT 0,
    "stock_maximo" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Producto" ("existencia", "id", "nombre", "precio", "stock_maximo", "stock_minimo") SELECT "existencia", "id", "nombre", "precio", "stock_maximo", "stock_minimo" FROM "Producto";
DROP TABLE "Producto";
ALTER TABLE "new_Producto" RENAME TO "Producto";
CREATE UNIQUE INDEX "Producto_nombre_key" ON "Producto"("nombre");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
