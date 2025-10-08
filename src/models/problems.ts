import * as z from "zod";
import { priorities } from "./commons";

export const problemCreateSchema = z.object({
  titulo: z
    .string({ required_error: "Ingrese un titulo" })
    .min(1, "Ingrese un titulo"),
  descripcion: z
    .string({ required_error: "Ingrese una descripción" })
    .min(1, "Ingrese una descripción"),
  prioridad: z.enum(priorities),
  id_config_items: z.array(z.string().uuid()),
});

export type ProblemCreate = z.infer<typeof problemCreateSchema>;
