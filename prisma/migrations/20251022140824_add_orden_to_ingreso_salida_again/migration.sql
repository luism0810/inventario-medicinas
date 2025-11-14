/*
  Warnings:

  - A unique constraint covering the columns `[orden]` on the table `Ingreso` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[orden]` on the table `Salida` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Ingreso" ADD COLUMN "orden" INTEGER;

-- AlterTable
ALTER TABLE "Salida" ADD COLUMN "orden" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Ingreso_orden_key" ON "Ingreso"("orden");

-- CreateIndex
CREATE UNIQUE INDEX "Salida_orden_key" ON "Salida"("orden");
