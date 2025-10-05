import * as z from "zod";

export const changePriority = ["BAJA", "MEDIA", "ALTA", "URGENTE"] as const;
export const changeStatus = ["RECIBIDO", "ACEPTADO", "RECHAZADO", "EN_PROGRESO", "CERRADO"] as const;

export const changeCreateSchema = z.object({
  titulo: z.string({required_error: 'Ingrese un titulo'}).min(1, "Ingrese un titulo"),
  descripcion: z.string({required_error: 'Ingrese una descripción'}).min(1, "Ingrese una descripción"),
  prioridad: z.enum(changePriority),
  id_config_items:  z.array(z.string().uuid())
});

export type ChangeCreate = z.infer<typeof changeCreateSchema>;
