import { z } from 'zod';

export const IngresoSchema = z.object({
  documento: z.string().min(1, { message: 'El documento es requerido.' }),
  proveedorId: z.coerce.number().int().positive({ message: "El proveedor es requerido."}),
  productos: z.array(z.object({
    productoId: z.coerce.number(),
    cantidad: z.coerce.number().min(1, { message: 'La cantidad debe ser mayor a 0.' })
  })).min(1, { message: 'Debe seleccionar al menos un producto.' })
});
