import * as z from "zod";
import { priorities } from "./commons";
import { configItemSchema } from "./config_items";

export const estados = [
  "EN_ANALISIS",
  "DETECTADO",
  "RESUELTO",
  "CERRADO",
] as const;

const problemBaseSchema = z.object({
  titulo: z
    .string({ required_error: "Ingrese un titulo" })
    .min(1, "Ingrese un titulo"),
  descripcion: z
    .string({ required_error: "Ingrese una descripción" })
    .min(1, "Ingrese una descripción"),
  prioridad: z.enum(priorities),
  id_config_items: z.array(z.string().uuid()),
});

export const problemCreateSchema = problemBaseSchema.extend({});

export const problemSchema = problemBaseSchema.extend({
  estado: z.enum(estados),
  fecha_creacion: z.date(),
  owner_id: z.string().uuid(),
  responsable_id: z.string().uuid(),
  id: z.string().uuid(),
  config_items: z.array(configItemSchema),
});

export type ProblemCreate = z.infer<typeof problemCreateSchema>;
export type Problem = z.infer<typeof problemSchema>;
