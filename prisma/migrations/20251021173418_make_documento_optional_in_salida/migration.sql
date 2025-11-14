-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
