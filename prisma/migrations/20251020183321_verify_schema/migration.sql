-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT,
    "direccion" TEXT NOT NULL,
    "responsable" TEXT NOT NULL,
    "cedulaRif" TEXT NOT NULL
);
INSERT INTO "new_Cliente" ("cedulaRif", "codigo", "direccion", "id", "nombre", "responsable") SELECT "cedulaRif", "codigo", "direccion", "id", "nombre", "responsable" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
CREATE UNIQUE INDEX "Cliente_codigo_key" ON "Cliente"("codigo");
CREATE UNIQUE INDEX "Cliente_cedulaRif_key" ON "Cliente"("cedulaRif");
CREATE TABLE "new_Producto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "precio" REAL NOT NULL,
    "existencia" INTEGER NOT NULL,
    "stock_minimo" INTEGER NOT NULL DEFAULT 0,
    "stock_maximo" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Producto" ("existencia", "id", "nombre", "precio") SELECT "existencia", "id", "nombre", "precio" FROM "Producto";
DROP TABLE "Producto";
ALTER TABLE "new_Producto" RENAME TO "Producto";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
