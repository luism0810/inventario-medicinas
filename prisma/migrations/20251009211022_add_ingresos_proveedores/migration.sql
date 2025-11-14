-- CreateTable
CREATE TABLE "Proveedor" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "direccion" TEXT,
    "telefono" TEXT
);

-- CreateTable
CREATE TABLE "Ingreso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "documento" TEXT NOT NULL,
    "proveedorId" INTEGER NOT NULL,
    "fecha" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Ingreso_proveedorId_fkey" FOREIGN KEY ("proveedorId") REFERENCES "Proveedor" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "IngresoProducto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ingresoId" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,
    CONSTRAINT "IngresoProducto_ingresoId_fkey" FOREIGN KEY ("ingresoId") REFERENCES "Ingreso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "IngresoProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "Producto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Proveedor_nombre_key" ON "Proveedor"("nombre");
