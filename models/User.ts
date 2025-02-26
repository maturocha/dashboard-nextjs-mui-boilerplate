import * as Yup from 'yup'

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

export const columnsTable = [
  { name: 'Name', property: 'name', sort: true },
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
  role_id: number|string
  cel?: string
  password?: string
}

export const validationSchema = (isCreating: boolean) => Yup.object().shape({
  name: Yup.string()
    .required('Obligatorio'),
  email: Yup.string()
    .email('Email inválido')
    .required('Obligatorio'),
  role_id: Yup.number()
    .required('Obligatorio'),
  cel: Yup.string()
    .nullable(),
  password: isCreating 
    ? Yup.string().required('Obligatorio')
    : Yup.string(),
})