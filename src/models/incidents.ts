import * as z from "zod";
import { priorities } from "./commons";

export const incidentStatus = [
  "NUEVO",
  "RESUELTO",
  "EN_PROGRESO",
  "CERRADO",
] as const;
export const incidentCategory = [
  "SOFTWARE",
  "HARDWARE",
  "SOLICITUD_DE_SERVICIO",
  "SEGURIDAD",
] as const;

export const incidentCreateSchema = z.object({
  titulo: z
    .string({ required_error: "Ingrese un titulo" })
    .min(1, "Ingrese un titulo"),
  descripcion: z
    .string({ required_error: "Ingrese una descripción" })
    .min(1, "Ingrese una descripción"),
  prioridad: z.enum(priorities),
  categoria: z.enum(incidentCategory),
  id_config_items: z.array(z.string().uuid()),
});

export type IncidentCreate = z.infer<typeof incidentCreateSchema>;
