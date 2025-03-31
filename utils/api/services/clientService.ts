import { apiWrapper } from '../apiWrapper';
import { Client, ClientQueryParams, PaginatedClientsResponse } from '@/types/clients';

/**
 * Servicio para la gestión de clientes
 */
const ClientService = {
  /**
   * Obtiene un listado paginado de clientes
   * @param params Parámetros de filtrado y paginación
   * @returns Respuesta paginada con los clientes
   */
  async paginated(params: ClientQueryParams = {}): Promise<PaginatedClientsResponse> {
    return await apiWrapper.get('/customers', params);
  },
  
  /**
   * Obtiene todos los clientes con paginación (compatible con el componente ClientSelector)
   * @param params Parámetros de consulta
   * @returns Respuesta paginada con los clientes
   */
  async getAll(params: any = {}): Promise<PaginatedClientsResponse> {
    return await apiWrapper.get('/customers', params);
  },
  
  /**
   * Obtiene un cliente por su ID
   * @param id ID del cliente
   * @returns Datos del cliente
   */
  async get(id: string): Promise<Client> {
    return await apiWrapper.get(`/customers/${id}`);
  },
  
  /**
   * Crea un nuevo cliente
   * @param data Datos del cliente a crear
   * @returns Cliente creado
   */
  async create(data: Partial<Client>): Promise<Client> {
    return await apiWrapper.post('/customers', data);
  },
  
  /**
   * Actualiza un cliente existente
   * @param id ID del cliente a actualizar
   * @param data Datos a actualizar
   * @returns Cliente actualizado
   */
  async update(id: string, data: Partial<Client>): Promise<Client> {
    return await apiWrapper.put('/customers', data, {}, {}, id);
  },
  
  /**
   * Elimina un cliente
   * @param id ID del cliente a eliminar
   */
  async delete(id: string): Promise<void> {
    return await apiWrapper.delete('/customers', {}, {}, id);
  }
};

export default ClientService; 