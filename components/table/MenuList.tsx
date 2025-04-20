import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { MenuListProps } from '@/types/table';
import { ListItemIcon, ListItemText } from '@mui/material';


const MenuList: React.FC<MenuListProps> = ({ listItems }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton onClick={handleClick}>
        <ArrowDropDownIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {listItems.map(({ title, icon, onClick }, index) => (
          <MenuItem
            key={index}
            onClick={() => {
              onClick();
              handleClose();
            }}
          >
            <ListItemIcon>
              {icon}
            </ListItemIcon>
            <ListItemText>
              {title}
            </ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default MenuList;