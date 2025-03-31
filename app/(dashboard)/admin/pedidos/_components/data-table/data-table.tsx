'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Skeleton,
  TextField,
  InputAdornment,
  Button,
  Chip,
  useTheme,
  Typography,
  Menu,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
} from '@mui/material';
import {
  DataGrid,
  GridLocaleText,
} from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import { getColumns } from './columns';
import { statusLabels, paymentMethodLabels } from '@/types/orders';
import OrderService from '@/utils/api/services/orderService';
import { apiWrapper } from '@/utils/api/apiWrapper';

// Función para convertir print_status numérico a status textual
const getStatusFromPrintStatus = (printStatus: number): string => {
  switch (printStatus) {
    case 0: return 'pending';
    case 1: return 'processing';
    case 2: return 'completed';
    case 3: return 'cancelled';
    default: return 'pending';
  }
};

// Definir interfaz para el objeto order
interface OrderData {
  id: string | number;
  customer_name?: string;
  customer?: string;
  customer_id?: string;
  id_customer?: string;
  customer_type?: string;
  total_bruto?: number;
  total?: number;
  delivery_cost?: number;
  discount?: number;
  status?: string;
  payment_method?: string;
  items?: any[];
  details?: any[];
  date?: string;
  created_at?: string;
  updated_at?: string;
  print_status?: number;
}

/**
 * Componente principal para la visualización de pedidos en formato de tabla
 * Incluye funcionalidades de paginación, búsqueda, filtrado y eliminación
 */
