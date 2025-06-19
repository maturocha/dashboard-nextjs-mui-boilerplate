import { z } from 'zod'

export const api = {
  list: '/users',
  create: '/users',
  get: '/users/:id',
  update: '/users/:id',
  delete: '/users/:id',
}

export const views = {
  list: '/admin/usuarios',
  create: '/admin/usuarios/nuevo',
  update: '/admin/usuarios/:id/editar',
}

export const labels = {
  plural: 'Usuarios',
  singular: 'Usuario'
}

export const columnsTable = [
  { name: 'Nombre', property: 'name', sort: true },
  { name: 'Email', property: 'email', sort: true },
  { name: 'Rol', property: 'rol', sort: true },
  {
      name: 'Acciones',
      property: 'actions',
      filter: false,
      sort: false,
  },
];

export interface User {
    id: number;
    name: string;
    rol: string;
    role_id: number;
    email: string;
    cel: string;
}

export interface FormValues {
  name: string
  email: string
  role_id: number
  cel?: string
  password?: string
}

const baseSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres')
    .trim(),
  email: z
    .string()
    .min(1, 'El email es obligatorio')
    .email('Formato de email inválido')
    .max(255, 'El email no puede exceder los 255 caracteres')
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(255, 'La contraseña no puede exceder los 255 caracteres'),
  role_id: z
    .number()
    .int('El rol debe ser un número entero')
    .positive('Debe seleccionar un rol válido'),
  cel: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 7, {
      message: 'El celular debe tener al menos 7 dígitos'
    })
    .refine((val) => !val || /^[0-9+\-\s()]+$/.test(val), {
      message: 'El celular solo puede contener números, espacios, guiones y paréntesis'
    }),
})

// Schema para create (password obligatorio)
export const schemaCreate = baseSchema

// Schema para edit (password opcional)
export const schemaUpdate = baseSchema.extend({
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .max(255, 'La contraseña no puede exceder los 255 caracteres')
    .optional()
    .or(z.literal('')), // Permite string vacío
})