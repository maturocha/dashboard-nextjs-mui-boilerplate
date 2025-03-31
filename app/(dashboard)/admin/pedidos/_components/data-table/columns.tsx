'use client';

import { GridColDef } from '@mui/x-data-grid';
import { Chip, Box, IconButton, Tooltip, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Order, paymentMethodLabels, statusLabels, statusColors } from '@/types/orders';

// Función auxiliar para convertir print_status en status
function getStatusFromPrintStatus(printStatus: number | undefined): string {
  if (printStatus === undefined) return 'pending';
  
  switch (printStatus) {
    case 0: return 'pending';
    case 1: return 'processing';
    case 2: return 'completed';
    case 3: return 'cancelled';
    default: return 'pending';
  }
}

interface ActionsProps {
  id: string;
  onDelete: (id: string) => void;
}

export const getColumns = (onDelete: (id: string) => void): GridColDef[] => [
  { 
    field: 'id', 
    headerName: 'ID', 
    width: 90,
    renderCell: (params) => (
      <Typography variant="body2">
        {params.value}
      </Typography>
    )
  },
  {
    field: 'customer_name',
    headerName: 'Cliente',
    flex: 1,
    minWidth: 180,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2">
          {params.row.customer_name || params.row.customer || ''}
        </Typography>
        {params.row.customer_type && (
          <Chip 
            label={params.row.customer_type === 'p' ? 'Particular' : 'Mayorista'}
            size="small"
            variant="outlined"
            sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
          />
        )}
      </Box>
    ),
  },
  {
    field: 'total_bruto',
    headerName: 'Subtotal',
    width: 120,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params) => (
      <Typography variant="body2">
        {new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS'
        }).format(params.value as number)}
      </Typography>
    ),
  },
  {
    field: 'total',
    headerName: 'Total',
    width: 120,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params) => (
      <Typography variant="body2">
        {new Intl.NumberFormat('es-AR', {
          style: 'currency',
          currency: 'ARS'
        }).format(params.value as number)}
      </Typography>
    ),
  },
  {
    field: 'status',
    headerName: 'Estado',
    width: 130,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      // Determinar el estado basado en print_status primero (si existe)
      const print_status = params.row.print_status;
      const status = print_status !== undefined ? getStatusFromPrintStatus(Number(print_status)) : params.value as Order['status'];
      
      // Si el valor no está en los statusLabels definidos, usar un valor por defecto
      const label = statusLabels[status] || status || 'Desconocido';
      
      let chipProps = {
        label,
        size: "small" as "small"
      };
      
      // Mapear colors de acuerdo al status
      const colorMapping: Record<string, string> = {
        'pending': '#FFA500',
        'processing': '#2196F3',
        'completed': '#4CAF50',
        'cancelled': '#F44336'
      };
      
      const bgColor = colorMapping[status] || '#9E9E9E';
      
      return (
        <Box sx={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}>
          <Chip 
            {...chipProps} 
            sx={{ 
              bgcolor: bgColor, 
              color: 'white', 
              minWidth: { xs: 75, sm: 90 }, 
              fontSize: '0.75rem',
              '& .MuiChip-label': { 
                px: { xs: 1, sm: 2 }
              }
            }} 
          />
        </Box>
      );
    },
  },
  {
    field: 'payment_method',
    headerName: 'Pago',
    width: 120,
    align: 'left',
    headerAlign: 'left',
    renderCell: (params) => (
      <Typography variant="body2">
        {params.value ? paymentMethodLabels[params.value as Order['payment_method']] : paymentMethodLabels['ef']}
      </Typography>
    ),
  },
  {
    field: 'date',
    headerName: 'Fecha',
    width: 120,
    align: 'left',
    headerAlign: 'left',
    renderCell: (params) => {
      const date = params.value ? new Date(params.value) : null;
      return (
        <Typography variant="body2">
          {date ? date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/') : '-'}
        </Typography>
      );
    },
  },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 120,
    sortable: false,
    filterable: false,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => {
      const handleDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        onDelete(params.row.id);
      };
      
      return (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center',
          width: '100%',
          gap: { xs: 0.5, sm: 1 },
          flexWrap: { xs: 'nowrap' }
        }}>
          <Tooltip title="Ver detalles">
            <IconButton
              size="small"
              href={`/admin/pedidos/${params.row.id}`}
              color="info"
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              href={`/admin/pedidos/${params.row.id}/edit`}
              color="primary"
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton
              size="small"
              color="error"
              onClick={handleDelete}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      );
    },
  },
]; 