import { auditSchema, priorities } from "./commons";
import { configItemSchema } from "./config_items";
import * as z from "zod";

export const changeStatus = [
  "RECIBIDO",
  "ACEPTADO",
  "RECHAZADO",
  "EN_PROGRESO",
  "CERRADO",
] as const;

export const changeBaseSchema = z.object({
  titulo: z
    .string({ required_error: "Ingrese un titulo" })
    .min(1, "Ingrese un titulo"),
  descripcion: z
    .string({ required_error: "Ingrese una descripción" })
    .min(1, "Ingrese una descripción"),
  prioridad: z.enum(priorities),
});

export const changeCreateSchema = changeBaseSchema.extend({
  id_config_items: z.array(z.string().uuid()),
});

export const changeEditSchema = changeBaseSchema.extend({
  estado: z.enum(changeStatus).nullable().optional(),
  id_config_items: z.array(z.string().uuid()),
});

export const changeSchema = changeBaseSchema.extend({
  estado: z.enum(changeStatus),
  fecha_creacion: z.date(),
  fecha_cierre: z.date().nullable().optional(),
  id: z.string().uuid(),
  owner_id: z.string().uuid(),
  config_items: z.array(configItemSchema),
});

// This is what the backend returns
export const changeAuditSchema = auditSchema.extend({
  estado_nuevo: changeSchema
    .omit({ config_items: true })
    .extend({ id_config_items: z.array(z.string().uuid()) }),
});

// We want the changeSchema and the audit information (operacion, fecha_actualizacion, id, ...)
// We remove unnecessary info like the change ID, creation date, and its owner 
export const changeVersionSchema = changeSchema
  .omit({ id: true, fecha_creacion: true, owner_id: true })
  .merge(auditSchema)

export type ChangeCreate = z.infer<typeof changeCreateSchema>;
export type ChangeEdit = z.infer<typeof changeEditSchema>;
export type Change = z.infer<typeof changeSchema>;
export type ChangeAudit = z.infer<typeof changeAuditSchema>;
export type ChangeVersion = z.infer<typeof changeVersionSchema>;
