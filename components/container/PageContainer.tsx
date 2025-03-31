import React, { ReactNode } from 'react';
import { Box, Container } from '@mui/material';

interface PageContainerProps {
  children: ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ children }) => {
  return (
    <Container maxWidth={false}>
      <Box sx={{ minHeight: 'calc(100vh - 170px)', py: 3 }}>
        {children}
      </Box>
    </Container>
  );
};

export default PageContainer; 