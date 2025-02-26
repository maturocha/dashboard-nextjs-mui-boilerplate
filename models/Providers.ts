export const api = '/providers'

export const columnsTable = [
  { name: 'Nombre', property: 'name', sort: false },
  { name: 'Dirección', property: 'address', sort: false },
  {
      name: 'Acciones',
      property: 'actions',
      filter: false,
      sort: false,
  },
];

export interface Provider {
    id: number;
    name: string;
    address: string;
    type: string;
}