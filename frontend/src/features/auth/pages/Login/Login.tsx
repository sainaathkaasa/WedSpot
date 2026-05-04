import React, { useState, type JSX } from "react";
import { Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Logo } from "@/components/UI/Logo";
import HeroImage from "@/assets/images/Hero_Couple_Image.png";
import {
  Box,
  Typography,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import { InputField, PasswordField } from "@/components/UI/Form";
import { FormButton } from "@/components/UI/Button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/features/auth";
import { isValidEmail } from "@/utils/validation";

const Login: React.FC = (): JSX.Element => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();

  if (searchParams.get('session') === 'expired' && !apiError) {
    setApiError("Your session has expired. Please log in again.");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!isValidEmail(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    setApiError("");

    try {
      const response = await login(email, password);
      if (response.ok) {
        console.log("Login Success:", response);
        const redirect = searchParams.get('redirect');
        navigate(redirect || "/dashboard");
      } else {
        setApiError(response.message || "Invalid email or password");
      }
    } catch (err: any) {
      setApiError(err.response?.data?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        overflow: "hidden",
        bgcolor: "#ffffff",
      }}
    >
      {/* Left Side - Image & Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "4rem",
          position: "relative",
          backgroundImage: `url(${HeroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0.1) 100%)",
            zIndex: 1,
          },
        }}
      >
        <Box sx={{ position: "relative", zIndex: 2, color: "#fff" }}>
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Fredoka One', cursive",
              fontSize: "3.5rem",
              mb: 2,
              animation: "fadeInUp 0.8s ease-out",
            }}
          >
            Welcome Back
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "1.125rem",
              opacity: 0.9,
              maxWidth: "480px",
              lineHeight: 1.6,
              animation: "fadeInUp 0.8s ease-out 0.2s backwards",
            }}
          >
            Log in to continue planning your perfect day. Manage your vendors, track your budget, and bring your dream wedding to life.
          </Typography>
        </Box>
      </Box>

      {/* Right Side - Form */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: "2rem", sm: "4rem" },
          bgcolor: {
            xs: "rgba(250, 245, 255, 1)",
            md: "#ffffff"
          },
          backgroundImage: {
            xs: 'radial-gradient(circle at 0% 0%, rgba(124, 58, 237, 0.05) 0%, transparent 50%), radial-gradient(circle at 100% 100%, rgba(124, 58, 237, 0.05) 0%, transparent 50%)',
            md: 'none'
          },
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: "420px",
            animation: "slideInRight 0.6s ease-out",
            "@keyframes slideInRight": {
              from: { opacity: 0, transform: "translateX(20px)" },
              to: { opacity: 1, transform: "translateX(0)" },
            },
            "@keyframes fadeInUp": {
              from: { opacity: 0, transform: "translateY(20px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {/* Mobile Logo Centered */}
          <Box sx={{ mb: 4, display: "flex", justifyContent: { xs: "center", md: "center" } }}>
            <Logo />
          </Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#1e293b",
              mb: 1,
              textAlign: "center",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Sign In
          </Typography>

          <Typography
            sx={{
              color: "#64748b",
              mb: 4,
              textAlign: "center",
              fontSize: "0.95rem",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Enter your details to access your account
          </Typography>

          {apiError && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: "10px", fontSize: "0.875rem" }}>
              {apiError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <InputField
              label="Email Address"
              placeholder="Ex: yourname@example.com"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              error={!!errors.email}
              helperText={errors.email}
              icon={<Mail size={18} color="#94a3b8" />}
            />

            <Box>
              <PasswordField
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: undefined });
                }}
                error={!!errors.password}
                helperText={errors.password}
              />
              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: "0.85rem",
                    color: "#7c3aed",
                    textDecoration: "none",
                    fontWeight: 500,
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  Forgot Password?
                </Link>
              </Box>
            </Box>

            <FormButton
              type="submit"
              loading={loading}
              icon={<ArrowRight size={20} />}
              sx={{ mt: 1 }}
            >
              Sign In
            </FormButton>
          </Box>
          <Divider sx={{ my: 0.5 }}>
            <Typography variant="body2" sx={{ color: "#9ca3af", px: 2, fontSize: "0.8rem" }}>
              or
            </Typography>
          </Divider>

          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} >
            <Typography sx={{ color: "#64748b", fontSize: "0.95rem", fontFamily: "'Inter', sans-serif" }}>
              Don't have an account?
            </Typography>
            <Link
              to="/register"
              style={{
                color: "#7c3aed",
                textDecoration: "none",
                fontWeight: 600,
                fontSize: "0.95rem",
                fontFamily: "'Inter', sans-serif",
                transition: "color 0.2s",
              }}
            >
              Sign Up
            </Link>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
