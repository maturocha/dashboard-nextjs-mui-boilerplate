"use client"
import { usePathname } from "next/navigation"
import Box from "@mui/material/Box"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import Divider from "@mui/material/Divider"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import Avatar from "@mui/material/Avatar"
import Tooltip from "@mui/material/Tooltip"
import { useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"

// Icons
import DashboardIcon from "@mui/icons-material/Dashboard"
import InventoryIcon from "@mui/icons-material/Inventory"
import LogoutIcon from "@mui/icons-material/Logout"
import CloseIcon from "@mui/icons-material/Close"
import Brightness4Icon from "@mui/icons-material/Brightness4"
import Brightness7Icon from "@mui/icons-material/Brightness7"

import SidebarItems from "./SidebarItems"

import { useTheme as useAppTheme } from "@/utils/providers/theme"

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { text: "Inventario", icon: <InventoryIcon />, path: "/dashboard/inventory" },
]

interface SidebarProps {
  onClose?: () => void
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const { mode, toggleColorMode } = useAppTheme()

  // Datos de usuario de ejemplo
  const userInfo = {
    name: "Usuario Demo",
    email: "usuario@ejemplo.com",
    image: "",
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: theme.palette.mode === "dark" ? "rgba(10, 10, 20, 0.95)" : "background.paper",
      }}
    >
      {/* Header con logo */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: "primary.main",
              width: 38,
              height: 38,
              mr: 1.5,
              borderRadius: 2,
            }}
          >
            {process.env.NEXT_PUBLIC_APP_NAME?.charAt(0) ?? "S"}
          </Avatar>
          <Typography variant="h6" fontWeight="700" letterSpacing="-0.5px">
            {process.env.NEXT_PUBLIC_APP_NAME ?? 'Stock'} App
          </Typography>
        </Box>
        {isMobile && onClose && (
          <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ opacity: 0.6 }} />

      {/* Navigation menu */}
      <SidebarItems />

      <Divider sx={{ opacity: 0.6 }} />

      {/* Footer con info de usuario y toggle de tema */}
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1.5,
            borderRadius: 2,
            bgcolor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.02)",
            mb: 1,
          }}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: theme.palette.mode === "dark" ? "primary.dark" : "primary.light",
            }}
          >
            {userInfo.name[0] || "U"}
          </Avatar>
          <Box sx={{ ml: 1.5, overflow: "hidden" }}>
            <Typography variant="body2" fontWeight={600} noWrap>
              {userInfo.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" noWrap>
              {userInfo.email}
            </Typography>
          </Box>
          <Tooltip title={mode === "dark" ? "Modo claro" : "Modo oscuro"}>
            <IconButton onClick={toggleColorMode} size="small" sx={{ ml: "auto", color: "text.secondary" }}>
              {mode === "dark" ? <Brightness7Icon fontSize="small" /> : <Brightness4Icon fontSize="small" />}
            </IconButton>
          </Tooltip>
        </Box>

        <ListItemButton
          sx={{
            borderRadius: 2,
            py: 1,
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "text.secondary" }}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText
            primary="Cerrar sesión"
            primaryTypographyProps={{
              fontSize: 14,
              fontWeight: 500,
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  )
}
