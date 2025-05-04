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
  name: z.string().min(1, 'Obligatorio'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  role_id: z.number().int('Rol inválido'),
  cel: z.string().optional(),
})

// Schema para create (usa todo tal cual)
export const schemaCreate = baseSchema

// Schema para edit (password opcional)
export const schemaUpdate = baseSchema.extend({
  password: z.string().min(6, 'Mínimo 6 caracteres').optional(),
})