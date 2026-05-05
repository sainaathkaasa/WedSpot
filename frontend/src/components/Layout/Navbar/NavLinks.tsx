import { Link, useLocation, useNavigate } from "react-router-dom";
import { type JSX } from "react";
import { Box, Button, Typography } from "@mui/material";
import { scrollToSection } from "@/utils/scrollUtils";

interface NavLinksProps {
  onClose: () => void;
  isAuthenticated: boolean;
  role: string | null;
  onLogout: () => void;
  isMobileMenuOpen: boolean;
}

const NavLinks = ({
  onClose,
  isAuthenticated,
  role,
  onLogout,
  isMobileMenuOpen,
}: NavLinksProps): JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  const linkStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "8px 10px",
    color: "#000000",
    textDecoration: "none",
    position: "relative",
    fontWeight: 500,
    fontFamily: "'Inter', sans-serif",
    fontSize: "1rem",
    textTransform: "none",
    transition: "color 0.3s ease",
    minWidth: "auto",
    cursor: "pointer",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: isMobileMenuOpen ? "16px" : "50%",
      width: 0,
      height: "2px",
      background: "linear-gradient(90deg, #7c3aed 0%, #a78bfa 100%)",
      transform: isMobileMenuOpen ? "translateX(0)" : "translateX(-50%)",
      transition: "width 0.3s ease",
      borderRadius: "2px",
    },
    "&:hover": {
      color: "#7c3aed",
      background: "transparent",
      "&::after": {
        width: isMobileMenuOpen ? "calc(100% - 32px)" : "80%",
      },
    },
    ...(isMobileMenuOpen && {
      width: "100%",
      padding: "12px 16px",
      justifyContent: "flex-start",
    }),
  };

  const activeLinkStyle = {
    ...linkStyle,
    color: "#7c3aed",
    fontWeight: 600,
    "&::after": {
      ...linkStyle["&::after"],
      width: isMobileMenuOpen ? "calc(100% - 32px)" : "80%",
    },
  };

  const navItems = [
    { label: "Home", to: "/", isRouter: true },
    { label: "Services", to: "#services" },
    { label: "Contact", to: "#contact" },
    { label: "About Us", to: "#about" },
    { label: "Reviews", to: "#reviews" },
  ];

  const handleNavClick = (item: { label: string; to: string; isRouter?: boolean }) => {
    if (item.label === "Home") {
      if (location.pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
        window.scrollTo(0, 0);
      }
    } else {
      scrollToSection(item.to, navigate, location.pathname);
    }
    onClose();
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: isMobileMenuOpen ? "column" : "row",
        alignItems: isMobileMenuOpen ? "flex-start" : "center",
        gap: isMobileMenuOpen ? "8px" : { xs: "10px", md: "18px" },
        width: isMobileMenuOpen ? "100%" : "auto",
      }}
    >
      {navItems.map((item) => {
        const isActive = item.isRouter
          ? location.pathname === "/" && location.hash === ""
          : location.hash === item.to;
        return (
          <Button
            key={item.label}
            component="button"
            sx={isActive ? activeLinkStyle : linkStyle}
            onClick={() => handleNavClick(item)}
          >
            {item.label}
          </Button>
        );
      })}

      {/* Auth buttons - only visible on mobile */}
      {isMobileMenuOpen && (
        <Box
          sx={{
            width: "100%",
            marginTop: "16px",
            paddingTop: "16px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          {isAuthenticated ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "100%",
              }}
            >
              {role && (
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "#64748b",
                    fontWeight: 600,
                    padding: "0 16px",
                    marginBottom: "4px",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Role: {role}
                </Typography>
              )}
              <Button
                sx={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.3s ease",
                  border: "2px solid #e5e7eb",
                  background: "#fff",
                  color: "#000000",
                  fontSize: "15px",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#7c3aed",
                    color: "#7c3aed",
                    background: "rgba(124, 58, 237, 0.05)",
                  },
                }}
                onClick={() => {
                  onLogout();
                  onClose();
                }}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "100%",
              }}
            >
              <Button
                component={Link}
                to="/login"
                sx={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  transition: "all 0.3s ease",
                  border: "2px solid #e5e7eb",
                  background: "#fff",
                  color: "#000000",
                  fontSize: "15px",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#7c3aed",
                    color: "#7c3aed",
                    background: "rgba(124, 58, 237, 0.05)",
                  },
                }}
                onClick={onClose}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                sx={{
                  width: "100%",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontFamily: "'Inter', sans-serif",
                  background: "linear-gradient(90deg, #9b86ff 0%, #7c3aed 60%)",
                  color: "#fff",
                  transition: "all 0.3s ease",
                  border: "none",
                  fontSize: "15px",
                  textTransform: "none",
                  "&:hover": {
                    background: "linear-gradient(135deg, #9333ea 0%, #8b5cf6 100%)",
                  },
                }}
                onClick={onClose}
              >
                Get Started
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Box>

  );
};

export default NavLinks;
