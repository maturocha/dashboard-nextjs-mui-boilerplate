
import DashboardIcon from "@mui/icons-material/Dashboard"
import UsersIcon from "@mui/icons-material/Group"
import CategoryIcon from "@mui/icons-material/Category"
import SettingsIcon from "@mui/icons-material/Settings"

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "General",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: <DashboardIcon />,
    href: "/",
  },
  // {
  //   id: uniqueId(),
  //   title: "Productos",
  //   icon: IconBox,
  //   href: "/productos",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Pedidos",
  //   icon: IconShoppingCart,
  //   href: "/pedidos",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Clientes",
  //   icon: IconCustomers,
  //   href: "/clientes",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Listados",
  //   icon: IconList,
  //   href: "/listados",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Recaudaciones",
  //   icon: IconCash,
  //   href: "/recaudaciones",
  // },

  // Admin only section
  {
    navlabel: true,
    subheader: "Administración",
    role: "admin", // Add role property to control visibility
  },
  {
    id: uniqueId(),
    title: "Usuarios",
    icon: <UsersIcon />,
    href: "/admin/usuarios",
    role: "admin",
  },
  {
    id: uniqueId(),
    title: "Categorías",
    icon: <CategoryIcon />,
    href: "/admin/categorias",
    role: "admin",
  },
  // {
  //   id: uniqueId(),
  //   title: "Barrios",
  //   icon: IconMap,
  //   href: "/admin/barrios",
  //   role: "admin",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Zonas",
  //   icon: IconMap,
  //   href: "/admin/zonas",
  //   role: "admin",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Proveedores",
  //   icon: IconTruck,
  //   href: "/admin/proveedores",
  //   role: "admin",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Stock",
  //   icon: IconPackage,
  //   href: "/admin/stock",
  //   role: "admin",
  // },
  // {
  //   id: uniqueId(),
  //   title: "Estadísticas",
  //   icon: IconChartBar,
  //   href: "/admin/estadisticas",
  //   role: "admin",
  // },

  // Settings section
  {
    navlabel: true,
    subheader: "Configuración",
  },
  {
    id: uniqueId(),
    title: "Cuenta",
    icon: <SettingsIcon />,
    href: "/settings",
  },
];

export default Menuitems;
