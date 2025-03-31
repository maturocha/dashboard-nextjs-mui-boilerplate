/**
 * Tipos relacionados con pedidos y órdenes
 */

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled' | string;
export type PaymentMethod = 'ef' | 'trans' | 'mp' | string;

/**
 * Representa un ítem dentro de un pedido
 */
export interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  price: number | string;
  subtotal: number | string;
  discount?: number;
  price_unit?: number;
  price_final?: number;
  type_product?: string;
  weight?: number;
}

/**
 * Representa un pedido completo
 */
export interface Order {
  id: string;
  id_customer?: string;
  customer?: string;
  customer_id?: string;
  customer_name?: string;
  customer_type: 'p' | 'm'; // p: particular, m: mayorista
  total_bruto: number;
  total: number;
  delivery_cost: number;
  discount: number;
  status: OrderStatus;
  payment_method: PaymentMethod;
  notes?: string;
  items?: OrderItem[];
  details?: any[];
  date: string;
  created_at: string;
  updated_at: string;
  print_status?: number; // Estado numérico usado por el backend
  delivered_status?: number; // Estado de entrega usado por el backend
}

/**
 * Etiquetas para los métodos de pago
 */
export const paymentMethodLabels: Record<string, string> = {
  ef: 'Efectivo',
  trans: 'Transferencia',
  mp: 'Mercado Pago'
};

/**
 * Etiquetas para los estados de pedido
 */
export const statusLabels: Record<OrderStatus, string> = {
  pending: 'Pendiente',
  processing: 'En proceso',
  completed: 'Completado',
  cancelled: 'Cancelado'
};

/**
 * Colores para los estados de pedido
 */
export const statusColors: Record<OrderStatus, 'warning' | 'info' | 'success' | 'error'> = {
  pending: 'warning',
  processing: 'info',
  completed: 'success',
  cancelled: 'error'
};

/**
 * Interfaz para la respuesta paginada de la API
 */
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  from: number;
  to: number;
}

/**
 * Parámetros de consulta para filtrar pedidos
 */
export interface OrderQueryParams {
  page?: number | undefined | string;
  perPage?: number | string;
  sortBy?: string;
  sortType?: 'asc' | 'desc' | string;
  search?: string;
  status?: string;
  payment_method?: string;
  customer_type?: string;
  [key: string]: any;
} 