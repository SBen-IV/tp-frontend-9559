import * as z from "zod";

const roles = ["CLIENTE", "EMPLEADO"] as const;

export const userBaseSchema = z.object({
  nombre: z
    .string({ required_error: "Ingrese su nombre" })
    .min(1, "Ingrese su nombre"),
  apellido: z
    .string({ required_error: "Ingrese su apellido" })
    .min(1, "Ingrese su apellido"),
  email: z
    .string({ required_error: "Ingrese su email" })
    .email("Mail inválido"),
});

export const userCreateSchema = userBaseSchema.extend({
  contraseña: z
    .string({ required_error: "Ingrese una contraseña" })
    .min(8, "Demasiado corta"),
  rol: z.enum(roles),
});

export const userLoginSchema = z.object({
  email: z
    .string({ required_error: "Ingrese su email" })
    .email("Mail inválido"),
  contraseña: z
    .string({ required_error: "Ingrese una contraseña" })
    .min(8, "Demasiado corta"),
});

export const userSchema = userBaseSchema.extend({
  rol: z.enum(roles),
  id: z.string().uuid(),
});

export type UserCreate = z.infer<typeof userCreateSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type User = z.infer<typeof userSchema>;