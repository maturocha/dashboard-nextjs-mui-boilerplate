import React from "react";
// mui imports
import {
  ListItemIcon,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import Link from "next/link";

interface NavItemProps {
  item: {
    id?: string;
    title?: string;
    icon?: React.ReactNode;
    href?: string;
    navlabel?: boolean;
    subheader?: string;
    role?: string;
  };
  isActive: boolean;
}

const NavItem = ({ item, isActive }: NavItemProps) => {
  if (!item.title || !item.href || !item.icon) return null;

  return (
    <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
      <ListItemButton
        component={Link}
        href={item.href}
        selected={isActive}
        sx={{
          borderRadius: 2,
          py: 1.2,
          "&.Mui-selected": {
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": {
              bgcolor: "primary.dark",
            },
            "& .MuiListItemIcon-root": {
              color: "primary.contrastText",
            },
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 40,
            color: isActive ? "inherit" : "text.secondary",
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.title}
          primaryTypographyProps={{
            fontSize: 14,
            fontWeight: isActive ? 600 : 500,
          }}
        />
      </ListItemButton>
    </ListItem>
  )
  };

export default NavItem;
