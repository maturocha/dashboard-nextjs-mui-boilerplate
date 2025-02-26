export const api = {
  list: '/roles',
  create: '/roles',
  update: '/roles/:id',
  delete: '/roles/:id',
}

export const views = {
  list: '/admin/roles',
  create: '/admin/roles/nuevo',
  update: '/admin/roles/:id/editar',
}

export const columnsTable = [
  { name: 'Nombre', property: 'name', sort: true },
  { name: 'Descripción', property: 'description', sort: true },
  {
      name: 'Acciones',
      property: 'actions',
      filter: false,
      sort: false,
  },
];

export interface Role {
    id: number;
    name: string;
    description: string;
}