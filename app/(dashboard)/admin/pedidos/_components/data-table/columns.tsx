'use client';

import { GridColDef } from '@mui/x-data-grid';
import { Chip, Box, IconButton, Tooltip, Typography, useTheme, useMediaQuery } from '@mui/material';
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

export const getColumns = (onDelete: (id: string) => void): GridColDef[] => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return [
    { 
      field: 'id', 
      headerName: 'ID', 
      width: 70,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight="medium">
          {params.value}
        </Typography>
      )
    },
    {
      field: 'date',
      headerName: 'Fecha',
      width: 120,
      renderCell: (params) => (
        <Typography variant="body2" color="text.secondary">
          {new Date(params.value).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })}
        </Typography>
      ),
    },
    {
      field: 'customer_name',
      headerName: 'Cliente',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <Typography 
            variant="body2" 
            fontWeight="medium"
            sx={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: 200
            }}
            title={params.value}
          >
            {params.value || 'Cliente sin nombre'}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {params.row.customer_type === 'p' ? 'Particular' : 'Mayorista'}
          </Typography>
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
        <Typography variant="body2" sx={{ py: 1 }}>
          {new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
          }).format(params.value || 0)}
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
        <Typography variant="body2" fontWeight="medium" color="primary.main">
          {new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
          }).format(params.value || 0)}
        </Typography>
      ),
    },
    {
      field: 'status',
      headerName: 'Estado',
      width: 140,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const statusValue = params.value as keyof typeof statusLabels;
        const chipColor = 
          statusValue === 'pending' ? 'warning' :
          statusValue === 'processing' ? 'info' :
          statusValue === 'completed' ? 'success' :
          statusValue === 'cancelled' ? 'error' : 'default';
        
        return (
          <Chip 
            label={statusLabels[statusValue] || 'Desconocido'} 
            size="small"
            color={chipColor}
            sx={{ 
              minWidth: 100,
              fontWeight: 'medium',
              fontSize: '0.75rem',
              height: 24
            }}
          />
        );
      },
    },
    {
      field: 'payment_method',
      headerName: 'Pago',
      width: 140,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        const methodValue = params.value as keyof typeof paymentMethodLabels;
        return (
          <Typography variant="body2">
            {paymentMethodLabels[methodValue] || 'Desconocido'}
          </Typography>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 140,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
          <IconButton 
            size="small" 
            color="info" 
            href={`/admin/pedidos/${params.row.id}`}
          >
            <VisibilityIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            color="primary" 
            href={`/admin/pedidos/${params.row.id}/edit`}
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            color="error" 
            onClick={(e) => {
              e.stopPropagation();
              onDelete(params.row.id.toString());
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];
}; 