'use client';

import { GridColDef } from '@mui/x-data-grid';
import { Chip, Box, IconButton, Tooltip, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Order, paymentMethodLabels, statusLabels, statusColors, OrderStatus } from './data-table/schema';

export const columns: GridColDef[] = [
  { 
    field: 'id', 
    headerName: 'ID', 
    width: 90,
    renderCell: (params) => (
      <Typography variant="body2">{params.value}</Typography>
    )
  },
  {
    field: 'customer_name',
    headerName: 'Cliente',
    flex: 1,
    minWidth: 180,
    renderCell: (params) => (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2">{params.row.customer_name}</Typography>
        <Chip 
          label={params.row.customer_type === 'p' ? 'Particular' : 'Mayorista'}
          size="small"
          variant="outlined"
          sx={{ ml: 1, height: 20, fontSize: '0.7rem' }}
        />
      </Box>
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
      const value = params.value as OrderStatus;
      return (
        <Chip
          label={statusLabels[value]}
          color={statusColors[value]}
          size="small"
          sx={{ 
            borderRadius: 1,
            fontSize: '0.75rem', 
            fontWeight: 'medium',
            textTransform: 'capitalize',
            minWidth: 90,
            justifyContent: 'center'
          }}
        />
      );
    },
  },
  {
    field: 'payment_method',
    headerName: 'Pago',
    width: 120,
    renderCell: (params) => (
      <Typography variant="body2">
        {paymentMethodLabels[params.value as Order['payment_method']]}
      </Typography>
    ),
  },
  {
    field: 'date',
    headerName: 'Fecha',
    width: 120,
    renderCell: (params) => (
      <Typography variant="body2">
        {new Date(params.value as string).toLocaleDateString('es-ES', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        }).replace(/\//g, '/')}
      </Typography>
    ),
  },
  {
    field: 'actions',
    headerName: 'Acciones',
    width: 100,
    sortable: false,
    filterable: false,
    align: 'center',
    headerAlign: 'center',
    renderCell: (params) => (
      <Box sx={{ display: 'flex' }}>
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
      </Box>
    ),
  },
];