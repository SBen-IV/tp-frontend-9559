import * as z from "zod";

const roles = ["CLIENTE", "EMPLEADO"] as const;

export const userCreateSchema = z.object({
  nombre: z.string().min(1, "Ingrese su nombre"),
  apellido: z.string().min(1, "Ingrese su apellido"),
  email: z.string().email("Mail inválido"),
  contraseña: z.string("Ingrese una contraseña").min(8, "Demasiado corta"),
  rol: z.enum(roles, "Elija su rol"),
});

export type UserCreate = z.infer<typeof userCreateSchema>;
