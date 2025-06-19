import { z } from 'zod'

export const api = {
  list: '/categories',
  create: '/categories',
  get: '/categories/:id',
  update: '/categories/:id',
  delete: '/categories/:id',
}

export const views = {
  list: '/admin/categorias',
  create: '/admin/categorias/nuevo',
  update: '/admin/categorias/:id/editar',
}

export const labels = {
  plural: 'Categorías',
  singular: 'Categoría'
}

export const columnsTable = [
    { 
        name: 'Nombre', 
        property: 'name',
        sort: true
      },
      {
        name: 'Slug',
        property: 'slug',
        sort: false
      },
      {
        name: 'Acciones',
        property: 'actions',
        sort: false
      }
]

export interface Category {
    id: number;
    name: string;
    slug: string;
}

export interface FormValues {
  name: string
}

export const validationSchema = z.object({
  name: z
    .string()
    .min(1, 'El nombre es obligatorio')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder los 100 caracteres')
    .trim()
    .refine((value) => value.length > 0, {
      message: 'El nombre no puede estar vacío'
    })
})