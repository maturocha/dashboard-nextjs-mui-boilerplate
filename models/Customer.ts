export const api = '/customers'

export const columnsTable = [
    { 
        name: 'Nombre', 
        property: 'name',
        sort: true
      },
      { 
        name: 'Dirección', 
        property: 'address',
        sort: true 
      },
      {
        name: 'Acciones',
        property: 'actions',
        sort: false
      }
]

export interface Customer {
    id: number;
    name: string;
    address: string;
    type: string;
}