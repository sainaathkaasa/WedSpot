import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "@/components/Layout/Sidebar/Sidebar";
import { useUser } from "@/features/user";
import { useDashboard } from "@/features/dashboard/context/DashboardContext";
import { type JSX, useState, useCallback, useMemo } from "react";
import { getInitials } from "@/utils/userUtils";
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Avatar,
  Tooltip,
  alpha,
  useTheme
} from "@mui/material";
import {
  Menu as MenuIcon,
  Notifications as BellIcon,
  ShoppingCart as CartIcon
} from "@mui/icons-material";
import { Logo } from "@/components/UI/Logo";
import NotificationCenter from "@/components/Notifications/NotificationCenter";
import { useCart } from "@/contexts/cartContextValue";
import { UserRole } from "@/features/auth";

// ✅ Constants outside component — not recreated on every render
const SIDEBAR_WIDTH_FULL = 260;
const SIDEBAR_WIDTH_COLLAPSED = 72;
const APPBAR_HEIGHT = 70;

const DashboardLayout = (): JSX.Element => {
  const theme = useTheme();
  const { user } = useUser();
  const { sidebarOpen, toggleSidebar } = useDashboard();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const navigate = useNavigate();
  const { items } = useCart();

  const role = user?.role;
  const userName = user?.name;
  const cartCount = items.length;
  const isClient = role === UserRole.CLIENT;

  // ✅ Memoized handlers — stable references across renders
  const handleProfileClick = useCallback(() => navigate("/profile"), [navigate]);
  const handleCartClick = useCallback(() => navigate("/cart"), [navigate]);
  const handleNotificationsToggle = useCallback(
    () => setIsNotificationsOpen((prev) => !prev),
    []
  );
  const handleNotificationsClose = useCallback(
    () => setIsNotificationsOpen(false),
    []
  );

  // ✅ Derived value memoized
  const currentSidebarWidth = useMemo(
    () => (sidebarOpen ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_COLLAPSED),
    [sidebarOpen]
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>

      {/* ✅ Conditionally render only when open — avoids keeping it in the DOM */}
      {isNotificationsOpen && (
        <NotificationCenter onClose={handleNotificationsClose} />
      )}

      <AppBar
        position="fixed"
        elevation={0} // ✅ Use elevation instead of manual boxShadow for MUI consistency
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: APPBAR_HEIGHT }}>

          {/* Left — Logo + Sidebar Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              edge="start"
              onClick={toggleSidebar}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <Logo />
            </Box>
          </Box>

          {/* Right — Notifications, Cart, Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>

            <Tooltip title="Notifications">
              <IconButton
                size="large"
                onClick={handleNotificationsToggle}
                aria-label="notifications"
                sx={{
                  bgcolor: isNotificationsOpen
                    ? alpha(theme.palette.primary.main, 0.1)
                    : 'transparent',
                  color: isNotificationsOpen ? 'primary.main' : 'inherit',
                }}
              >
                <Badge badgeContent={4} color="error">
                  <BellIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            {/* ✅ Only renders for CLIENT role */}
            {isClient && (
              <Tooltip title="View Cart">
                <IconButton
                  size="large"
                  aria-label="view cart"
                  onClick={handleCartClick}
                  sx={{ color: 'inherit' }}
                >
                  <Badge badgeContent={cartCount} color="primary">
                    <CartIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            <Tooltip title="View Profile">
              <Box
                onClick={handleProfileClick}
                role="button"      // ✅ Accessibility — Box acting as button needs role
                tabIndex={0}       // ✅ Keyboard navigable
                onKeyDown={(e) => e.key === 'Enter' && handleProfileClick()} // ✅ Keyboard support
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  cursor: 'pointer',
                  p: 0.5,
                  borderRadius: '50px',
                  transition: theme.dashboard?.transition,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.text.primary, 0.04)
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: 'primary.main',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.25)}`
                  }}
                >
                  {getInitials(userName || role)}
                </Avatar>
              </Box>
            </Tooltip>

          </Box>
        </Toolbar>
      </AppBar>

      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2.5, md: 2 },
          py: { xs: 2.5, md: 1 },
          width: { lg: `calc(100% - ${currentSidebarWidth}px)` },
          mt: `${APPBAR_HEIGHT}px`,
          transition: theme.dashboard?.transition,
          overflowX: 'hidden'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