function OrdersDataTable() {
  const theme = useTheme();
  // Estado para la paginación
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  // Estado para la búsqueda
  const [searchValue, setSearchValue] = useState('');
  // Estados para el filtrado
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState({
    status: '',
    payment_method: '',
  });
  // Estados para la carga y errores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  
  // Estados para el diálogo de confirmación de eliminación
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Cargar los pedidos automáticamente al iniciar
  useEffect(() => {
    const loadOrders = async () => {
      try {
        setLoading(true);
        const response = await apiWrapper.get('/orders', {
          page: '',
          perPage: '',
          sortBy: '',
          sortType: ''
        });
        
        if (response?.data && Array.isArray(response.data)) {
          const adaptedOrders = response.data
            .filter((order: OrderData) => order && (order.id || order.id === 0))
            .map((order: OrderData) => ({
              id: order.id,
              customer_name: order.customer_name || order.customer || '',
              customer_id: order.customer_id || order.id_customer || '',
              customer_type: order.customer_type || 'p',
              total_bruto: order.total_bruto || 0,
              total: order.total || 0,
              delivery_cost: order.delivery_cost || 0,
              discount: order.discount || 0,
              status: order.print_status !== undefined ? getStatusFromPrintStatus(Number(order.print_status)) : order.status || 'pending',
              payment_method: order.payment_method || 'ef',
              items: order.items || order.details || [],
              date: order.date || order.created_at || '',
              created_at: order.created_at || '',
              updated_at: order.updated_at || '',
              print_status: order.print_status
            }));
          
          if (adaptedOrders.length > 0) {
            setOrders(adaptedOrders);
            setTotalRows(response.total || adaptedOrders.length);
          }
        }
        setLoading(false);
      } catch (err) {
        console.error('Error cargando pedidos:', err);
        setLoading(false);
      }
    };
    
    loadOrders();
  }, []);
  
  // Función de búsqueda
  const searchOrders = () => {
    if (searchValue) {
      // Si hay búsqueda, filtrar localmente los pedidos ya cargados
      setOrders(prev => 
        prev.filter((order: OrderData) => 
          order.customer_name?.toLowerCase().includes(searchValue.toLowerCase()) ||
          String(order.id).includes(searchValue)
        )
      );
    } else {
      // Si no hay búsqueda, recargar los pedidos
      const loadOrders = async () => {
        try {
          setLoading(true);
          const response = await apiWrapper.get('/orders', {
            page: '',
            perPage: '',
            sortBy: '',
            sortType: ''
          });
          
          if (response?.data && Array.isArray(response.data)) {
            const adaptedOrders = response.data
              .filter((order: OrderData) => order && (order.id || order.id === 0))
              .map((order: OrderData) => ({
                id: order.id,
                customer_name: order.customer_name || order.customer || '',
                customer_id: order.customer_id || order.id_customer || '',
                customer_type: order.customer_type || 'p',
                total_bruto: order.total_bruto || 0,
                total: order.total || 0,
                delivery_cost: order.delivery_cost || 0,
                discount: order.discount || 0,
                status: order.print_status !== undefined ? getStatusFromPrintStatus(Number(order.print_status)) : order.status || 'pending',
                payment_method: order.payment_method || 'ef',
                items: order.items || order.details || [],
                date: order.date || order.created_at || '',
                created_at: order.created_at || '',
                updated_at: order.updated_at || '',
                print_status: order.print_status
              }));
            
            if (adaptedOrders.length > 0) {
              setOrders(adaptedOrders);
              setTotalRows(response.total || adaptedOrders.length);
            }
          }
          setLoading(false);
        } catch (err) {
          console.error('Error cargando pedidos:', err);
          setLoading(false);
        }
      };
      
      loadOrders();
    }
  };

  // Usar un debounce simple para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      searchOrders();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchValue]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Manejadores para los filtros
   */
  const handleFilterClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchorEl(null);
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters({
      ...filters,
      [name]: value,
    });
    if (name === 'status' || name === 'payment_method') {
      handleFilterClose();
    }
  };

  const clearFilters = () => {
    setFilters({
      status: '',
      payment_method: '',
    });
    handleFilterClose();
  };
  
  /**
   * Manejadores para la eliminación de pedidos
   */
  const handleDeleteClick = (id: string) => {
    setOrderToDelete(id);
    setDeleteConfirmOpen(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!orderToDelete) return;
    
    setDeleting(true);
    
    try {
      await OrderService.delete(orderToDelete);
      setDeleteConfirmOpen(false);
      setDeleteSuccess(true);
      
      // Recargar la lista después de eliminar
      const response = await apiWrapper.get('/orders', {
        page: '',
        perPage: '',
        sortBy: '',
        sortType: ''
      });
      
      if (response?.data && Array.isArray(response.data)) {
        const adaptedOrders = response.data
          .filter((order: OrderData) => order && (order.id || order.id === 0))
          .map((order: OrderData) => ({
            id: order.id,
            customer_name: order.customer_name || order.customer || '',
            customer_id: order.customer_id || order.id_customer || '',
            customer_type: order.customer_type || 'p',
            total_bruto: order.total_bruto || 0,
            total: order.total || 0,
            delivery_cost: order.delivery_cost || 0,
            discount: order.discount || 0,
            status: order.print_status !== undefined ? getStatusFromPrintStatus(Number(order.print_status)) : order.status || 'pending',
            payment_method: order.payment_method || 'ef',
            items: order.items || order.details || [],
            date: order.date || order.created_at || '',
            created_at: order.created_at || '',
            updated_at: order.updated_at || '',
            print_status: order.print_status
          }));
        
        setOrders(adaptedOrders);
        setTotalRows(response.total || adaptedOrders.length);
      }
    } catch (err) {
      console.error('Error al eliminar el pedido:', err);
      setError('Error al eliminar el pedido. Por favor, intente nuevamente.');
    } finally {
      setDeleting(false);
      setOrderToDelete(null);
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setOrderToDelete(null);
  };

  // Textos en español para el DataGrid
  const localeText: Partial<GridLocaleText> = {
    noRowsLabel: 'No hay registros',
    noResultsOverlayLabel: 'No se encontraron resultados',
    columnMenuLabel: 'Menú',
    columnMenuShowColumns: 'Mostrar columnas',
    columnMenuFilter: 'Filtrar',
    columnMenuHideColumn: 'Ocultar',
    columnMenuUnsort: 'Desordenar',
    columnMenuSortAsc: 'Ordenar ASC',
    columnMenuSortDesc: 'Ordenar DESC',
    filterPanelOperator: 'Operadores',
    filterPanelColumns: 'Columnas',
    filterPanelInputLabel: 'Valor',
    MuiTablePagination: {
      labelDisplayedRows: ({ from, to, count }) =>
        `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`,
      labelRowsPerPage: 'Filas por página:',
    },
  };

  return (
    <>
      {/* Mostrar errores si los hay */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {/* Notificación de éxito al eliminar */}
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
      
      {/* Barra de búsqueda y filtros */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2 
      }}>
        <TextField
          placeholder="Buscar..."
          variant="outlined"
          size="small"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ 
            width: { xs: '100%', sm: '300px' },
            '& .MuiOutlinedInput-root': {
              borderRadius: 1,
            }
          }}
        />
        
        <Button
          variant="outlined"
          size="small"
          startIcon={<FilterListIcon />}
          onClick={handleFilterClick}
          sx={{ ml: 1 }}
        >
          Filtros
        </Button>
        
        {/* Menú de filtros */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
          PaperProps={{
            sx: { width: 250, mt: 1, p: 1 }
          }}
        >
          <Typography variant="subtitle2" sx={{ px: 2, py: 1 }}>Estado</Typography>
          <MenuItem 
            onClick={() => handleFilterChange('status', '')}
            selected={filters.status === ''}
          >
            Todos
          </MenuItem>
          {Object.entries(statusLabels).map(([value, label]) => (
            <MenuItem 
              key={value} 
              onClick={() => handleFilterChange('status', value)}
              selected={filters.status === value}
            >
              {label}
            </MenuItem>
          ))}
          
          <Typography variant="subtitle2" sx={{ px: 2, py: 1, mt: 1 }}>Método de pago</Typography>
          <MenuItem 
            onClick={() => handleFilterChange('payment_method', '')}
            selected={filters.payment_method === ''}
          >
            Todos
          </MenuItem>
          {Object.entries(paymentMethodLabels).map(([value, label]) => (
            <MenuItem 
              key={value} 
              onClick={() => handleFilterChange('payment_method', value)}
              selected={filters.payment_method === value}
            >
              {label}
            </MenuItem>
          ))}
          
          {(filters.status || filters.payment_method) && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                size="small" 
                onClick={clearFilters}
                variant="outlined"
              >
                Limpiar filtros
              </Button>
            </Box>
          )}
        </Menu>
      </Box>
      
      {/* Chips de filtros activos */}
      {(filters.status || filters.payment_method) && (
        <Box sx={{ display: 'flex', mb: 2, gap: 1 }}>
          {filters.status && (
            <Chip 
              label={`Estado: ${statusLabels[filters.status as keyof typeof statusLabels]}`}
              onDelete={() => handleFilterChange('status', '')}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
          {filters.payment_method && (
            <Chip 
              label={`Pago: ${paymentMethodLabels[filters.payment_method as keyof typeof paymentMethodLabels]}`}
              onDelete={() => handleFilterChange('payment_method', '')}
              size="small"
              color="primary"
              variant="outlined"
            />
          )}
        </Box>
      )}
      
      {/* Tabla de datos o esqueleto durante la carga */}
      {loading ? (
        <OrdersDataTableSkeleton />
      ) : (
        <>
          {/* Si no hay datos, mostrar un botón para cargar pedidos de prueba */}
          {orders.length === 0 && (
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                No se encontraron pedidos en el sistema.
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => {
                  setLoading(true);
                  const loadOrders = async () => {
                    try {
                      const response = await apiWrapper.get('/orders', {
                        page: '',
                        perPage: '',
                        sortBy: '',
                        sortType: ''
                      });
                      
                      if (response?.data && Array.isArray(response.data)) {
                        const adaptedOrders = response.data
                          .filter((order: OrderData) => order && (order.id || order.id === 0))
                          .map((order: OrderData) => ({
                            id: order.id,
                            customer_name: order.customer_name || order.customer || '',
                            customer_id: order.customer_id || order.id_customer || '',
                            customer_type: order.customer_type || 'p',
                            total_bruto: order.total_bruto || 0,
                            total: order.total || 0,
                            delivery_cost: order.delivery_cost || 0,
                            discount: order.discount || 0,
                            status: order.print_status !== undefined ? getStatusFromPrintStatus(Number(order.print_status)) : order.status || 'pending',
                            payment_method: order.payment_method || 'ef',
                            items: order.items || order.details || [],
                            date: order.date || order.created_at || '',
                            created_at: order.created_at || '',
                            updated_at: order.updated_at || '',
                            print_status: order.print_status
                          }));
                        
                        if (adaptedOrders.length > 0) {
                          setOrders(adaptedOrders);
                          setTotalRows(response.total || adaptedOrders.length);
                        }
                      }
                      setLoading(false);
                    } catch (err) {
                      console.error('Error cargando pedidos:', err);
                      setLoading(false);
                    }
                  };
                  
                  loadOrders();
                }}
              >
                Recargar pedidos
              </Button>
            </Box>
          )}
          
          <DataGrid
            rows={orders}
            columns={getColumns(handleDeleteClick)}
            rowCount={totalRows}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            pageSizeOptions={[10, 25, 50, 100]}
            pagination
            paginationMode="server"
            autoHeight
            disableRowSelectionOnClick
            disableColumnMenu
            localeText={localeText}
            loading={loading}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: 'transparent',
                fontSize: '0.875rem',
                fontWeight: 'bold',
                color: theme.palette.text.secondary,
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              '& .MuiDataGrid-cell': {
                fontSize: '0.875rem',
                py: 1.5,
                borderBottom: `1px solid ${theme.palette.divider}`,
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: 'none',
              },
              '& .MuiTablePagination-root': {
                fontSize: '0.875rem',
              },
              '& .MuiDataGrid-virtualScroller': {
                overflowX: { xs: 'auto', md: 'hidden' }
              },
              '& .MuiDataGrid-main': {
                overflow: 'auto'
              },
              '& .MuiDataGrid-cellContent': {
                width: '100%'
              },
              '& .MuiDataGrid-cell--textRight, & .MuiDataGrid-cell--textCenter': {
                justifyContent: { xs: 'center', sm: 'flex-end' }
              }
            }}
            initialState={{
              columns: {
                columnVisibilityModel: {
                  id: false,
                  date: { xs: false, sm: true } as any,
                  total_bruto: { xs: false, sm: true } as any,
                }
              },
            }}
          />
        </>
      )}
      
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
            ¿Está seguro que desea eliminar este pedido? Esta acción no se puede deshacer.
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
    </>
  );
}

/**
 * Componente de esqueleto que se muestra durante la carga de datos
 */
function OrdersDataTableSkeleton() {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Skeleton variant="rectangular" width={200} height={40} />
        <Skeleton variant="rectangular" width={100} height={40} />
      </Box>
      <Skeleton variant="rectangular" height={400} />
    </Box>
  );
}

export default OrdersDataTable; 