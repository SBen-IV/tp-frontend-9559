import * as z from "zod";

const categorias = ["SOFTWARE", "HARDWARE", "DOCUMENTACION"] as const;

export const configItemCreateSchema = z.object({
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

export type ConfigItemCreate = z.infer<typeof configItemCreateSchema>;
