import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected the import
import {
  Box,
  Paper,
  Typography,
  Link,
  Avatar,
  Button,
  Snackbar,
  Alert,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material"; // Added TextField for input and TableContainer
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility"; // Import visibility icon
import VisibilityOff from "@mui/icons-material/VisibilityOff"; // Import visibility off icon
import TextFieldComponent from "../components/TextFieldComponent"; // TextFieldComponent for inputs
import apiConfig from "../config/apiConfig"; // Correctly import apiConfig
import { ROUTES } from "../constants/routes"; // Ensure ROUTES is correctly imported
import illustration from "../assets/images/illustration.png"; // Add this import
import SnackbarAlert from "../components/SnackbarAlert"; // Import the new component

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Updated to include the setter function
  const [snack, setSnack] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const handleClose = () => setSnack((prev) => ({ ...prev, open: false }));

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSnack({ open: false, severity: "success", message: "" });

    try {
      const res = await fetch(apiConfig.LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSnack({
          open: true,
          severity: "success",
          message: data.message || "Login successful!",
        });

        localStorage.setItem("token", data.token);

        let role = "user";
        try {
          const decoded = jwtDecode(data.token);
          role = decoded.role || "user";
        } catch {
          role = "user";
        }

        setTimeout(() => {
          setSnack((prev) => ({ ...prev, open: false }));
          if (role === "admin") {
            navigate(ROUTES.ADMIN_DASHBOARD);
          }
          if (role === "user") {
            navigate(ROUTES.USER_PROFILE);
          }
        }, 2000);
      } else {
        setSnack({
          open: true,
          severity: "error",
          message: data.message || "Login failed.",
        });
      }
    } catch {
      setSnack({
        open: true,
        severity: "error",
        message: "An error occurred. Please try again.",
      });
    }
    setLoading(false);
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="#f7f7f7"
    >
      <SnackbarAlert
        open={snack.open}
        onClose={handleClose}
        severity={snack.severity}
        message={snack.message}
      />
      {/* Illustration on the left */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          alignItems: "center",
          justifyContent: "center",
          mr: 6,
        }}
      >
        <img
          src={illustration}
          alt="Login Illustration"
          style={{ maxWidth: 350, width: "100%", height: "auto" }}
        />
      </Box>

      <Box sx={{ width: 350 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Avatar
            sx={{
              width: 100,
              height: 100,
              bgcolor: "primary.main",
              m: 5,
            }}
          >
            <LockOutlinedIcon sx={{ fontSize: 36 }} />
          </Avatar>
        </Box>
        <form onSubmit={handleLogin}>
          <TextFieldComponent
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Password input with visibility toggle */}
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            disabled={loading}
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            {loading ? "Logging In..." : "Login"}
          </Button>
        </form>
        <Typography align="center" variant="body2" sx={{ mt: 2 }}>
          Don't have an account?{" "}
          <Link
            component="button"
            variant="body2"
            onClick={() => navigate("/register")}
          >
            Register
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Login;
