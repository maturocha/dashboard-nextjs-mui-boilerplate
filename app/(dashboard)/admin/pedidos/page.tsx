import { Suspense } from 'react';
import { Typography, Box, Skeleton } from '@mui/material';
import PageContainer from '@/components/container/PageContainer';
import OrdersDataTable from './_components/data-table/data-table';
import { Metadata } from 'next';
import AddButton from './_components/AddButton';

export const metadata: Metadata = {
  title: 'Gestión de Pedidos',
  description: 'Administración de pedidos y órdenes',
};

// Skeleton para la carga
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

export default function OrdersPage() {
  return (
    <PageContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h3" fontWeight="medium">
          Pedidos
        </Typography>
        <AddButton />
      </Box>
      
      <Box>
        <Suspense fallback={<OrdersDataTableSkeleton />}>
          <OrdersDataTable />
        </Suspense>
      </Box>
    </PageContainer>
  );
}