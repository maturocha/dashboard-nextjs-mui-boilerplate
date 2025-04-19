import React from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import { List } from "@mui/material";
import NavItem from "./NavItem";
import NavGroup from "./NavGroup";

const SidebarItems = () => {
  const pathname = usePathname();

  return (
    <List sx={{ flexGrow: 1, px: 2, py: 2 }}>
        {Menuitems.map((item) => {

          const isActive = pathname === item.href
          // {/********SubHeader**********/}
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />;

            // {/********If Sub Menu**********/}
            /* eslint no-else-return: "off" */
          } else {
            return  <NavItem
                        key={item.id}
                        item={item}
                        isActive={isActive}
                      />
          }
        })}
      </List>
  );
};
export default SidebarItems;
