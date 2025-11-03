import z from "zod";

export const priorities = ["BAJA", "MEDIA", "ALTA", "URGENTE"] as const;

export const impactos = ["MENOR", "SIGNIFICATIVO", "MAYOR"] as const;

export const tipoEntidad = ["CAMBIO", "CONFIG_ITEM", "INCIDENTE", "PROBLEMA"] as const;

export const operacion = ["CREAR", "ACTUALIZAR", "ELIMINAR"] as const;

export const auditSchema = z.object({
  tipo_entidad: z.enum(tipoEntidad),
  operacion: z.enum(operacion),
  id_entidad: z.string().uuid(),
  actualizado_por: z.string().uuid(),
  id: z.string().uuid(),
  fecha_actualizacion: z.date()
})