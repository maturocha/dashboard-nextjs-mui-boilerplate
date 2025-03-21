import * as Yup from 'yup'

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
        name: 'Acciones',
        property: 'actions',
        sort: false
      }
]

export interface Category {
    id: number;
    name: string;
}

export interface FormValues {
  name: string
}

export const validationSchema = () => Yup.object().shape({
  name: Yup.string()
    .required('Obligatorio')
})