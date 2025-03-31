import { Grid, Skeleton, Card } from '@mui/material';
import PageContainer from '@/components/container/PageContainer';

export default function LoadingPage() {
  return (
    <PageContainer>
      <Grid container spacing={3}>
        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rounded" width={150} height={40} />
        </Grid>
        <Grid item xs={12}>
          <Card>
            <Skeleton variant="rectangular" height={60} sx={{ m: 2 }} />
            {[...Array(5)].map((_, index) => (
              <Skeleton 
                key={index} 
                variant="rectangular" 
                height={52} 
                sx={{ mx: 2, my: 1 }}
              />
            ))}
          </Card>
        </Grid>
      </Grid>
    </PageContainer>
  );
}