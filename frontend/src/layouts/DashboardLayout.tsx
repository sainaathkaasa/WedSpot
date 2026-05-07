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
  useTheme,
  Divider,
  Typography
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

export const SIDEBAR_WIDTH_FULL = 230;
export const SIDEBAR_WIDTH_COLLAPSED = 64;
const APPBAR_HEIGHT = 56;

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

  const currentSidebarWidth = useMemo(
    () => (sidebarOpen ? SIDEBAR_WIDTH_FULL : SIDEBAR_WIDTH_COLLAPSED),
    [sidebarOpen]
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>

      {isNotificationsOpen && (
        <NotificationCenter onClose={handleNotificationsClose} />
      )}

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', minHeight: APPBAR_HEIGHT, px: { lg: theme.spacing(3) } }}>

          {/* Left — Logo + Sidebar Toggle */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              edge="start"
              onClick={toggleSidebar}
              sx={{
                mr: 1,
                borderRadius: theme.shape.borderRadius,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
              }}
            >
              <MenuIcon />
            </IconButton>
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', ml: 1 }}>
              <Logo />
            </Box>
          </Box>

          {/* Right — Notifications, Cart, Profile */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: theme.spacing(2.5) } }}>

            <Tooltip title="Notifications">
              <IconButton
                size="medium"
                onClick={handleNotificationsToggle}
                aria-label="notifications"
                sx={{
                  borderRadius: theme.shape.borderRadius,
                  bgcolor: isNotificationsOpen
                    ? alpha(theme.palette.primary.main, 0.1)
                    : alpha(theme.palette.text.primary, 0.03),
                  color: isNotificationsOpen ? 'primary.main' : 'text.secondary',
                  '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                }}
              >
                <Badge badgeContent={4} color="error" variant="dot">
                  <BellIcon fontSize="small" />
                </Badge>
              </IconButton>
            </Tooltip>

            {isClient && (
              <Tooltip title="View Cart">
                <IconButton
                  size="medium"
                  aria-label="view cart"
                  onClick={handleCartClick}
                  sx={{
                    borderRadius: theme.shape.borderRadius,
                    bgcolor: alpha(theme.palette.text.primary, 0.03),
                    color: 'text.secondary',
                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.1) }
                  }}
                >
                  <Badge badgeContent={cartCount} color="primary">
                    <CartIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>
            )}

            <Divider orientation="vertical" flexItem sx={{ height: 24, alignSelf: 'center', mx: theme.spacing(0.5) }} />

            <Tooltip title="View Profile">
              <Box
                onClick={handleProfileClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleProfileClick()}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing(1.5),
                  cursor: 'pointer',
                  p: theme.spacing(0.5),
                  pr: theme.spacing(1.5),
                  borderRadius: theme.shape.borderRadius,
                  transition: theme.dashboard.transition,
                  '&:hover': {
                    bgcolor: alpha(theme.palette.text.primary, 0.04)
                  }
                }}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: 'primary.main',
                    fontSize: theme.typography.caption.fontSize,
                    fontWeight: 700,
                  }}
                >
                  {getInitials(userName || role)}
                </Avatar>
                <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                        {userName || 'User'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500, textTransform: 'capitalize' }}>
                        {role?.toLowerCase()}
                    </Typography>
                </Box>
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
          px: { xs: theme.spacing(2.5), md: theme.spacing(2) },
          py: { xs: theme.spacing(2.5), md: theme.spacing(2.5) },
          width: { lg: `calc(100% - ${currentSidebarWidth}px)` },
          mt: `${APPBAR_HEIGHT}px`,
          transition: theme.dashboard.transition,
          overflowX: 'hidden',
          maxWidth: theme.dashboard.contentMaxWidth,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
