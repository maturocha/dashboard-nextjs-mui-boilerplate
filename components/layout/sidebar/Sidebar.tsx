import { useMediaQuery, Box, Drawer, Theme } from "@mui/material";
import SidebarItems from "./SidebarItems";
import { Sidebar, Logo } from 'react-mui-sidebar';

// Constants
const SIDEBAR_CONFIG = {
  width: '240px',
  mobileWidth: '270px',
  collapseWidth: '80px',
  themeColor: '#5d87ff',
  secondaryColor: '#49beff',
} as const;

// Custom scrollbar styles
const scrollbarStyles = {
  '&::-webkit-scrollbar': {
    width: '7px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#eff2f7',
    borderRadius: '15px',
  },
} as const;

// Improved TypeScript interface
interface SidebarProps {
  isMobileSidebarOpen: boolean;
  onSidebarClose: (event: React.MouseEvent<HTMLElement>) => void;
  isSidebarOpen: boolean;
}

const MSidebar = ({
  isMobileSidebarOpen,
  onSidebarClose,
  isSidebarOpen,
}: SidebarProps) => {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up("lg"));

  const SidebarContent = () => (
    <Sidebar
      width={lgUp ? SIDEBAR_CONFIG.width : SIDEBAR_CONFIG.mobileWidth}
      collapsewidth={SIDEBAR_CONFIG.collapseWidth}
      open={isSidebarOpen}
      isCollapse={!lgUp ? false : undefined}
      mode="light"
      direction="ltr"
      themeColor={SIDEBAR_CONFIG.themeColor}
      themeSecondaryColor={SIDEBAR_CONFIG.secondaryColor}
      showProfile={false}
      aria-label="Main sidebar navigation"
    >
      <Logo 
        img="/images/logos/dark-logo.svg" 
        alt="Application logo"
      />
      <Box role="navigation">
        <SidebarItems onItemClick={onSidebarClose} />
      </Box>
    </Sidebar>
  );

  if (lgUp) {
    return (
      <Box
        sx={{
          width: SIDEBAR_CONFIG.width,
          flexShrink: 0,
        }}
      >
        <Drawer
          anchor="left"
          open={isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: {
              boxSizing: "border-box",
              ...scrollbarStyles,
            },
          }}
        >
          <Box sx={{ height: "100%" }}>
            <SidebarContent />
          </Box>
        </Drawer>
      </Box>
    );
  }

  return (
    <Drawer
      anchor="left"
      open={isMobileSidebarOpen}
      onClose={onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          boxShadow: (theme) => theme.shadows[8],
          ...scrollbarStyles,
        },
      }}
    >
      <Box px={2}>
        <SidebarContent />
      </Box>
    </Drawer>
  );
};

export default MSidebar;





