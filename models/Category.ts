export const api = '/categories'

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