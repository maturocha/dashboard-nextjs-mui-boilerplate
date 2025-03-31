/**
 * Tipos relacionados con productos
 */

/**
 * Estructura de categoría de producto
 */
export interface Category {
  id: string;
  name: string;
  description?: string;
}

/**
 * Estructura de producto
 */
export interface Product {
  id: string;
  name: string;
  description?: string;
  price?: number | string;
  price_min?: number;
  price_unit?: number;
  stock: number;
  category_id?: string;
  category_name?: string;
  image_url?: string;
  sku?: string;
  code_miyi?: string;
  bulto?: number;
  interval_quantity?: string;
  type_product?: string;
  own_product?: number;
  created_at: string;
  updated_at: string;
}

/**
 * Respuesta paginada de productos
 */
export interface PaginatedProductsResponse {
  data: Product[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

/**
 * Parámetros de consulta para filtrar productos
 */
export interface ProductQueryParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortType?: 'asc' | 'desc';
  search?: string;
  category_id?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  [key: string]: any;
} 