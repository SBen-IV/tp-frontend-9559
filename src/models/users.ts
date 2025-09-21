import * as z from "zod";

const roles = ["CLIENTE", "EMPLEADO"] as const;

export const usuarioCrearSchema = z.object({
  nombre: z.string("Ingrese su nombre").min(2, "Demasiado corto"),
  apellido: z.string("Ingrese su apellido").min(2, "Demasiado corto"),
  email: z.email("Mail inválido"),
  contraseña: z.string("Ingrese una contraseña").min(2, "Demasiado corta"),
  rol: z.enum(roles, "Elija su rol"),
});

export type UsuarioCrear = z.infer<typeof usuarioCrearSchema>;
