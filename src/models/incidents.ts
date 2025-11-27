import * as z from "zod";
import { priorities } from "./commons";
import { configItemSchema } from "./config_items";
import type { User } from "./users";
import type { colorsByIncidenteEstado } from "@/lib/utils";

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

export const incidentBaseSchema = z.object({
  titulo: z
    .string({ required_error: "Ingrese un titulo" })
    .min(1, "Ingrese un titulo"),
  descripcion: z
    .string({ required_error: "Ingrese una descripción" })
    .min(1, "Ingrese una descripción"),
  prioridad: z.enum(priorities),
  categoria: z.enum(incidentCategory), 
})

export const incidentCreateSchema = incidentBaseSchema.extend({
  id_config_items: z.array(z.string().uuid()), 
});

export const incidentSchema = incidentBaseSchema.extend({
  estado: z.enum(incidentStatus),
  fecha_creacion: z.date(),
  fecha_cierre: z.date().nullable().optional(),
  owner_id: z.string().uuid(),
  responsable_id: z.string().uuid(),
  id: z.string().uuid(),
  config_items: z.array(configItemSchema),  
})

export const incidentEditSchema = incidentBaseSchema.extend({
  estado: z.enum(incidentStatus).nullable().optional(),
  responsable_id: z.string().uuid().nullable().optional(),
  id_config_items: z.array(z.string().uuid()), 
})

export type IncidentProps = {
  employees: User[];
  tickets: Incident[];
  status: IncidentStatus;
  colorsByStatus: typeof colorsByIncidenteEstado;
};

export type IncidentStatus  = typeof incidentStatus;
export type IncidentCreate = z.infer<typeof incidentCreateSchema>;
export type Incident = z.infer<typeof incidentSchema>;
export type IncidentEdit = z.infer<typeof incidentEditSchema>;