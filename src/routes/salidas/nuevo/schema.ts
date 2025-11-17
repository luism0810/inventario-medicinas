import { z } from 'zod';

export const SalidaSchema = z.object({
  clienteId: z.coerce.number().int().positive({ message: "El cliente es requerido."}),
  productos: z.array(z.object({
    productoId: z.coerce.number(),
    cantidad: z.coerce.number().min(1, { message: 'La cantidad debe ser mayor a 0.' })
  })).min(1, { message: 'Debe seleccionar al menos un producto.' })
});
