import * as z from "zod";

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
  version: z
    .string({ required_error: "Ingrese una versión" })
    .min(1, "Ingrese una versión"),
  categoria: z.enum(categorias),
});

export const configItemCreateSchema = configItemBaseSchema.extend({});

export const configItemSchema = configItemBaseSchema.extend({
  estado: z.enum(estados),
  fecha_creacion: z.date(),
  id: z.string().uuid(),
  owner_id: z.string().uuid(),
});

export type ConfigItemCreate = z.infer<typeof configItemCreateSchema>;
export type ConfigItem = z.infer<typeof configItemSchema>;
