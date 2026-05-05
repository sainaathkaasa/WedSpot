import { Link } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";
import { type JSX } from "react";

interface AuthActionsProps {
  isAuthenticated: boolean;
  role: string | null;
  onLogout: () => void;
}

const AuthActions = ({
  isAuthenticated,
  role,
  onLogout,
}: AuthActionsProps): JSX.Element => {
  const btnTextStyle = {
    color: "#000000",
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    padding: "8px 20px",
    borderRadius: "10px",
    textTransform: "none",
    position: "relative",
    transition: "color 0.3s ease",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "6px",
      left: "50%",
      width: 0,
      height: "2px",
      backgroundColor: "#7c3aed",
      transform: "translateX(-50%)",
      transition: "width 0.3s ease",
      borderRadius: "2px",
    },
    "&:hover": {
      color: "#7c3aed",
      backgroundColor: "transparent",
      "&::after": {
        width: "60%",
      },
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
      }}
    >
      {isAuthenticated ? (
        <>
          <Typography
            variant="body2"
            sx={{
              marginRight: 2,
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              color: "#000000",
              display: { xs: "none", md: "block" },
            }}
          >
            {role ? `Role: ${role}` : null}
          </Typography>
          <Button variant="text" onClick={onLogout} sx={btnTextStyle}>
            Logout
          </Button>
        </>
      ) : (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="text" component={Link} to="/login" sx={btnTextStyle}>
            Login
          </Button>
          <Button
            variant="contained"
            component={Link}
            to="/register"
            sx={{
              background: "linear-gradient(90deg, #9b86ff 0%, #7c3aed 60%)",
              color: "#fff",
              padding: "10px 28px",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: 600,
              fontFamily: "'Inter', sans-serif",
              textTransform: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.25s ease",
              position: "relative",
              overflow: "hidden"  
            }}
          >
            Get Started
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AuthActions;
