/**
 * Tipos relacionados con clientes
 */

/**
 * Tipo de cliente: particular o mayorista
 */
export type ClientType = 'p' | 'm';

/**
 * Estructura del cliente
 */
export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  type: ClientType;
  created_at: string;
  updated_at: string;
}

/**
 * Respuesta paginada de clientes
 */
export interface PaginatedClientsResponse {
  data: Client[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

/**
 * Parámetros de consulta para filtrar clientes
 */
export interface ClientQueryParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortType?: 'asc' | 'desc';
  search?: string;
  type?: ClientType;
  [key: string]: any;
} 