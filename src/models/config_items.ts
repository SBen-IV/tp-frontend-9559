import * as z from "zod";
import { auditSchema } from "./commons";

export const categorias = ["SOFTWARE", "HARDWARE", "DOCUMENTACION"] as const;
export const estados = [
  "PLANEADO",
  "ENCARGADO",
  "EN_CREACION",
  "EN_PRUEBA",
  "EN_ALMACEN",
  "EN_PRODUCCION",
  "EN_MANTENIMIENTO",
] as const;

const configItemBaseSchema = z.object({
  nombre: z
    .string({ required_error: "Ingrese el nombre" })
    .min(1, "Ingrese el nombre"),
  descripcion: z
    .string({ required_error: "Ingrese una descripción" })
    .min(1, "Ingrese una descripción"),
  categoria: z.enum(categorias),
});

export const configItemCreateSchema = configItemBaseSchema.extend({
  version: z
    .string({ required_error: "Ingrese una versión" })
    .min(1, "Ingrese una versión"),
});

export const configItemEditSchema = configItemBaseSchema.extend({
  estado: z.enum(estados),
});

export const configItemSchema = configItemCreateSchema.extend({
  estado: z.enum(estados),
  fecha_creacion: z.date(),
  id: z.string().uuid(),
  owner_id: z.string().uuid(),
});


// This is what the backend returns
export const configItemAuditSchema = auditSchema.extend({
  estado_nuevo: configItemSchema
});

// We want the configItemSchema and the audit information (operacion, fecha_actualizacion, id, ...)
// We remove unnecessary info like the item ID, creation date, and its owner 
export const configItemVersionSchema = configItemSchema
  .omit({ id: true, fecha_creacion: true, owner_id: true })
  .merge(auditSchema)
  

export type ConfigItemCreate = z.infer<typeof configItemCreateSchema>;
export type ConfigItemEdit = z.infer<typeof configItemEditSchema>;
export type ConfigItem = z.infer<typeof configItemSchema>;
export type ConfigItemAudit = z.infer<typeof configItemAuditSchema>;
export type ConfigItemVersion = z.infer<typeof configItemVersionSchema>;
