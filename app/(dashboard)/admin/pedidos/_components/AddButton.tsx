'use client';

import { Button, useTheme } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function AddButton() {
  const theme = useTheme();
  
  return (
    <Button
      variant="contained"
      color="primary"
      size="medium"
      startIcon={<AddIcon />}
      href="/admin/pedidos/crear"
      sx={{ 
        py: 1,
        px: 2,
        fontWeight: 'medium',
        boxShadow: `0 4px 14px 0 ${theme.palette.mode === 'light' 
          ? 'rgba(0, 118, 255, 0.39)' 
          : 'rgba(0, 118, 255, 0.23)'}`
      }}
    >
      Crear Pedido
    </Button>
  );
} 