import { useState, type JSX } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { useUser } from "@/features/user";
import {
  AppBar,
  Toolbar,
  Box,
  Container,
  IconButton,
  Collapse,
} from "@mui/material";
import { Logo } from "@/components/UI/Logo";
import NavLinks from "./NavLinks";
import AuthActions from "./AuthActions";

const NavBar = (): JSX.Element => {
  const { isAuthenticated, logout } = useAuth();
  const { user } = useUser();
  const role = user?.role;
  const nav = useNavigate();
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((v) => !v);
  const closeMenu = () => setOpen(false);

  const handleLogout = async () => {
    try {
      if (!user?.id) return;
      await logout();
    } catch {
      // ignore
    } finally {
      closeMenu();
      nav("/login");
    }
  };

  return (
    <>
      {/* Mobile Menu Backdrop */}
      <Box
        onClick={closeMenu}
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 40,
          display: { xs: "block", md: "none" },
          opacity: open ? 1 : 0,
          visibility: open ? "visible" : "hidden",
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          pointerEvents: open ? "auto" : "none",
          minHeight: "100vh",
        }}
      />

      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backgroundColor: "#ffffff",
          boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
          zIndex: 50,
          width: "100%",
          top: 0,
          maxHeight: "90px",
        }}
      >
        <Container
          maxWidth={false}
          sx={{
            maxWidth: "1280px",
            width: "100%",
            padding: "0 16px !important",
          }}
        >
          <Toolbar
            disableGutters
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 0",
              gap: { xs: "10px", md: "16px" },
              minHeight: "auto !important",
            }}
          >
            {/* Left side: Logo and Desktop Nav */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: "16px", md: "28px" },
                width: { xs: "100%", md: "auto" },
                justifyContent: { xs: "space-between", md: "flex-start" },
              }}
            >
              <Box component="p" sx={{ margin: 0, padding: 0, lineHeight: 1 }}>
                <Logo />
              </Box>

              {/* Desktop Nav Links */}
              <Box
                sx={{
                  display: { xs: "none", md: "block" },
                }}
              >
                <NavLinks
                  onClose={closeMenu}
                  isAuthenticated={isAuthenticated}
                  role={role || null}
                  onLogout={handleLogout}
                  isMobileMenuOpen={false}
                />
              </Box>

              {/* Mobile menu button */}
              <IconButton
                onClick={toggleMenu}
                sx={{
                  display: { xs: "flex", md: "none" },
                  padding: "8px",
                  borderRadius: "10px",
                  color: "#000000",
                  width: "40px",
                  height: "40px",
                  flexDirection: "column",
                  gap: "5px",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.04)",
                  },
                }}
                aria-label="Toggle navigation"
              >
                <Box
                  sx={{
                    width: "22px",
                    height: "2px",
                    backgroundColor: "#000000",
                    borderRadius: "2px",
                    transition: "all 0.3s ease",
                    transform: open ? "translateY(7px) rotate(45deg)" : "none",
                  }}
                />
                <Box
                  sx={{
                    width: "22px",
                    height: "2px",
                    backgroundColor: "#000000",
                    borderRadius: "2px",
                    transition: "all 0.3s ease",
                    opacity: open ? 0 : 1,
                  }}
                />
                <Box
                  sx={{
                    width: "22px",
                    height: "2px",
                    backgroundColor: "#000000",
                    borderRadius: "2px",
                    transition: "all 0.3s ease",
                    transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
                  }}
                />
              </IconButton>
            </Box>

            {/* Right side: Desktop Auth Actions */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: "10px",
              }}
            >
              <AuthActions
                isAuthenticated={isAuthenticated}
                role={role || null}
                onLogout={handleLogout}
              />
            </Box>
          </Toolbar>
        </Container>

        {/* Mobile Menu Expansion - Absolute position overlay */}
        <Collapse
          in={open}
          timeout={300}
          unmountOnExit
          sx={{
            display: { xs: "block", md: "none" },
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            backgroundColor: "#ffffff",
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.08)",
            zIndex: 49,
          }}
        >
          <Box
            sx={{
              padding: "12px 16px",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <NavLinks
              onClose={closeMenu}
              isAuthenticated={isAuthenticated}
              role={role || null}
              onLogout={handleLogout}
              isMobileMenuOpen={true}
            />
          </Box>
        </Collapse>
      </AppBar>
    </>

  );
};

export default NavBar;
