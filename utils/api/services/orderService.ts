import { apiWrapper } from '../apiWrapper';
import { Order, OrderQueryParams, PaginatedResponse } from '@/types/orders';

/**
 * Servicio para la gestión de pedidos
 */
const OrderService = {
  /**
   * Obtiene un listado paginado de pedidos
   * @param params Parámetros de filtrado y paginación
   * @returns Respuesta paginada con los pedidos
   */
  async paginated(params: OrderQueryParams = {}): Promise<PaginatedResponse<Order>> {
    console.log('OrderService.paginated - Enviando parámetros:', params);
    
    // Asegurarse de que los parámetros estén en el formato correcto para el backend antiguo
    const formattedParams = {
      page: params.page !== undefined ? params.page : '',
      perPage: params.perPage !== undefined ? params.perPage : '',
      sortBy: params.sortBy || '',
      sortType: params.sortType || '',
      search: params.search || '',
      status: params.status || '',
      payment_method: params.payment_method || '',
      customer_type: params.customer_type || '',
      ...params
    };
    
    try {
      // Intentar primero con el endpoint /orders
      const response = await apiWrapper.get('/orders', formattedParams);
      console.log('OrderService.paginated - Respuesta de /orders:', response);
      
      // Si no hay datos, intentar con endpoints alternativos
      if ((!response.data || response.data.length === 0) && formattedParams.page === '') {
        // Array de endpoints alternativos a probar
        const alternativeEndpoints = [
          '/orders/all',
          '/orders/index',
          '/orders/list'
        ];
        
        // Intentar cada endpoint hasta encontrar datos
        for (const endpoint of alternativeEndpoints) {
          try {
            console.log(`Intentando con endpoint ${endpoint}`);
            const altResponse = await apiWrapper.get(endpoint, {
              page: '',
              perPage: '',
              sortBy: '',
              sortType: ''
            });
            console.log(`Respuesta de ${endpoint}:`, altResponse);
            
            // Si obtenemos datos, retornarlos en el formato esperado
            if (altResponse) {
              if (Array.isArray(altResponse)) {
                // Si es un array directo, adaptarlo al formato paginado
                return {
                  data: altResponse,
                  total: altResponse.length,
                  current_page: 1,
                  per_page: altResponse.length,
                  last_page: 1,
                  from: 1,
                  to: altResponse.length
                };
              } else if (altResponse.data && Array.isArray(altResponse.data) && altResponse.data.length > 0) {
                return altResponse;
              }
            }
          } catch (error) {
            console.log(`Error intentando con ${endpoint}:`, error);
            // Continuar con el siguiente endpoint
          }
        }
      }
      
      // Asegurarnos de que tenemos una estructura de datos uniforme para la respuesta original
      if (response && response.data) {
        // El endpoint puede devolver un array directo o dentro de data
        const responseData = Array.isArray(response.data) ? response.data : response.data;
        
        return {
          ...response,
          data: responseData,
          total: response.total || 0,
          current_page: response.current_page || 1,
          per_page: response.per_page || 10,
          last_page: response.last_page || 1,
          from: response.from || 0,
          to: response.to || 0
        };
      }
      
      return response;
    } catch (error) {
      console.error('Error en OrderService.paginated:', error);
      // Si todo falla, devolver una estructura vacía pero válida
      return {
        data: [],
        total: 0,
        current_page: 1,
        per_page: 10,
        last_page: 1,
        from: 0,
        to: 0
      };
    }
  },
  
  /**
   * Obtiene un pedido por su ID
   * @param id ID del pedido
   * @returns Datos del pedido
   */
  async get(id: string): Promise<Order> {
    console.log(`OrderService.get - Solicitando pedido con ID: ${id}`);
    try {
      const response = await apiWrapper.get(`/orders/${id}`);
      console.log(`OrderService.get - Respuesta completa:`, JSON.stringify(response, null, 2));
      
      // Si la respuesta viene dentro de un objeto 'data', extraer los datos
      if (response && response.data && typeof response.data === 'object' && !Array.isArray(response.data)) {
        console.log(`OrderService.get - La respuesta viene dentro de un objeto 'data', extrayendo...`);
        return response;
      }
      
      return response;
    } catch (error) {
      console.error(`OrderService.get - Error al obtener pedido ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Crea un nuevo pedido
   * @param data Datos del pedido a crear
   * @returns Pedido creado
   */
  async create(data: Partial<Order>): Promise<Order> {
    console.log('OrderService.create - Datos originales:', JSON.stringify(data, null, 2));
    
    // Verificar el estado y payment_method recibidos
    console.log(`OrderService.create - Estado recibido: "${data.status}", print_status recibido: ${data.print_status}, payment_method recibido: "${data.payment_method}"`);
    
    // Asegurarse que todos los valores numéricos sean números
    const transformedData = {
      ...data,
      total_bruto: Number(data.total_bruto || 0),
      total: Number(data.total || 0),
      delivery_cost: Number(data.delivery_cost || 0),
      discount: Number(data.discount || 0),
      // Usar directamente los valores proporcionados por el frontend si existen
      payment_method: data.payment_method || 'ef',
      print_status: data.print_status
    };
    
    // Guardar los detalles para usarlos después de crear el pedido
    const details = data.details?.map(item => ({
      ...item,
      quantity: Number(item.quantity || 0),
      price_unit: Number(item.price_unit || 0),
      price_final: Number(item.price_final || 0),
      discount: Number(item.discount || 0)
    })) || [];
    
    // Eliminar los detalles para la creación inicial del pedido
    delete transformedData.details;
    
    console.log('OrderService.create - Datos transformados (sin detalles):', JSON.stringify(transformedData, null, 2));
    
    try {
      // 1. Crear el pedido principal sin detalles
      const response = await apiWrapper.post('/orders', transformedData);
      console.log('OrderService.create - Respuesta pedido creado:', JSON.stringify(response, null, 2));
      
      // 2. Si hay detalles y se creó correctamente el pedido, agregar los detalles uno por uno
      if (details.length > 0 && response && response.id) {
        console.log(`OrderService.create - Creando ${details.length} detalles para el pedido ${response.id}`);
        
        // Crear un array para almacenar los detalles creados
        const createdDetails = [];
        
        // Crear cada detalle de manera individual
        for (const item of details) {
          try {
            const detailData = {
              id_order: response.id,
              id_product: item.id_product,
              quantity: item.quantity,
              discount: item.discount || 0,
              price_unit: item.price_unit,
              price_final: item.price_final
            };
            
            console.log('OrderService.create - Creando detalle:', JSON.stringify(detailData, null, 2));
            const detailResponse = await apiWrapper.post('/details', detailData);
            console.log('OrderService.create - Detalle creado:', JSON.stringify(detailResponse, null, 2));
            
            createdDetails.push(detailResponse);
          } catch (detailError) {
            console.error('OrderService.create - Error al crear detalle:', detailError);
          }
        }
        
        // 3. Actualizar el pedido con los totales correctos
        try {
          const updateData = {
            total_bruto: Number(data.total_bruto || 0),
            total: Number(data.total || 0),
            discount: Number(data.discount || 0),
            delivery_cost: Number(data.delivery_cost || 0)
          };
          
          console.log(`OrderService.create - Actualizando pedido ${response.id} con totales:`, JSON.stringify(updateData, null, 2));
          await apiWrapper.put(`/orders/${response.id}`, updateData);
        } catch (updateError) {
          console.error('OrderService.create - Error al actualizar totales:', updateError);
        }
        
        // Incluir los detalles creados en la respuesta
        response.details = createdDetails;
      }
      
      return response;
    } catch (error) {
      console.error('OrderService.create - Error:', error);
      throw error;
    }
  },
  
  /**
   * Actualiza un pedido existente
   * @param id ID del pedido a actualizar
   * @param data Datos a actualizar
   * @returns Pedido actualizado
   */
  async update(id: string, data: Partial<Order>): Promise<Order> {
    console.log('OrderService.update - Datos originales:', JSON.stringify(data, null, 2));
    
    // Verificar el estado y payment_method recibidos
    console.log(`OrderService.update - Estado recibido: "${data.status}", print_status recibido: ${data.print_status}, payment_method recibido: "${data.payment_method}"`);
    
    // Determinar el print_status basado en el estado
    const calculatedPrintStatus = data.print_status !== undefined ? data.print_status : 
                 data.status === 'pending' ? 0 : 
                 data.status === 'processing' ? 1 : 
                 data.status === 'completed' ? 2 :
                 data.status === 'cancelled' ? 3 : 0;
    
    console.log(`OrderService.update - print_status calculado: ${calculatedPrintStatus}`);
    
    // Verificar el payment_method
    const paymentMethod = data.payment_method && data.payment_method.trim() !== '' ? data.payment_method : 'ef';
    console.log(`OrderService.update - payment_method calculado: "${paymentMethod}"`);
    
    // Asegurarse que todos los valores numéricos sean números
    const transformedData = {
      ...data,
      total_bruto: Number(data.total_bruto || 0),
      total: Number(data.total || 0),
      delivery_cost: Number(data.delivery_cost || 0),
      discount: Number(data.discount || 0),
      payment_method: paymentMethod,
      status: data.status || 'pending',
      print_status: calculatedPrintStatus
    };
    
    // Guardar los detalles para usarlos después de actualizar el pedido
    const details = data.details?.filter(item => item.id_product !== null && item.id_product !== undefined)
      .map(item => ({
        ...item,
        quantity: Number(item.quantity || 0),
        price_unit: Number(item.price_unit || 0),
        price_final: Number(item.price_final || 0),
        discount: Number(item.discount || 0)
      })) || [];
    
    // Eliminar los detalles para la actualización inicial del pedido
    delete transformedData.details;
    
    console.log('OrderService.update - Datos transformados (sin detalles):', JSON.stringify(transformedData, null, 2));
    
    try {
      // 1. Actualizar el pedido principal
      const response = await apiWrapper.put(`/orders/${id}`, transformedData);
      console.log('OrderService.update - Respuesta pedido actualizado:', JSON.stringify(response, null, 2));
      
      // 2. Si hay detalles y se actualizó correctamente el pedido, actualizar los detalles
      if (details.length > 0 && response) {
        console.log(`OrderService.update - Actualizando ${details.length} detalles para el pedido ${id}`);
        
        // Crear un array para almacenar los detalles actualizados/creados
        const updatedDetails = [];
        
        // Actualizar o crear cada detalle de manera individual
        for (const item of details) {
          try {
            // Si el detalle tiene ID, actualizar; si no, crear
            if (item.id) {
              const detailData = {
                id_order: id,
                id_product: item.id_product,
                quantity: item.quantity,
                discount: item.discount || 0,
                price_unit: item.price_unit,
                price_final: item.price_final
              };
              
              console.log(`OrderService.update - Actualizando detalle ${item.id}:`, JSON.stringify(detailData, null, 2));
              const detailResponse = await apiWrapper.put(`/details/${item.id}`, detailData);
              console.log('OrderService.update - Detalle actualizado:', JSON.stringify(detailResponse, null, 2));
              
              updatedDetails.push(detailResponse);
            } else {
              // Si no tiene ID, crear un nuevo detalle
              const detailData = {
                id_order: id,
                id_product: item.id_product,
                quantity: item.quantity,
                discount: item.discount || 0,
                price_unit: item.price_unit,
                price_final: item.price_final
              };
              
              // Verificar que id_product no sea null antes de intentar crear el detalle
              if (detailData.id_product) {
                console.log('OrderService.update - Creando nuevo detalle:', JSON.stringify(detailData, null, 2));
                try {
                  const detailResponse = await apiWrapper.post('/details', detailData);
                  console.log('OrderService.update - Detalle creado:', JSON.stringify(detailResponse, null, 2));
                  updatedDetails.push(detailResponse);
                } catch (detailError) {
                  console.error('OrderService.update - Error al crear detalle:', detailError);
                }
              } else {
                console.warn('OrderService.update - Omitiendo detalle sin id_product:', JSON.stringify(item, null, 2));
              }
            }
          } catch (detailError) {
            console.error('OrderService.update - Error al actualizar/crear detalle:', detailError);
          }
        }
        
        // Incluir los detalles actualizados en la respuesta
        response.details = updatedDetails;
      }
      
      return response;
    } catch (error) {
      console.error('OrderService.update - Error:', error);
      throw error;
    }
  },
  
  /**
   * Elimina un pedido
   * @param id ID del pedido a eliminar
   */
  async delete(id: string): Promise<void> {
    return await apiWrapper.delete(`/orders/${id}`);
  }
};

export default OrderService; 