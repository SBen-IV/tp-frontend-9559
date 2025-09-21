import * as z from "zod";

const roles = ["CLIENTE", "EMPLEADO"] as const;

export const usuarioCrearSchema = z.object({
  nombre: z.string("Ingrese su nombre"),
  apellido: z.string("Ingrese su apellido"),
  email: z.email("Mail inválido"),
  contraseña: z.string("Ingrese una contraseña").min(8, "Demasiado corta"),
  rol: z.enum(roles, "Elija su rol"),
});

export type UsuarioCrear = z.infer<typeof usuarioCrearSchema>;
