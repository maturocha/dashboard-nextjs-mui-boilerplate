'use client';

import { useState, useEffect } from 'react';
import {
  Box,
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
  CircularProgress,
  Paper,
  Stack,
  IconButton,
  Divider,
  TablePagination,
  useMediaQuery,
  Card,
  CardContent
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridPaginationModel,
} from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { getColumns, useOrderColumns } from './columns';
import { statusLabels, paymentMethodLabels } from '@/types/orders';
import { apiWrapper } from '@/utils/api/apiWrapper';
import { useSession } from 'next-auth/react';
import ZoneService, { Zone } from '@/utils/api/services/zoneService';

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
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: session } = useSession();
  const authUser = session?.user;

  // Estado para la paginación
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 10,
  });
  
  // Estado para sorting (ordenamiento)
  const [sorting, setSorting] = useState({
    by: 'created_at',
    type: 'desc',
  });
  
  // Estado para la búsqueda
  const [searchValue, setSearchValue] = useState('');
  
  // Estados para el filtrado
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});
  
  // Estados para la carga y errores
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [zoneList, setZoneList] = useState<Zone[]>([]);
  
  // Estados para el diálogo de confirmación de eliminación
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  
  // Estados para mensajes y alertas
  const [message, setMessage] = useState<{
    type?: 'success' | 'error';
    body?: string;
    open?: boolean;
  }>({});

  // Cargar los pedidos automáticamente al iniciar
  useEffect(() => {
    fetchOrders();
    fetchZones();
  }, []);

  // Función para obtener parámetros predeterminados
  const defaultQueryString = () => {
    const { by: sortBy, type: sortType } = sorting;
    const { page, pageSize: perPage } = paginationModel;

    return {
      sortBy,
      sortType,
      perPage,
      page,
      filters,
    };
  };
  
  // Función para cargar pedidos
  const fetchOrders = async (params = {}) => {
        try {
          setLoading(true);
      
      const {
        page,
        perPage,
        sortBy,
        sortType,
        filters: newFilters,
      } = { ...defaultQueryString(), ...params };

      const queryParams = {
        page: page || 0,
        perPage: perPage || 10,
        sortBy: sortBy || 'created_at',
        sortType: sortType || 'desc',
        ...(newFilters || {}),
      };

      const response = await apiWrapper.get('/orders', queryParams);
          
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
      
      // Actualizar estados
      setSorting({
        by: sortBy || sorting.by,
        type: sortType || sorting.type,
      });
      setFilters(newFilters || filters);
          setLoading(false);
      
        } catch (err) {
          console.error('Error cargando pedidos:', err);
          setLoading(false);
      setError('Error al cargar los pedidos');
    }
  };
  
  // Función para cargar zonas
  const fetchZones = async () => {
    try {
      const zones = await ZoneService.getAll();
      setZoneList(zones);
    } catch (err) {
      console.error('Error cargando zonas:', err);
    }
  };
  
  // Función de búsqueda
  const handleSearching = (value: string) => {
    setSearchValue(value);
    
    const newFilters = {
      ...filters,
      search: value,
    };
    
    fetchOrders({
      ...defaultQueryString(),
      filters: newFilters,
    });
  };

  // Usar un debounce simple para la búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== undefined) {
        handleSearching(searchValue);
      }
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

  const handleFiltering = (name: string, value: string) => {
    const newFilters = {
      ...filters,
      [`${name}`]: value,
    };
    
    setFilters(newFilters);
    handleFilterClose();
    
    fetchOrders({
      ...defaultQueryString(),
      filters: newFilters,
    });
  };

  const handleFilterRemove = (key: string) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    
    setFilters(newFilters);
    
    fetchOrders({
      ...defaultQueryString(),
      filters: newFilters,
    });
  };

  const clearFilters = () => {
    setFilters({});
    handleFilterClose();
    
    fetchOrders({
      ...defaultQueryString(),
      filters: {},
    });
  };
  
  /**
   * Manejadores para sorting (ordenamiento)
   */
  const handleSorting = (sortBy: string, sortType: 'asc' | 'desc') => {
    fetchOrders({
      ...defaultQueryString(),
      sortBy,
      sortType,
    });
  };

  /**
   * Manejadores para la paginación
   */
  const handlePageChange = (event: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    setPaginationModel({
      ...paginationModel,
      page,
    });
    
    fetchOrders({
      ...defaultQueryString(),
      page,
    });
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const perPage = parseInt(event.target.value, 10);
    setPaginationModel({
      page: 0, // Reset to first page
      pageSize: perPage,
    });
    
    fetchOrders({
      ...defaultQueryString(),
      perPage,
      page: 0,
    });
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
      await apiWrapper.delete('/orders', {}, {}, orderToDelete);
      
      setDeleteConfirmOpen(false);
      setOrderToDelete(null);
      setDeleting(false);
      
      // Mostrar mensaje de éxito
      setMessage({
        type: 'success',
        body: 'Pedido eliminado correctamente',
        open: true,
      });
      
      // Recargar pedidos
      fetchOrders();
      
    } catch (error) {
      console.error('Error al eliminar pedido:', error);
      setDeleting(false);
      
      // Mostrar mensaje de error
      setMessage({
        type: 'error',
        body: 'Error al eliminar pedido',
        open: true,
      });
    }
  };
  
  const handleDeleteCancel = () => {
    setDeleteConfirmOpen(false);
    setOrderToDelete(null);
  };

  const handleCloseMessage = () => {
    setMessage({});
  };

  // Columnas de la tabla usando el hook
  const columns = useOrderColumns(handleDeleteClick);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: 2, 
        overflow: 'hidden',
        bgcolor: 'background.paper'
      }}
    >
      {/* Barra de búsqueda y filtros */}
      <Box sx={{ 
        p: 2, 
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex', 
        flexDirection: { xs: 'column', sm: 'row' },
        justifyContent: 'space-between', 
        gap: { xs: 2, sm: 1 }
      }}>
        <TextField
          placeholder="Buscar pedido por cliente o ID..."
          variant="outlined"
          size="small"
          fullWidth
          sx={{ 
            maxWidth: { xs: '100%', sm: 300 },
            '& .MuiOutlinedInput-root': {
              borderRadius: 1.5
            }
          }}
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchValue ? (
              <InputAdornment position="end">
                <IconButton 
                  size="small" 
                  onClick={() => setSearchValue('')}
                  edge="end"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          }}
        />
        
        <Button
          variant="outlined"
          size="medium"
          color="primary"
          startIcon={<FilterListIcon />}
          onClick={handleFilterClick}
          sx={{ 
            borderRadius: 1.5, 
            minWidth: 100,
            alignSelf: { xs: 'flex-end', sm: 'auto' }
          }}
        >
          Filtros
        </Button>
        
        {/* Menú de filtros */}
        <Menu
          anchorEl={filterAnchorEl}
          open={Boolean(filterAnchorEl)}
          onClose={handleFilterClose}
          PaperProps={{
            sx: { 
              width: 250,
              maxHeight: 450,
              mt: 0.5,
              boxShadow: theme.shadows[4]
            }
          }}
        >
          <Box component="div">
            <MenuItem disabled>
              <Typography variant="subtitle2" color="textSecondary">
                Estado del pedido
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleFiltering('status', 'pending')}>
              <Chip 
                label={statusLabels.pending}
                size="small"
                color="warning"
                sx={{ mr: 1 }}
              />
              Pendiente
            </MenuItem>
            <MenuItem onClick={() => handleFiltering('status', 'processing')}>
              <Chip 
                label={statusLabels.processing}
                size="small"
                color="info"
                sx={{ mr: 1 }}
              />
              En proceso
            </MenuItem>
            <MenuItem onClick={() => handleFiltering('status', 'completed')}>
              <Chip 
                label={statusLabels.completed}
                size="small"
                color="success"
                sx={{ mr: 1 }}
              />
              Completado
            </MenuItem>
            <MenuItem onClick={() => handleFiltering('status', 'cancelled')}>
              <Chip 
                label={statusLabels.cancelled}
                size="small"
                color="error"
                sx={{ mr: 1 }}
              />
              Cancelado
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />
            
            <MenuItem disabled>
              <Typography variant="subtitle2" color="textSecondary">
                Método de pago
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleFiltering('payment_method', 'ef')}>
              Efectivo
            </MenuItem>
            <MenuItem onClick={() => handleFiltering('payment_method', 'trans')}>
              Transferencia
          </MenuItem>
            <MenuItem onClick={() => handleFiltering('payment_method', 'mp')}>
              Mercado Pago
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />
            
            <MenuItem disabled>
              <Typography variant="subtitle2" color="textSecondary">
                Tipo de cliente
              </Typography>
            </MenuItem>
            <MenuItem onClick={() => handleFiltering('customer_type', 'p')}>
              Particular
          </MenuItem>
            <MenuItem onClick={() => handleFiltering('customer_type', 'm')}>
              Mayorista
            </MenuItem>

            {zoneList.length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <MenuItem disabled>
                  <Typography variant="subtitle2" color="textSecondary">
                    Zonas
                  </Typography>
                </MenuItem>
                {zoneList.map(zone => (
                  <MenuItem key={zone.id} onClick={() => handleFiltering('id_zone', zone.id)}>
                    {zone.name}
            </MenuItem>
          ))}
              </>
            )}
            
            <Divider sx={{ my: 1 }} />
          
            <Box sx={{ p: 1 }}>
              <Button 
                fullWidth
                variant="outlined" 
                size="small" 
                onClick={clearFilters}
                color="primary"
              >
                Limpiar filtros
              </Button>
            </Box>
          </Box>
        </Menu>
      </Box>
      
      {/* Chips de filtros activos */}
      {Object.keys(filters).length > 0 && (
        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 1, 
          p: 1.5,
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
          borderBottom: `1px solid ${theme.palette.divider}`
        }}>
          {Object.entries(filters).map(([key, value]) => {
            let label = `${key}: ${value}`;
            
            if (key === 'status') {
              label = `Estado: ${statusLabels[value as keyof typeof statusLabels] || value}`;
            } else if (key === 'payment_method') {
              label = `Pago: ${paymentMethodLabels[value as keyof typeof paymentMethodLabels] || value}`;
            } else if (key === 'customer_type') {
              label = `Cliente: ${value === 'p' ? 'Particular' : 'Mayorista'}`;
            } else if (key === 'search') {
              label = `Búsqueda: ${value}`;
            } else if (key === 'id_zone' && zoneList.length > 0) {
              const zoneName = zoneList.find(zone => zone.id === value)?.name || value;
              label = `Zona: ${zoneName}`;
            }
            
            return (
            <Chip 
                key={key}
                label={label}
              size="small"
                onDelete={() => handleFilterRemove(key)}
                sx={{ 
                  borderRadius: 1,
                  bgcolor: theme.palette.background.paper
                }}
              />
            );
          })}
            <Chip 
            label="Limpiar todos"
              size="small"
              color="primary"
              variant="outlined"
            onClick={clearFilters}
            sx={{ borderRadius: 1 }}
            />
        </Box>
      )}
      
      {/* Vista responsiva para móviles o DataGrid para escritorio */}
      {isMobile ? (
        <Box sx={{ 
          height: { xs: 'calc(100vh - 250px)', sm: 'auto' },
          overflow: 'auto',
          p: 2
        }}>
      {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={40} />
            </Box>
          ) : orders.length === 0 ? (
            <Alert severity="info">No se encontraron pedidos.</Alert>
      ) : (
        <>
              {/* Tabla responsiva simple */}
              <Box component="table" sx={{ 
                width: '100%', 
                borderCollapse: 'collapse',
                fontSize: '0.95rem',
                mb: 2
              }}>
                <Box component="thead" sx={{ 
                  position: 'sticky',
                  top: 0,
                  backgroundColor: theme.palette.background.paper,
                  zIndex: 1
                }}>
                  <Box component="tr" sx={{ 
                    borderBottom: `1px solid ${theme.palette.divider}`,
                  }}>
                    <Box component="th" sx={{ 
                      textAlign: 'left', 
                      p: 2,
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                    }}>
                      ID
                    </Box>
                    <Box component="th" sx={{ 
                      textAlign: 'left', 
                      p: 2,
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                    }}>
                      Fecha
                    </Box>
                    <Box component="th" sx={{ 
                      textAlign: 'left', 
                      p: 2,
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                    }}>
                      Cliente
                    </Box>
                    <Box component="th" sx={{ 
                      textAlign: 'right', 
                      p: 2,
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap'
                    }}>
                      Total
                    </Box>
                    <Box component="th" sx={{ 
                      textAlign: 'center', 
                      p: 2,
                      fontWeight: 'bold',
                      width: '120px',
                      whiteSpace: 'nowrap'
                    }}>
                      Acciones
                    </Box>
                  </Box>
                </Box>
                <Box component="tbody">
                  {orders.map((order) => (
                    <Box 
                      component="tr" 
                      key={order.id}
                      sx={{ 
                        borderBottom: `1px solid ${theme.palette.divider}`,
                        transition: 'background-color 0.2s',
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' 
                            ? 'rgba(255, 255, 255, 0.04)' 
                            : 'rgba(0, 0, 0, 0.02)'
                        },
                        cursor: 'pointer'
                      }}
                      onClick={() => window.location.href = `/admin/pedidos/${order.id}`}
                    >
                      <Box component="td" sx={{ py: 2, px: 2, verticalAlign: 'middle' }}>
                        <Typography variant="body1" fontWeight="medium">
                          {order.id}
                        </Typography>
                      </Box>
                      <Box component="td" sx={{ py: 2, px: 2, verticalAlign: 'middle' }}>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                          {new Date(order.date || order.created_at).toLocaleDateString('es-ES', { 
                            day: '2-digit', 
                            month: 'short'
                          })}
                        </Typography>
                      </Box>
                      <Box component="td" sx={{ py: 2, px: 2, verticalAlign: 'middle' }}>
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            maxWidth: '120px', 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                          title={order.customer_name}
                        >
                          {order.customer_name || 'Cliente sin nombre'}
                        </Typography>
                      </Box>
                      <Box component="td" sx={{ py: 2, px: 2, textAlign: 'right', verticalAlign: 'middle' }}>
                        <Typography variant="body1" fontWeight="medium" color="primary.main">
                          {new Intl.NumberFormat('es-AR', {
                            style: 'currency',
                            currency: 'ARS',
                            maximumFractionDigits: 0
                          }).format(order.total || 0)}
              </Typography>
                      </Box>
                      <Box component="td" sx={{ py: 2, px: 1, textAlign: 'center', verticalAlign: 'middle' }}>
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <IconButton 
                            size="medium" 
                            color="info"
                            href={`/admin/pedidos/${order.id}`}
                            onClick={(e) => e.stopPropagation()}
                            sx={{ p: 1 }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                          <IconButton 
                            size="medium" 
                            color="primary"
                            href={`/admin/pedidos/${order.id}/edit`}
                            onClick={(e) => e.stopPropagation()}
                            sx={{ p: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            size="medium" 
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(order.id.toString());
                            }}
                            sx={{ p: 1 }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
              
              {/* Paginación para vista móvil */}
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
                <TablePagination
                  component="div"
                  count={totalRows}
                  page={paginationModel.page}
                  onPageChange={handlePageChange}
                  rowsPerPage={paginationModel.pageSize}
                  onRowsPerPageChange={handlePerPageChange}
                  rowsPerPageOptions={[5, 10, 25]}
                  labelRowsPerPage="Filas:"
                  labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                  sx={{
                    '.MuiTablePagination-displayedRows': {
                      fontSize: '0.95rem',
                    },
                    '.MuiTablePagination-selectLabel': {
                      fontSize: '0.95rem',
                    },
                    '.MuiTablePagination-select': {
                      fontSize: '0.95rem',
                    }
                  }}
                />
            </Box>
            </>
          )}
        </Box>
      ) : (
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
          <DataGrid
            rows={orders}
            columns={columns}
            pagination
            paginationModel={paginationModel}
            onPaginationModelChange={(model) => {
              setPaginationModel(model);
              handlePageChange(null, model.page);
            }}
            pageSizeOptions={[5, 10, 25, 50, 100]}
            paginationMode="server"
            rowCount={totalRows}
            disableRowSelectionOnClick
            autoHeight
            loading={loading}
            sx={{
              border: 'none',
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.05)' 
                  : 'rgba(0, 0, 0, 0.02)',
                borderRadius: 0
              },
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 'bold',
              },
              '& .MuiDataGrid-cell': {
                borderColor: theme.palette.divider,
                alignItems: 'center',
                paddingTop: '8px',
                paddingBottom: '8px'
              },
              '& .MuiDataGrid-row': {
                cursor: 'pointer'
              },
              '& .MuiDataGrid-row:hover': {
                backgroundColor: theme.palette.mode === 'dark' 
                  ? 'rgba(255, 255, 255, 0.04)' 
                  : 'rgba(0, 0, 0, 0.04)',
              },
              '& .MuiDataGrid-footerContainer': {
                borderTop: `1px solid ${theme.palette.divider}`,
              },
              '& .MuiDataGrid-virtualScroller': {
                '& .MuiDataGrid-row': {
                  maxHeight: 'none !important',
                  '&:nth-of-type(odd)': {
                    backgroundColor: theme.palette.mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.01)'
                      : 'rgba(0, 0, 0, 0.01)',
                  }
                }
              }
            }}
            getRowHeight={() => 'auto'}
            getEstimatedRowHeight={() => 56}
            getCellClassName={(params) => {
              // Centrar verticalmente todas las celdas
              return 'MuiDataGrid-cell--verticalCenter';
            }}
          />
        </Box>
      )}
      
      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>
          <Typography variant="h6" component="div">
            Confirmar eliminación
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que quiere borrar el pedido <b>#{orderToDelete}</b>? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button 
            onClick={handleDeleteCancel} 
            color="inherit"
            disabled={deleting}
            variant="outlined"
            sx={{ borderRadius: 1.5 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            color="error" 
            variant="contained"
            disabled={deleting}
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ borderRadius: 1.5 }}
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Mensajes de notificación */}
      <Snackbar
        open={message.open}
        autoHideDuration={6000}
        onClose={handleCloseMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseMessage} 
          severity={message.type} 
          sx={{ width: '100%' }}
        >
          {message.body}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

