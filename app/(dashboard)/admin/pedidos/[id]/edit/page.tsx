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
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  InputAdornment
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import PageContainer from '@/components/container/PageContainer';
import OrderService from '@/utils/api/services/orderService';
import { Order, statusLabels, paymentMethodLabels } from '@/types/orders';
import { SelectChangeEvent } from '@mui/material';

export default function EditOrderPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Order>>({
    customer_name: '',
    customer_type: 'p',
    total_bruto: 0,
    total: 0,
    delivery_cost: 0,
    discount: 0,
    status: 'pending',
    payment_method: 'ef',
    notes: '',
    items: [],
    details: []
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Cargar datos del pedido
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await OrderService.get(id);
        console.log('Datos recibidos del pedido:', response);
        
        // Extraer los datos del pedido (puede venir directamente o dentro de data)
        const orderData = response && (response as any).data ? (response as any).data : response;
        
        // Mapear campos para asegurarnos de que existen
        const formattedOrder = {
          ...orderData,
          customer_name: orderData.customer_name || orderData.customer || '',
          customer_id: orderData.customer_id || orderData.id_customer || '',
          customer_type: orderData.customer_type || 'p',
          payment_method: orderData.payment_method || '',
          status: orderData.status || 'pending',
          // Asegurarse de que solo usamos una fuente de datos para los items
          items: orderData.details || orderData.items || [],
          delivered_status: orderData.delivered_status || 0,
          print_status: orderData.print_status || 0,
        };
        
        console.log('Datos formateados del pedido:', formattedOrder);
        setFormData(formattedOrder);
      } catch (err) {
        console.error('Error al cargar el pedido:', err);
        setError('Error al cargar los datos del pedido. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Para campos numéricos
    if (['total_bruto', 'total', 'delivery_cost', 'discount'].includes(name)) {
      const numValue = parseFloat(value) || 0;
      setFormData({
        ...formData,
        [name]: numValue,
      });
      
      // Si es total_bruto o delivery_cost, actualizar el total
      if (name === 'total_bruto' || name === 'delivery_cost') {
        const newTotalBruto = name === 'total_bruto' ? numValue : formData.total_bruto || 0;
        const newDeliveryCost = name === 'delivery_cost' ? numValue : formData.delivery_cost || 0;
        const discount = formData.discount || 0;
        const discountAmount = (discount / 100) * newTotalBruto;
        
        setFormData(prev => ({
          ...prev,
          [name]: numValue,
          total: newTotalBruto + newDeliveryCost - discountAmount,
        }));
      }
      
      // Si es discount, recalcular el total
      if (name === 'discount') {
        const totalBruto = formData.total_bruto || 0;
        const deliveryCost = formData.delivery_cost || 0;
        const discountAmount = (numValue / 100) * totalBruto;
        
        setFormData(prev => ({
          ...prev,
          discount: numValue,
          total: totalBruto + deliveryCost - discountAmount,
        }));
      }
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
  
  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    
    // Obtener el valor actual de print_status
    let print_status = formData.print_status || 0;
    
    // Si el campo que cambió es status, actualizar también print_status
    if (name === 'status') {
      // Mapear entre status y print_status (asumiendo que print_status es numérico)
      switch (value) {
        case 'pending':
          print_status = 0;
          break;
        case 'processing':
          print_status = 1;
          break;
        case 'completed':
          print_status = 2;
          break;
        case 'cancelled':
          print_status = 3;
          break;
        default:
          print_status = 0;
      }
      console.log(`Cambiando status a ${value} y print_status a ${print_status}`);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        print_status
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Limpiar error del campo
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };
  
  // Manejar cambios en los productos
  const handleItemChange = (index: number, field: string, value: any) => {
    const items = [...(formData.items || [])];
    items[index] = {
      ...items[index],
      [field]: value
    };
    
    // Recalcular el subtotal del ítem
    if (field === 'quantity' || field === 'price' || field === 'price_unit') {
      // Asegurar que la cantidad sea un número entero
      const quantity = field === 'quantity' 
        ? (typeof value === 'string' ? parseInt(value, 10) : Number(value)) 
        : (typeof items[index].quantity === 'string' 
            ? parseInt(items[index].quantity, 10) 
            : Number(items[index].quantity || 0));
      
      // Asegurar que el precio sea un número flotante
      const price = field === 'price' || field === 'price_unit' 
        ? (typeof value === 'string' ? parseFloat(value) : Number(value)) 
        : (typeof items[index].price === 'string' 
            ? parseFloat(items[index].price) 
            : Number(items[index].price || items[index].price_unit || 0));
      
      // Recalcular subtotal con valores numéricos
      const subtotalValue = quantity * price;
      
      // Actualizar todos los campos numéricos relacionados
      items[index].quantity = quantity;
      items[index].price = price;
      items[index].price_unit = price;
      items[index].subtotal = subtotalValue;
      items[index].price_final = subtotalValue;
    }
    
    // Recalcular el total del pedido
    const subtotal = items.reduce((sum, item) => {
      const itemSubtotal = typeof item.subtotal === 'string' 
        ? parseFloat(item.subtotal) 
        : (item.subtotal || item.price_final || 0);
      return sum + Number(itemSubtotal);
    }, 0);
    
    const deliveryCost = typeof formData.delivery_cost === 'string'
      ? parseFloat(formData.delivery_cost)
      : Number(formData.delivery_cost || 0);
      
    const discount = typeof formData.discount === 'string'
      ? parseFloat(formData.discount)
      : Number(formData.discount || 0);
      
    const discountAmount = (discount / 100) * subtotal;
    
    setFormData(prev => ({
      ...prev,
      items,
      total_bruto: subtotal,
      total: subtotal + deliveryCost - discountAmount
    }));
  };
  
  const handleRemoveItem = (index: number) => {
    const items = [...(formData.items || [])];
    items.splice(index, 1);
    
    // Recalcular el total del pedido usando el mismo enfoque que handleItemChange
    const subtotal = items.reduce((sum, item) => {
      const itemSubtotal = typeof item.subtotal === 'string' 
        ? parseFloat(item.subtotal) 
        : (item.subtotal || item.price_final || 0);
      return sum + Number(itemSubtotal);
    }, 0);
    
    const deliveryCost = typeof formData.delivery_cost === 'string'
      ? parseFloat(formData.delivery_cost)
      : Number(formData.delivery_cost || 0);
      
    const discount = typeof formData.discount === 'string'
      ? parseFloat(formData.discount)
      : Number(formData.discount || 0);
      
    const discountAmount = (discount / 100) * subtotal;
    
    setFormData(prev => ({
      ...prev,
      items,
      total_bruto: subtotal,
      total: subtotal + deliveryCost - discountAmount
    }));
  };
  
  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.customer_name) {
      errors.customer_name = 'El nombre del cliente es requerido';
    }
    
    if (formData.delivery_cost === undefined || formData.delivery_cost < 0) {
      errors.delivery_cost = 'El costo de envío no puede ser negativo';
    }
    
    if (formData.discount === undefined || formData.discount < 0 || formData.discount > 100) {
      errors.discount = 'El descuento debe estar entre 0 y 100';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setSaving(true);
    setError(null);
    
    try {
      // Para debug - Mostrar los datos del pedido antes de la actualización
      console.log('Datos del pedido ANTES del envío:', {
        formData,
        status: formData.status,
        payment_method: formData.payment_method
      });
      
      // Asegurarse de que todos los valores numéricos sean realmente números
      const totalBruto = typeof formData.total_bruto === 'string' 
        ? parseFloat(formData.total_bruto) 
        : Number(formData.total_bruto || 0);
        
      const total = typeof formData.total === 'string'
        ? parseFloat(formData.total)
        : Number(formData.total || 0);
        
      const deliveryCost = typeof formData.delivery_cost === 'string'
        ? parseFloat(formData.delivery_cost)
        : Number(formData.delivery_cost || 0);
        
      const discount = typeof formData.discount === 'string'
        ? parseFloat(formData.discount)
        : Number(formData.discount || 0);
      
      // Preparar los detalles del pedido con el formato esperado
      const formattedItems = (formData.items || []).map(item => {
        const quantity = typeof item.quantity === 'string' 
          ? parseInt(item.quantity, 10) 
          : Number(item.quantity || 0);
          
        const price = typeof item.price === 'string' 
          ? parseFloat(item.price) 
          : Number(item.price || item.price_unit || 0);
          
        const subtotal = quantity * price;
        
        return {
          id: item.id, // Mantener el ID original para actualización
          id_product: item.product_id || item.id_product || null,
          name: item.product_name || item.name || '',
          quantity: quantity,
          discount: 0,
          price_unit: price,
          price_final: subtotal,
          type_product: 'u'
        };
      }).filter(item => item.id_product !== null);
      
      const currentDate = new Date().toISOString();
      
      // Preparar los datos actualizados del pedido
      const updatedOrderData = {
        ...formData,
        total_bruto: Number(formData.total_bruto || 0),
        total: Number(formData.total || 0),
        delivery_cost: Number(formData.delivery_cost || 0),
        discount: Number(formData.discount || 0),
        payment_method: formData.payment_method || '',
        status: formData.status || 'pending',
        details: formattedItems,
        // Eliminar completamente el campo items para evitar duplicación
        updated_at: currentDate,
        // Asegurar que se envían los campos críticos
        id_customer: formData.customer_id || formData.id_customer,
        customer: formData.customer_name || formData.customer,
        delivered_status: formData.delivered_status || 0,
        print_status: formData.status === 'pending' ? 0 : 
                      formData.status === 'processing' ? 1 : 
                      formData.status === 'completed' ? 2 :
                      formData.status === 'cancelled' ? 3 : 0
      };
      
      // Eliminar explícitamente campos problemáticos
      delete updatedOrderData.items;
      
      // Mostrar los datos que se enviarán
      console.log('Estado y print_status que se enviarán:',
        { status: formData.status, print_status: formData.print_status });
      console.log('Datos que se enviarán para actualizar el pedido:', updatedOrderData);
      
      const response = await OrderService.update(id, updatedOrderData);
      console.log('Respuesta de la actualización:', response);
      setSuccess(true);
      
      // Redireccionar después de 2 segundos
      setTimeout(() => {
        router.push('/admin/pedidos');
      }, 2000);
    } catch (err) {
      console.error('Error al actualizar el pedido:', err);
      setError('Error al actualizar el pedido. Por favor, intente nuevamente.');
    } finally {
      setSaving(false);
    }
  };
  
  const handleGoBack = () => {
    router.back();
  };
  
  // Formatear número como moneda
  const formatCurrency = (value: any) => {
    // Si es undefined o null, devuelve $0.00
    if (value === undefined || value === null) {
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
  
  if (loading) {
    return (
      <PageContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
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
          Editar Pedido #{id}
        </Typography>
      </Box>
      
      <Snackbar 
        open={success} 
        autoHideDuration={6000} 
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Pedido actualizado exitosamente.
        </Alert>
      </Snackbar>
      
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      
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
            <Grid item xs={12}>
              <Typography variant="h5">Información del Cliente</Typography>
            </Grid>
            
            <Grid item xs={12} md={8}>
              <TextField
                label="Nombre del Cliente"
                variant="outlined"
                fullWidth
                name="customer_name"
                value={formData.customer_name || ''}
                onChange={handleInputChange}
                error={!!formErrors.customer_name}
                helperText={formErrors.customer_name}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="customer-type-label">Tipo de Cliente</InputLabel>
                <Select
                  labelId="customer-type-label"
                  id="customer-type"
                  name="customer_type"
                  value={formData.customer_type || 'p'}
                  onChange={handleSelectChange}
                  label="Tipo de Cliente"
                >
                  <MenuItem value="p">Particular</MenuItem>
                  <MenuItem value="m">Mayorista</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ mt: 2 }}>Productos</Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TableContainer>
                <Table aria-label="tabla de productos">
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell align="center">Cantidad</TableCell>
                      <TableCell align="right">Precio Unitario</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                      <TableCell align="center">Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(formData.items || []).map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <TextField
                            fullWidth
                            variant="outlined"
                            size="small"
                            value={item.name || item.product_name || ''}
                            onChange={(e) => handleItemChange(index, item.name ? 'name' : 'product_name', e.target.value)}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            variant="outlined"
                            type="number"
                            size="small"
                            value={item.quantity || 0}
                            onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                            inputProps={{ min: 1 }}
                            sx={{ width: '80px' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <TextField
                            variant="outlined"
                            type="number"
                            size="small"
                            value={item.price || item.price_unit || 0}
                            InputProps={{
                              startAdornment: <InputAdornment position="start">$</InputAdornment>,
                              readOnly: true,
                            }}
                            sx={{ width: '120px' }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.subtotal || item.price_final || 0)}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton 
                            aria-label="eliminar" 
                            color="error"
                            onClick={() => handleRemoveItem(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(formData.items || []).length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} align="center">
                          <Typography variant="body2" color="text.secondary">
                            No hay productos en este pedido
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ mt: 2 }}>Datos del Pedido</Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Subtotal"
                variant="outlined"
                fullWidth
                type="number"
                name="total_bruto"
                value={formData.total_bruto || 0}
                onChange={handleInputChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                disabled={true}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Costo de Envío"
                variant="outlined"
                fullWidth
                type="number"
                name="delivery_cost"
                value={formData.delivery_cost || 0}
                onChange={handleInputChange}
                error={!!formErrors.delivery_cost}
                helperText={formErrors.delivery_cost}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Descuento (%)"
                variant="outlined"
                fullWidth
                type="number"
                name="discount"
                value={formData.discount || 0}
                onChange={handleInputChange}
                error={!!formErrors.discount}
                helperText={formErrors.discount}
                inputProps={{ min: 0, max: 100 }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                label="Total"
                variant="outlined"
                fullWidth
                type="number"
                name="total"
                value={formData.total || 0}
                disabled
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="status-label">Estado</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={formData.status || 'pending'}
                  onChange={handleSelectChange}
                  label="Estado"
                  onClick={() => console.log('Estado actual:', formData.status)}
                >
                  {Object.entries(statusLabels).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <FormControl fullWidth variant="outlined">
                <InputLabel id="payment-method-label">Método de Pago</InputLabel>
                <Select
                  labelId="payment-method-label"
                  id="payment-method"
                  name="payment_method"
                  value={formData.payment_method || 'ef'}
                  onChange={handleSelectChange}
                  label="Método de Pago"
                >
                  {Object.entries(paymentMethodLabels)
                    .map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                label="Notas"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                name="notes"
                value={formData.notes || ''}
                onChange={handleInputChange}
              />
            </Grid>
            
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
                  disabled={saving}
                >
                  {saving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </PageContainer>
  );
} 