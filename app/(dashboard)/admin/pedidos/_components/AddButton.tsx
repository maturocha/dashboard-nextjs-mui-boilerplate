'use client';

import { Button, useTheme, useMediaQuery } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

export default function AddButton() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Button
      variant="contained"
      color="primary"
      size={isMobile ? "small" : "medium"}
      startIcon={<AddIcon />}
      href="/admin/pedidos/crear"
      sx={{ 
        py: isMobile ? 0.7 : 1.2,
        px: isMobile ? 1.5 : 2.5,
        fontWeight: 500,
        borderRadius: 1.5,
        boxShadow: theme.palette.mode === 'light'
          ? '0 4px 6px rgba(0, 118, 255, 0.3)'
          : '0 4px 6px rgba(0, 118, 255, 0.2)',
        minWidth: isMobile ? '120px' : '140px',
        textTransform: 'none',
        bgcolor: '#0076ff',
        '&:hover': {
          bgcolor: '#0065d8',
        }
      }}
    >
      Crear Pedido
    </Button>
  );
} 