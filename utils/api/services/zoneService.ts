import { apiWrapper } from '../apiWrapper';

/**
 * Interfaz para una zona
 */
export interface Zone {
  id: string;
  name: string;
  description?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

/**
 * Servicio para la gestión de zonas
 */
const ZoneService = {
  /**
   * Obtiene un listado de todas las zonas
   * @param params Parámetros de filtrado y paginación
   * @returns Lista de zonas
   */
  async getAll(params = {}): Promise<Zone[]> {
    try {
      const response = await apiWrapper.get('/zones', {
        perPage: 1000,
        ...params
      });
      
      if (response && Array.isArray(response.data)) {
        return response.data;
      } else if (Array.isArray(response)) {
        return response;
      }
      
      return [];
    } catch (error) {
      console.error('Error en ZoneService.getAll:', error);
      return [];
    }
  }
};

export default ZoneService; 