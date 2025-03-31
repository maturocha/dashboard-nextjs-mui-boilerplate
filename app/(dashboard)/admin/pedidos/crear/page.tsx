'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  IconButton,
  Divider,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageContainer from '@/components/container/PageContainer';
import OrderService from '@/utils/api/services/orderService';
import { statusLabels, paymentMethodLabels, OrderItem, OrderStatus, PaymentMethod } from '@/types/orders';
import ClientSelector from '../_components/ClientSelector';
import ProductSelector from '../_components/ProductSelector';
import OrderItemList from '../_components/OrderItemList';
import { Client } from '@/types/clients';
import { Product } from '@/types/products';

/**
 * Página de creación de un nuevo pedido
 * Permite seleccionar cliente, añadir productos, establecer costos y guardar el pedido
 */
export default function CreateOrderPage() {
  const router = useRouter();
  
  // Estados para el manejo de carga, errores y éxito
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Estado para el cliente seleccionado
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Estado para el producto seleccionado temporalmente
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Estado para los items del pedido
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  
  // Estado para el formulario principal
  const [formData, setFormData] = useState({
    delivery_cost: 0,
    discount: 0,
    status: 'pending' as OrderStatus,
    payment_method: 'ef' as PaymentMethod,
    notes: '',
  });
  
  // Estado para errores de validación
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Calcular totales basados en los items
  const subtotal = orderItems.reduce((sum, item) => {
    // Asegurarse de que precio y cantidad sean números
    const price = typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0);
    const quantity = typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : (item.quantity || 0);
    
    // Calcular el subtotal directamente multiplicando precio por cantidad
    const itemSubtotal = price * quantity;
    
    return sum + itemSubtotal;
  }, 0);
  
  const discountAmount = (formData.discount / 100) * subtotal;
  const total = subtotal + formData.delivery_cost - discountAmount;
  
  // Format currency - Formatear de manera consistente con las otras páginas
  const formatCurrency = (value: any) => {
    // Si es undefined o null, devuelve $0.00
    if (value === undefined || value === null || value === '') {
      return '$0.00';
    }
    
    // Convertir a número si es una cadena
    let numValue = 0;
    if (typeof value === 'string') {
      // Si es string, intentar extraer un número
      const matches = value.match(/[0-9]+(\.[0-9]+)?/);
      if (matches) {
        numValue = parseFloat(matches[0]);
      } else {
        numValue = 0;
      }
    } else {
      numValue = Number(value);
    }
    
    // Verificar si es un número válido
    if (isNaN(numValue)) {
      return '$0.00';
    }
    
    // Formatear como moneda
    return `$${numValue.toFixed(2)}`;
  };
  
  /**
   * Efecto para añadir un producto a la lista cuando se selecciona
   * Si el producto ya existe, aumenta la cantidad
   */
  useEffect(() => {
    if (selectedProduct) {
      // Verificar si el producto ya está en la lista
      const existingIndex = orderItems.findIndex(item => item.product_id === selectedProduct.id);
      
      // Determinar qué precio usar basado en el tipo de cliente
      const clientType = selectedClient?.type || 'p'; // 'p' para particular, 'm' para mayorista
      
      // Extraer el precio correcto y asegurarnos de que sea un número
      let productPrice = 0;
      if (clientType === 'm' && selectedProduct.price_unit) {
        productPrice = Number(selectedProduct.price_unit);
      } else if (selectedProduct.price_min) {
        productPrice = Number(selectedProduct.price_min);
      } else if (selectedProduct.price) {
        productPrice = typeof selectedProduct.price === 'string' 
          ? parseFloat(selectedProduct.price)
          : selectedProduct.price;
      }
      
      if (existingIndex >= 0) {
        // Si ya existe, aumentar la cantidad
        const updatedItems = [...orderItems];
        const item = updatedItems[existingIndex];
        const newQuantity = (typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : (item.quantity || 0)) + 1;
        
        // Convertir precio a número si es una cadena
        const itemPrice = typeof item.price === 'string'
          ? parseFloat(item.price)
          : (item.price || 0);
        
        // Calcular el subtotal como precio * cantidad
        const subtotalValue = itemPrice * newQuantity;
        
        updatedItems[existingIndex] = {
          ...item,
          quantity: newQuantity,
          subtotal: subtotalValue
        };
        
        setOrderItems(updatedItems);
      } else {
        // Agregar nuevo producto con valores numéricos garantizados
        const newItem: OrderItem = {
          product_id: selectedProduct.id,
          product_name: selectedProduct.name,
          quantity: 1,
          price: productPrice,
          subtotal: productPrice * 1 // Explícitamente calcular el subtotal
        };
        
        setOrderItems([...orderItems, newItem]);
      }
      
      // Limpiar el producto seleccionado
      setSelectedProduct(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProduct, selectedClient]);
  
  /**
   * Maneja los cambios en los campos de texto del formulario
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Para campos numéricos
    if (['delivery_cost', 'discount'].includes(name)) {
      const numValue = parseFloat(value) || 0;
      setFormData({
        ...formData,
        [name]: numValue,
      });
    } else {
      // Para campos de texto
      setFormData({
        ...formData,
        [name]: value,
      });
    }
    
    // Limpiar error del campo
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };
  
  /**
   * Maneja los cambios en los campos de selección
   */
  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Limpiar error del campo
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };
  
  /**
   * Manejadores para actualizar y eliminar items del pedido
   */
  const handleUpdateOrderItem = (index: number, updatedItem: OrderItem) => {
    const newItems = [...orderItems];
    newItems[index] = updatedItem;
    setOrderItems(newItems);
  };
  
  const handleRemoveOrderItem = (index: number) => {
    const newItems = [...orderItems];
    newItems.splice(index, 1);
    setOrderItems(newItems);
  };
  
  /**
   * Valida el formulario antes de enviarlo
   * @returns {boolean} true si el formulario es válido
   */
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!selectedClient) {
      errors.customer = 'Debe seleccionar un cliente';
    }
    
    if (orderItems.length === 0) {
      errors.items = 'Debe agregar al menos un producto';
    }
    
    if (formData.delivery_cost < 0) {
      errors.delivery_cost = 'El costo de envío no puede ser negativo';
    }
    
    if (formData.discount < 0 || formData.discount > 100) {
      errors.discount = 'El descuento debe estar entre 0 y 100';
    }
    
    if (!formData.status) {
      errors.status = 'Debe seleccionar un estado para el pedido';
    }
    
    if (!formData.payment_method) {
      errors.payment_method = 'Debe seleccionar un método de pago';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  /**
   * Maneja el envío del formulario para crear un pedido
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const currentDate = new Date().toISOString();
      
      // Preparar los items con el formato esperado por el backend
      const formattedItems = orderItems.map(item => {
        // Asegurar que los valores numéricos sean números y no strings
        const quantity = typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : (item.quantity || 0);
        const price = typeof item.price === 'string' ? parseFloat(item.price) : (item.price || 0);
        const subtotal = quantity * price;
        
        return {
          id_product: item.product_id,
          name: item.product_name,
          quantity: quantity,
          discount: 0, // Valor por defecto
          price_unit: price,
          price_final: subtotal,
          type_product: 'u' // Valor por defecto
        };
      });
      
      // Asegurar que todos los valores numéricos sean realmente números
      const numericSubtotal = parseFloat(subtotal.toString());
      const numericTotal = parseFloat(total.toString());
      const numericDeliveryCost = parseFloat(formData.delivery_cost.toString());
      const numericDiscount = parseFloat(formData.discount.toString());
      
      const orderData = {
        id_customer: selectedClient?.id, 
        customer: selectedClient?.name,
        customer_type: selectedClient?.type,
        total_bruto: numericSubtotal,
        total: numericTotal,
        details: formattedItems,
        delivery_cost: numericDeliveryCost,
        discount: numericDiscount,
        status: formData.status,
        payment_method: formData.payment_method,
        notes: formData.notes,
        date: currentDate.split('T')[0],
        reference_code: null,
        id_user: 1, // Valor por defecto si no hay sistema de usuarios
        afip: null,
        created_at: currentDate,
        updated_at: currentDate,
        delivered_status: 0,
        print_status: 0
      };
      
      // Agregar log para verificar los valores antes de enviar
      console.log('Valores críticos antes de enviar:');
      console.log(`- payment_method: "${formData.payment_method}"`);
      console.log(`- status: "${formData.status}"`);
      console.log(`- print_status: ${orderData.print_status}`);
      
      console.log('Enviando datos de pedido al backend:', JSON.stringify(orderData, null, 2));
      const createdOrder = await OrderService.create(orderData);
      console.log('Respuesta del backend (createdOrder):', JSON.stringify(createdOrder, null, 2));
      
      // Intentar obtener el pedido recién creado para verificar qué datos se guardaron
      if (createdOrder && createdOrder.id) {
        try {
          console.log(`Obteniendo el pedido recién creado con ID: ${createdOrder.id}`);
          const fetchedOrder = await OrderService.get(createdOrder.id.toString());
          console.log('Pedido obtenido después de crear:', JSON.stringify(fetchedOrder, null, 2));
          
          // Comparar datos enviados vs recibidos
          console.log('Diferencias entre datos enviados y recibidos:');
          Object.keys(orderData).forEach(key => {
            if (key !== 'details' && key in fetchedOrder) {
              console.log(`Campo ${key}: Enviado=${(orderData as any)[key]}, Recibido=${(fetchedOrder as any)[key]}`);
            }
          });
        } catch (fetchError) {
          console.error('Error al obtener el pedido recién creado:', fetchError);
        }
      }
      
      setSuccess(true);
      
      // Redireccionar después de 2 segundos
      setTimeout(() => {
        router.push('/admin/pedidos');
      }, 2000);
    } catch (err: any) {
      console.error('Error al crear el pedido:', err);
      const errorMessage = err.message || 'Error al crear el pedido. Por favor, intente nuevamente.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  return (
    <PageContainer>
      {/* Cabecera */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
        <IconButton
          color="primary"
          aria-label="volver"
          onClick={handleGoBack}
          sx={{ mr: 1 }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h3" fontWeight="medium">
          Crear Nuevo Pedido
        </Typography>
      </Box>
      
      {/* Notificación de éxito */}
      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Pedido creado exitosamente.
        </Alert>
      </Snackbar>
      
      {/* Mostrar errores si hay */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
      {/* Formulario principal */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          border: theme => `1px solid ${theme.palette.divider}`,
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Sección de Cliente */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Información del Cliente
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <ClientSelector 
                value={selectedClient}
                onChange={setSelectedClient}
                error={!!formErrors.customer}
                helperText={formErrors.customer}
              />
            </Grid>
            
            {/* Sección de Productos */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Productos
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <ProductSelector 
                value={selectedProduct}
                onChange={setSelectedProduct}
              />
              {formErrors.items && (
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                  {formErrors.items}
                </Typography>
              )}
            </Grid>
            
            <Grid item xs={12}>
              <OrderItemList 
                items={orderItems}
                onUpdateItem={handleUpdateOrderItem}
                onRemoveItem={handleRemoveOrderItem}
              />
            </Grid>
            
            {/* Sección de Costos y Detalles */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Costos y Detalles
              </Typography>
              <Divider sx={{ mb: 2 }} />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Subtotal"
                type="text"
                value={formatCurrency(subtotal)}
                fullWidth
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Costo de Envío"
                name="delivery_cost"
                type="number"
                value={formData.delivery_cost}
                onChange={handleInputChange}
                fullWidth
                InputProps={{ inputProps: { min: 0, step: "0.01" } }}
                error={!!formErrors.delivery_cost}
                helperText={formErrors.delivery_cost}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Descuento (%)"
                name="discount"
                type="number"
                value={formData.discount}
                onChange={handleInputChange}
                fullWidth
                InputProps={{ inputProps: { min: 0, max: 100, step: "0.1" } }}
                error={!!formErrors.discount}
                helperText={formErrors.discount}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Total"
                type="text"
                value={formatCurrency(total)}
                fullWidth
                disabled
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Estado</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  label="Estado"
                  error={!!formErrors.status}
                  required
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.status && (
                  <Typography variant="caption" color="error">
                    {formErrors.status}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Método de Pago</InputLabel>
                <Select
                  name="payment_method"
                  value={formData.payment_method}
                  onChange={handleSelectChange}
                  label="Método de Pago"
                  error={!!formErrors.payment_method}
                  required
                >
                  {Object.entries(paymentMethodLabels).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.payment_method && (
                  <Typography variant="caption" color="error">
                    {formErrors.payment_method}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Notas"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={4}
              />
            </Grid>
            
            {/* Botones de acción */}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleGoBack}
                >
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : 'Guardar Pedido'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </PageContainer>
  );
} 