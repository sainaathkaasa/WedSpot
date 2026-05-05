import { type JSX } from "react";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Stack,
  Link,
  IconButton,
} from "@mui/material";
import { Logo } from "@/components/UI/Logo";
import { scrollToSection } from "@/utils/scrollUtils";

/**
 * Footer component migrated to Material UI.
 * Features: Shimmering top border, responsive 4-column grid, and smooth link animations.
 */
const Footer = (): JSX.Element => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScroll = (sectionId: string) => {
    scrollToSection(sectionId, navigate, location.pathname);
  };

  const linkStyle = {
    color: "#b0b0b0",
    textDecoration: "none",
    fontSize: "15px",
    transition: "all 0.3s ease",
    position: "relative",
    display: "inline-block",
    cursor: "pointer",
    background: "none",
    border: "none",
    p: 0,
    fontFamily: "'Inter', sans-serif",
    textAlign: "left",
    width: "fit-content",
    "&::before": {
      content: '""',
      position: "absolute",
      bottom: "-2px",
      left: 0,
      width: 0,
      height: "2px",
      background: "linear-gradient(90deg, #7c3aed 0%, #a855f7 100%)",
      transition: "width 0.3s ease",
    },
    "&:hover": {
      color: "#fff",
      transform: "translateX(5px)",
      "&::before": {
        width: "100%",
      },
    },
  };

  return (
    <Box
      component="footer"
      sx={{
        width: "100%",
        background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
        color: "#e5e5e5",
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #9b86ff 0%, #7c3aed 60%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 3s linear infinite",
        },
        "@keyframes shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      }}
    >
      <Container
        maxWidth="lg"
        sx={{
          pt: "60px",
          px: { xs: "20px", sm: "40px" },
        }}
      >
        {/* Main Footer Content */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "2fr 1fr 1fr 1.5fr",
            },
            gap: { xs: "40px", md: "60px" },
            pb: "50px",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Company Info */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Logo />
            <Typography
              sx={{
                fontSize: "15px",
                lineHeight: 1.7,
                color: "#b0b0b0",
                maxWidth: "320px",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Creating magical moments since 2019. Your dream wedding, perfectly
              planned and beautifully executed.
            </Typography>

            {/* Social Links */}
            <Stack direction="row" spacing={1.5}>
              {[
                {
                  label: "Facebook",
                  path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z",
                  url: "https://facebook.com",
                },
                {
                  label: "Instagram",
                  path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
                  url: "https://instagram.com",
                },
                {
                  label: "Twitter",
                  path: "M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z",
                  url: "https://twitter.com",
                },
              ].map((social) => (
                <IconButton
                  key={social.label}
                  component="a"
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: "10px",
                    background: "rgba(255, 255, 255, 0.05)",
                    color: "#b0b0b0",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    "&:hover": {
                      background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
                      color: "#fff",
                      borderColor: "transparent",
                    },
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </IconButton>
              ))}
            </Stack>
          </Box>

          {/* Quick Links */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Typography
              component="h4"
              sx={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#fff",
                position: "relative",
                pb: "12px",
                fontFamily: "'Inter', sans-serif",
                m: 0,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "40px",
                  height: "2px",
                  background: "linear-gradient(90deg, #7c3aed 0%, transparent 100%)",
                },
              }}
            >
              Quick Links
            </Typography>
            <Stack component="ul" sx={{ p: 0, m: 0, listStyle: "none", gap: "12px" }}>
              {[
                { label: "Home", type: "link", to: "/", onClick: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
                { label: "Why Choose Us", type: "button", sectionId: "why-choose-us" },
                { label: "Services", type: "button", sectionId: "services" },
                { label: "Contact", type: "button", sectionId: "contact" },
                { label: "About Us", type: "button", sectionId: "about" },
              ].map((item) => (
                <Box component="li" key={item.label}>
                  {item.type === "link" ? (
                    <Box
                      component={RouterLink}
                      to={item.to!}
                      onClick={item.onClick}
                      sx={linkStyle}
                    >
                      {item.label}
                    </Box>
                  ) : (
                    <Box
                      component="button"
                      onClick={() => handleScroll(item.sectionId!)}
                      sx={linkStyle}
                    >
                      {item.label}
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Services */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Typography
              component="h4"
              sx={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#fff",
                position: "relative",
                pb: "12px",
                fontFamily: "'Inter', sans-serif",
                m: 0,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "40px",
                  height: "2px",
                  background: "linear-gradient(90deg, #7c3aed 0%, transparent 100%)",
                },
              }}
            >
              Our Services
            </Typography>
            <Stack component="ul" sx={{ p: 0, m: 0, listStyle: "none", gap: "12px" }}>
              {[
                "Wedding Planning",
                "Photography",
                "Flower Design",
                "Makeup Artist",
                "Catering",
              ].map((service) => (
                <Box component="li" key={service}>
                  <Box
                    component="button"
                    onClick={() => handleScroll("services")}
                    sx={linkStyle}
                  >
                    {service}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Contact Info */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Typography
              component="h4"
              sx={{
                fontSize: "18px",
                fontWeight: 600,
                color: "#fff",
                position: "relative",
                pb: "12px",
                fontFamily: "'Inter', sans-serif",
                m: 0,
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "40px",
                  height: "2px",
                  background: "linear-gradient(90deg, #7c3aed 0%, transparent 100%)",
                },
              }}
            >
              Get In Touch
            </Typography>
            <Stack component="ul" sx={{ p: 0, m: 0, listStyle: "none", gap: "16px" }}>
              {[
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  ),
                  text: "123 Wedding St, Hassan, KA 573201",
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  ),
                  text: "+91 (555) 123-4567",
                },
                {
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                      <polyline points="22,6 12,13 2,6" />
                    </svg>
                  ),
                  text: "support@weddspot.com",
                },
              ].map((item, idx) => (
                <Box
                  component="li"
                  key={idx}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    color: "#b0b0b0",
                    fontSize: "14px",
                    lineHeight: 1.6,
                    "& svg": {
                      flexShrink: 0,
                      mt: "2px",
                      color: "#7c3aed",
                      transition: "transform 0.3s ease",
                    },
                    "&:hover svg": {
                      transform: "scale(1.1)",
                      color: "#a855f7",
                    },
                  }}
                >
                  {item.icon}
                  <Typography component="span" sx={{ fontSize: "inherit", fontFamily: "'Inter', sans-serif" }}>
                    {item.text}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>

        {/* Bottom Bar */}
        <Box sx={{ py: "30px" }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            alignItems="center"
            spacing={2.5}
            sx={{ textAlign: { xs: "center", md: "left" } }}
          >
            <Typography sx={{ fontSize: "14px", color: "#999", fontFamily: "'Inter', sans-serif" }}>
              © {currentYear} WeddsPot. All rights reserved.
            </Typography>
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
              flexWrap="wrap"
            >
              {[
                { label: "Privacy Policy", to: "/privacy" },
                { label: "Terms of Service", to: "/terms" },
                { label: "Cookie Policy", to: "/cookies" },
              ].map((link, idx) => (
                <Stack direction="row" key={link.label} alignItems="center">
                  <Link
                    component={RouterLink}
                    to={link.to}
                    sx={{
                      fontSize: "14px",
                      color: "#999",
                      textDecoration: "none",
                      transition: "color 0.3s ease",
                      fontFamily: "'Inter', sans-serif",
                      "&:hover": { color: "#7c3aed" },
                    }}
                  >
                    {link.label}
                  </Link>
                  {idx < 2 && (
                    <Typography
                      component="span"
                      sx={{ color: "#555", fontSize: "12px", ml: 2, fontFamily: "'Inter', sans-serif" }}
                    >
                      •
                    </Typography>
                  )}
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
