"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Box from "@mui/material/Box"
import useMediaQuery from "@mui/material/useMediaQuery"
import { useTheme } from "@mui/material/styles"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import MenuIcon from "@mui/icons-material/Menu"
import Sidebar from "@/components/layout/sidebar/Sidebar"

const DRAWER_WIDTH = 280

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  // Cerrar drawer cuando se navega en móvil
  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false)
    }
  }, [pathname, isMobile])

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
        overflow: "hidden", // Evita scroll horizontal no deseado
      }}
    >
      {/* Desktop sidebar - fixed */}
      <Box
        component="nav"
        sx={{
          width: { md: DRAWER_WIDTH },
          flexShrink: { md: 0 },
        }}
      >
        {/* Mobile drawer */}
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
                borderRight: "none",
                boxShadow: 3,
              },
            }}
          >
            <Sidebar onClose={handleDrawerToggle} />
          </Drawer>
        ) : (
          // Desktop drawer - always visible
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
                borderRight: "none",
                boxShadow: (theme) =>
                  theme.palette.mode === "light"
                    ? "0px 2px 10px rgba(0, 0, 0, 0.05)"
                    : "0px 2px 10px rgba(0, 0, 0, 0.2)",
              },
            }}
            open
          >
            <Sidebar />
          </Drawer>
        )}
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { xs: "100%", md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden", // Contiene el scroll dentro del contenido
        }}
      >
        {/* Mobile header with menu button */}
        {isMobile && (
          <Box
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 10,
              py: 1.5,
              px: 2,
              display: "flex",
              alignItems: "center",
              backdropFilter: "blur(8px)",
              backgroundColor: (theme) =>
                theme.palette.mode === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(0, 0, 0, 0.6)",
              borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
            }}
          >
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        {/* Page content - con scroll propio */}
        <Box
          sx={{
            p: { xs: 2, sm: 3 },
            flexGrow: 1,
            overflow: "auto", // Scroll interno
            maxWidth: "100%", // Asegura que no exceda el ancho disponible
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
