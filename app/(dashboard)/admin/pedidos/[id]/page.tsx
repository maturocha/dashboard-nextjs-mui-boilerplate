'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  IconButton,
  CircularProgress,
  Divider,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import PageContainer from '@/components/container/PageContainer';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OrderService from '@/utils/api/services/orderService';
import { Order, statusLabels, paymentMethodLabels, statusColors } from '@/types/orders';

/**
 * Página de detalle de un pedido
 * Muestra la información completa de un pedido incluyendo datos del cliente, 
 * detalles del pedido y opciones para editar o eliminar
 */
export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { id } = params;
  
  // Estados para manejo de carga y errores
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para el manejo de eliminación
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
  /**
   * Carga los datos del pedido al inicializar el componente
   */
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await OrderService.get(id);
        console.log('Datos del pedido:', response);
        
        // Extraer los datos del pedido (puede venir directamente o dentro de data)
        const orderData = response && (response as any).data ? (response as any).data : response;
        
        setOrder(orderData);
      } catch (err) {
        console.error('Error al cargar el pedido:', err);
        setError('Error al cargar los datos del pedido. Por favor, intente nuevamente.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [id]);
  
  /**
   * Handlers para navegación y acciones
   */
  const handleGoBack = () => {
    router.back();
  };
  
  const handleEdit = () => {
    router.push(`/admin/pedidos/${id}/edit`);
  };
  
  const handleDeleteClick = () => {
    setDeleteConfirmOpen(true);
  };
  
  /**
   * Maneja la confirmación de eliminación de un pedido
   */
  const handleDeleteConfirm = async () => {
    setDeleting(true);
    
    try {
      await OrderService.delete(id);
      setDeleteConfirmOpen(false);
      setDeleteSuccess(true);
      
      // Redireccionar después de 2 segundos
      setTimeout(() => {
        router.push('/admin/pedidos');
      }, 2000);
    } catch (err) {
      console.error('Error al eliminar el pedido:', err);
      setError('Error al eliminar el pedido. Por favor, intente nuevamente.');
      setDeleteConfirmOpen(false);
    } finally {
      setDeleting(false);
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
  };
  
  /**
   * Funciones auxiliares para formateo
   */
  // Formatear número como moneda, asegurándose de que sea un número válido
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
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
  
  // Obtener la etiqueta correcta para el estado basado en print_status o status
  const getPrintStatusLabel = (order: any) => {
    // Si existe print_status, usarlo como prioridad
    if (order.print_status !== undefined) {
      switch (Number(order.print_status)) {
        case 0: return 'Pendiente';
        case 1: return 'En proceso';
        case 2: return 'Completado';
        case 3: return 'Cancelado';
        default: return order.status ? statusLabels[order.status] : 'Pendiente';
      }
    }
    
    // Si no hay print_status pero hay status, usar status
    return order.status ? statusLabels[order.status] : 'Pendiente';
  };
  
  // Obtener el color correcto para el estado basado en print_status o status
  const getPrintStatusColor = (order: any) => {
    // Si existe print_status, usarlo como prioridad
    if (order.print_status !== undefined) {
      switch (Number(order.print_status)) {
        case 0: return 'warning';
        case 1: return 'info';
        case 2: return 'success';
        case 3: return 'error';
        default: return order.status ? statusColors[order.status] : 'warning';
      }
    }
    
    // Si no hay print_status pero hay status, usar status
    return order.status ? statusColors[order.status] : 'warning';
  };
  
  // Mostrar un indicador de carga mientras se recuperan los datos
  if (loading) {
    return (
      <PageContainer>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }
  
  // Mostrar un mensaje de error si algo falló
  if (error || !order) {
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
            Detalle de Pedido
          </Typography>
        </Box>
        
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'No se encontró el pedido solicitado.'}
        </Alert>
        
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleGoBack}
        >
          Volver a Pedidos
        </Button>
      </PageContainer>
    );
  }
  
  // Calcular detalles de productos del pedido
  const orderItems = order.items || order.details || [];
  
  return (
    <PageContainer>
      {/* Cabecera con título y acciones */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="primary"
            aria-label="volver"
            onClick={handleGoBack}
            sx={{ mr: 1 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h3" fontWeight="medium">
            Pedido #{order.id}
          </Typography>
        </Box>
        
        <Box>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleEdit}
            sx={{ mr: 1 }}
          >
            Editar
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteClick}
          >
            Eliminar
          </Button>
        </Box>
      </Box>
      
      {/* Notificación de éxito */}
      <Snackbar 
        open={deleteSuccess} 
        autoHideDuration={6000} 
        onClose={() => setDeleteSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          Pedido eliminado exitosamente.
        </Alert>
      </Snackbar>
      
      {/* Tarjeta principal con detalles del pedido */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 2,
          border: theme => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Grid container spacing={2}>
          {/* Sección de información del cliente */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h5">Información del Cliente</Typography>
              {(order.status || order.print_status !== undefined) && (
                <Chip 
                  label={getPrintStatusLabel(order)}
                  color={getPrintStatusColor(order)}
                  sx={{ 
                    fontWeight: 'medium',
                    px: 1
                  }}
                />
              )}
            </Box>
            <Divider sx={{ mb: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Nombre del Cliente
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {order.customer_name || order.customer || 'Sin nombre'}
              {order.customer_type && (
                <Chip 
                  label={order.customer_type === 'p' ? 'Particular' : 'Mayorista'}
                  size="small"
                  variant="outlined"
                  sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary">
              Método de Pago
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {order.payment_method ? paymentMethodLabels[order.payment_method] : 'No definido'}
            </Typography>
          </Grid>
          
          {/* Sección de información del pedido */}
          <Grid item xs={12}>
            <Typography variant="h5" sx={{ mt: 2 }}>Información del Pedido</Typography>
            <Divider sx={{ my: 2 }} />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Subtotal
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formatCurrency(order.total_bruto)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Costo de Envío
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formatCurrency(order.delivery_cost)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Descuento
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {order.discount || 0}% ({formatCurrency((order.discount / 100) * (order.total_bruto || 0))})
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Total
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              {formatCurrency(order.total)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Fecha del Pedido
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formatDate(order.date)}
            </Typography>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary">
              Fecha de Creación
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              {formatDate(order.created_at)}
            </Typography>
          </Grid>
          
          {/* Productos del pedido */}
          {orderItems && orderItems.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ mt: 2 }}>Productos</Typography>
              <Divider sx={{ my: 2 }} />
              
              <TableContainer>
                <Table sx={{ minWidth: 650 }} aria-label="tabla de productos">
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell align="center">Cantidad</TableCell>
                      <TableCell align="right">Precio Unitario</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {orderItems.map((item: any, index: number) => (
                      <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row">
                          {item.name || item.product_name || `Producto #${item.product_id || item.id_product}`}
                        </TableCell>
                        <TableCell align="center">
                          {typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : item.quantity || 0}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.price || item.price_unit || 0)}
                        </TableCell>
                        <TableCell align="right">
                          {(() => {
                            // Asegurar que cantidad y precio son valores numéricos
                            const quantity = typeof item.quantity === 'string' ? 
                              parseInt(item.quantity, 10) : (item.quantity || 0);
                            const price = typeof item.price === 'string' ? 
                              parseFloat(item.price) : (item.price || item.price_unit || 0);
                            
                            // Usar el subtotal existente si está definido, o calcularlo
                            const subtotal = item.subtotal || item.price_final || (quantity * price);
                            return formatCurrency(subtotal);
                          })()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
          
          {/* Notas adicionales si existen */}
          {order.notes && (
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="text.secondary">
                Notas
              </Typography>
              <Paper
                variant="outlined"
                sx={{ p: 2, backgroundColor: 'background.default' }}
              >
                <Typography variant="body2">
                  {order.notes}
                </Typography>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Paper>
      
      {/* Diálogo de confirmación para eliminar */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Eliminar Pedido
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Está seguro que desea eliminar el pedido #{order.id}? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleting}
            autoFocus
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
} 