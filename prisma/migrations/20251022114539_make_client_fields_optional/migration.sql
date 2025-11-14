-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cliente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "codigo" TEXT,
    "direccion" TEXT,
    "responsable" TEXT,
    "cedulaRif" TEXT
);
INSERT INTO "new_Cliente" ("cedulaRif", "codigo", "direccion", "id", "nombre", "responsable") SELECT "cedulaRif", "codigo", "direccion", "id", "nombre", "responsable" FROM "Cliente";
DROP TABLE "Cliente";
ALTER TABLE "new_Cliente" RENAME TO "Cliente";
CREATE UNIQUE INDEX "Cliente_nombre_key" ON "Cliente"("nombre");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
