import { z } from "zod";

export const registerSchema = z.object({
  name: z.string()
    .min(1, "El nombre es requerido")
    .max(50, "El nombre debe tener máximo 50 caracteres"),
  email: z.string()
    .email("Correo electrónico inválido")
    .min(1, "El correo es obligatorio"),
  phone: z.string()
    .min(1, "El teléfono es requerido")
    .regex(/^\d{10}$/, "El teléfono debe tener 10 dígitos"),
  password: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe tener al menos una mayúscula")
    .regex(/[a-z]/, "La contraseña debe tener al menos una minúscula")
    .regex(/[0-9]/, "La contraseña debe tener al menos un número"),
  confirm_password: z.string()
    .min(1, "Confirma tu contraseña")
}).refine((data) => data.password === data.confirm_password, {
  message: "Las contraseñas no coinciden",
  path: ["confirm_password"]
});