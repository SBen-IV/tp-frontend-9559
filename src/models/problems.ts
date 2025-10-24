import * as z from "zod";
import { priorities } from "./commons";
import { configItemSchema } from "./config_items";
import { incidentSchema } from "./incidents";

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
});

export const problemCreateSchema = problemBaseSchema.extend({
  id_config_items: z.array(z.string().uuid()),
  id_incidentes: z.array(z.string().uuid()),
});

export const problemEditSchema = problemCreateSchema.extend({
  estado: z.enum(estados).nullable().optional(),
  responsable_id: z.string().uuid().nullable().optional(),
});

export const problemSchema = problemBaseSchema.extend({
  estado: z.enum(estados),
  fecha_creacion: z.date(),
  fecha_cierre: z.date().nullable().optional(),
  owner_id: z.string().uuid(),
  responsable_id: z.string().uuid(),
  id: z.string().uuid(),
  config_items: z.array(configItemSchema),
  incidentes: z.array(incidentSchema),
});

export type ProblemCreate = z.infer<typeof problemCreateSchema>;
export type ProblemEdit = z.infer<typeof problemEditSchema>;
export type Problem = z.infer<typeof problemSchema>;
