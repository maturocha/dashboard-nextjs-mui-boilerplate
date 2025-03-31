import { apiWrapper } from '../apiWrapper';
import { Product, ProductQueryParams, PaginatedProductsResponse } from '@/types/products';

/**
 * Servicio para la gestión de productos
 */
const ProductService = {
  /**
   * Obtiene un listado paginado de productos
   * @param params Parámetros de filtrado y paginación
   * @returns Respuesta paginada con los productos
   */
  async paginated(params: ProductQueryParams = {}): Promise<PaginatedProductsResponse> {
    return await apiWrapper.get('/products', params);
  },
  
  /**
   * Obtiene todos los productos con paginación (compatible con el componente ProductSelector)
   * @param params Parámetros de consulta
   * @returns Respuesta paginada con los productos
   */
  async getAll(params: any = {}): Promise<PaginatedProductsResponse> {
    return await apiWrapper.get('/products', params);
  },
  
  /**
   * Obtiene un producto por su ID
   * @param id ID del producto
   * @returns Datos del producto
   */
  async get(id: string): Promise<Product> {
    return await apiWrapper.get(`/products/${id}`);
  },
  
  /**
   * Crea un nuevo producto
   * @param data Datos del producto a crear
   * @returns Producto creado
   */
  async create(data: Partial<Product>): Promise<Product> {
    return await apiWrapper.post('/products', data);
  },
  
  /**
   * Actualiza un producto existente
   * @param id ID del producto a actualizar
   * @param data Datos a actualizar
   * @returns Producto actualizado
   */
  async update(id: string, data: Partial<Product>): Promise<Product> {
    return await apiWrapper.put('/products', data, {}, {}, id);
  },
  
  /**
   * Elimina un producto
   * @param id ID del producto a eliminar
   */
  async delete(id: string): Promise<void> {
    return await apiWrapper.delete('/products', {}, {}, id);
  }
};

export default ProductService; 