// Componente personalizado para paginación
function CustomPagination(props: any) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <TablePagination
      component="div"
      count={props.count}
      page={props.page}
      onPageChange={props.onPageChange}
      rowsPerPage={props.rowsPerPage}
      onRowsPerPageChange={props.onRowsPerPageChange}
      rowsPerPageOptions={[5, 10, 25, 50, 100]}
      labelRowsPerPage={isMobile ? "Filas:" : "Filas por página:"}
      labelDisplayedRows={({ from, to, count }) => (
        `${from}-${to} de ${count !== -1 ? count : `más de ${to}`}`
      )}
      sx={{
        '.MuiTablePagination-displayedRows': {
          fontSize: isMobile ? '0.75rem' : '0.875rem',
        },
        '.MuiTablePagination-selectLabel': {
          fontSize: isMobile ? '0.75rem' : '0.875rem',
        }
      }}
      ActionsComponent={(actionsProps) => (
        <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
          {!isMobile && (
            <IconButton
              onClick={(e) => actionsProps.onPageChange(e, 0)}
              disabled={actionsProps.page === 0}
              aria-label="first page"
              size="small"
            >
              <NavigateBeforeIcon fontSize="small" />
              <NavigateBeforeIcon fontSize="small" sx={{ ml: -1 }} />
            </IconButton>
          )}
          <IconButton
            onClick={(e) => actionsProps.onPageChange(e, actionsProps.page - 1)}
            disabled={actionsProps.page === 0}
            aria-label="previous page"
            size="small"
          >
            <NavigateBeforeIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={(e) => actionsProps.onPageChange(e, actionsProps.page + 1)}
            disabled={
              actionsProps.page >= Math.ceil(actionsProps.count / actionsProps.rowsPerPage) - 1
            }
            aria-label="next page"
            size="small"
          >
            <NavigateNextIcon fontSize="small" />
          </IconButton>
          {!isMobile && (
            <IconButton
              onClick={(e) =>
                actionsProps.onPageChange(
                  e,
                  Math.max(0, Math.ceil(actionsProps.count / actionsProps.rowsPerPage) - 1)
                )
              }
              disabled={
                actionsProps.page >= Math.ceil(actionsProps.count / actionsProps.rowsPerPage) - 1
              }
              aria-label="last page"
              size="small"
            >
              <NavigateNextIcon fontSize="small" />
              <NavigateNextIcon fontSize="small" sx={{ ml: -1 }} />
            </IconButton>
          )}
      </Box>
      )}
    />
  );
}

export default OrdersDataTable; 