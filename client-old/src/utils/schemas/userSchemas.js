import { z } from 'zod';

export const emailSchema = z.object({
  email: z
    .string({ message: 'El correo electronico es obligatorio' })
    .email('El email es invalido'),
});
export const nameSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .min(3, 'El nombre debe tener al menos 8 caracteres')
    .max(60, 'El nombre debe tener hasta 60 caracteres como máximo'),
});

export const userAuthSchema = emailSchema.extend({
  password: z
    .string({ message: 'La contraseña es requerida' })
    .min(6, 'La contraseña debe tener al menos 6 carecteres')
    .max(100, 'La contraseña debe tener hasta 100 caracteres como maximo'),
});

export const signupEnterpriseSchema = nameSchema.merge(userAuthSchema).extend({
  domain: z
    .string({ message: 'El dominio es obligatorio' })
    .min(1, 'El dominio debe tener al menos un caracter'),
});

export const welcomeSchema = nameSchema.extend({
  lastname: z
    .string({ required_error: 'El apellido es requerido' })
    .min(3, 'El apellido debe tener al menos 8 caracteres')
    .max(60, 'El apellido debe tener hasta 60 caracteres como máximo'),
  username: z
    .string({ required_error: 'El nombre de usuario es requerido' })
    .min(3, 'El nombre de usuario debe tener al menos 8 caracteres')
    .max(60, 'El nombre de usuario debe tener hasta 60 caracteres como máximo'),
  role: z
    .string({ required_error: 'El rol es requerido' })
    .min(1, 'El rol es requerido. Ingrese un rol valido'),
});

export const inviteSchema = emailSchema.extend({
  role: z.string(),
});
