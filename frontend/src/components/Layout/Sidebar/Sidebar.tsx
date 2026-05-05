import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { icons } from "@/config/iconMap";
import { type JSX } from "react";
import { useAuth } from "@/features/auth";
import { useUser } from "@/features/user";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import {
  Box,
  Drawer,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  alpha
} from "@mui/material";
import { MENU_CONFIG, type MenuItem } from "@/config/menuConfig";
import SidebarSection from "./components/SidebarSection";

const Sidebar = (): JSX.Element => {
  const theme = useTheme();
  const { logout } = useAuth();
  const { user } = useUser();
  const { sidebarOpen, closeSidebar } = useDashboard();
  const role = user?.role;
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentRole = role?.toLowerCase();

  const sidebarWidth = 260;
  const collapsedWidth = 72;
  const isExpanded = sidebarOpen || isHovered;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getMenuItems = () => {
    if (!currentRole) return [{ text: "Dashboard", icon: icons.Dashboard, path: "/dashboard" }];

    const items: MenuItem[] = [
      { text: "Dashboard", icon: icons.Dashboard, path: "/dashboard" }
    ];

    const roleItems = MENU_CONFIG[currentRole] || [];
    items.push(...roleItems);

    return items;
  };

  const getGlobalItems = () => {
    return [
      { text: "Chatbot", icon: icons.Chat, path: "/chatbot" },
      { text: "Profile", icon: icons.Profile, path: "/profile" },
    ];
  };

  const mainMenuItems = getMenuItems();
  const globalItems = getGlobalItems();

  const handleItemClick = () => {
    if (window.innerWidth < 1200) closeSidebar();
  };

  const drawerContent = (
    <Box
      onMouseEnter={() => !sidebarOpen && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        pt: '80px',
        overflowX: 'hidden',
        overflowY: 'auto',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': {
          display: 'none'
        }
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <SidebarSection
          items={mainMenuItems}
          isExpanded={isExpanded}
          onItemClick={handleItemClick}
          currentPath={location.pathname}
        />

        <Divider sx={{ my: 2, mx: 1, opacity: 0.6 }} />

        <SidebarSection
          items={globalItems}
          isExpanded={isExpanded}
          onItemClick={handleItemClick}
          currentPath={location.pathname}
        />
      </Box>

      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 1,
            py: 1.25,
            minHeight: 48,
            justifyContent: isExpanded ? 'initial' : 'center',
            px: 2.5,
            color: 'error.main',
            '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.08) }
          }}
        >
          <ListItemIcon sx={{ minWidth: 0, mr: isExpanded ? 2 : 'auto', justifyContent: 'center', color: 'inherit' }}>
            {icons.Logout}
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.15s' }}
            primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: 700, whiteSpace: 'nowrap' }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { lg: sidebarOpen ? sidebarWidth : collapsedWidth },
        flexShrink: { lg: 0 },
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={sidebarOpen && window.innerWidth < 1200}
        onClose={closeSidebar}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: sidebarWidth,
            borderRight: 'none',
            boxShadow: '10px 0 25px rgba(0,0,0,0.05)',
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: isExpanded ? sidebarWidth : collapsedWidth,
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            overflowX: 'hidden',
            transition: theme.dashboard.transition,
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': {
              display: 'none'
            }
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;
