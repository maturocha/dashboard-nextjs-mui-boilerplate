import { Box, Skeleton, Paper } from '@mui/material';
import PageContainer from '@/components/container/PageContainer';

export default function Loading() {
  return (
    <PageContainer>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        mb: 3,
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2
      }}>
        <Skeleton variant="rectangular" width={200} height={40} sx={{ borderRadius: 1 }} />
        <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
      </Box>
      
      <Paper 
        sx={{ 
          p: 2, 
          borderRadius: 2,
          bgcolor: 'background.paper'
        }} 
        elevation={0}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Skeleton variant="rectangular" width={200} height={40} sx={{ borderRadius: 1 }} />
          <Skeleton variant="rectangular" width={120} height={40} sx={{ borderRadius: 1 }} />
        </Box>
        <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1 }} />
      </Paper>
    </PageContainer>
  );
}