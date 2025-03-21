"use client";
import { styled, Container, Box, Fab } from "@mui/material";
import React, { useState } from "react";
import Header from "@/components/layout/header/Header";
import Sidebar from "@/components/layout/sidebar/Sidebar";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { SessionProvider } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { AddCircleOutlineRounded } from "@mui/icons-material";
import { AppProvider } from "@/context/AppContext";
import GlobalModal from "@/components/shared/GlobalModal";

const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
  padding: "20px",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

const StyledFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: 16,
  right: 16,
  backgroundColor: '#4caf50',
  '&:hover': {
    backgroundColor: '#45a049',
  }
}));

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <html lang="es">
      <body>
        <SessionProvider>
          <AppProvider>
            <ThemeProvider theme={baselightTheme}>
              <CssBaseline />
              <MainWrapper className="mainwrapper">
              {/* Sidebar */}
              <Sidebar
                isSidebarOpen={isSidebarOpen}
                isMobileSidebarOpen={isMobileSidebarOpen}
                onSidebarClose={() => setMobileSidebarOpen(false)}
              />
              {/* Main Wrapper */}
              <PageWrapper className="page-wrapper">
                {/* Header */}
                <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
                {/* PageContent */}
                <Container
                  sx={{
                    paddingTop: "20px",
                    maxWidth: {
                      xs: '100%',
                      sm: '540px',
                      md: '720px',
                      lg: '100%',
                    },
                    px: {
                      xs: 2,
                      sm: 3,
                      lg: 4
                    },
                    ml: 0,
                    overflow: 'hidden',
                    position: 'relative',
                    width: '100%'
                  }}
                >
                  <Box 
                    sx={{ 
                      minHeight: "calc(100vh - 120px)",
                      width: '100%',
                      overflowX: 'hidden'
                    }}
                  >
                    {children}
                  </Box>
                </Container>
                
                  <StyledFab 
                    color='inherit'
                    onClick={() => router.push('/create')}
                  >
                    <AddCircleOutlineRounded />
                  </StyledFab>
                
              </PageWrapper>
            </MainWrapper>
            <GlobalModal />
          </ThemeProvider>
        </AppProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
