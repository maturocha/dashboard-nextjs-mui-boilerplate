'use client';

import { Typography, Box, useTheme, useMediaQuery } from '@mui/material';
import PageContainer from '@/components/container/PageContainer';
import OrdersDataTable from './_components/data-table/data-table';
import AddButton from './_components/AddButton';

export default function OrdersPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <PageContainer>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: { xs: 2, sm: 3 },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
        px: { xs: 0, sm: 0 }
      }}>
        <Typography 
          variant="h5" 
          fontWeight="medium"
          sx={{ 
            fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
            alignSelf: { xs: 'flex-start', sm: 'center' },
            color: theme.palette.text.primary
          }}
        >
          Pedidos
        </Typography>
        <AddButton />
      </Box>
      
      <OrdersDataTable />
    </PageContainer>
  );
}