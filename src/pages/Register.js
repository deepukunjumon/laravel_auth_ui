import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Link,
    Avatar,
    Button,
    InputAdornment,
    TextField,
    IconButton,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import apiConfig from "../config/apiConfig"; // Make sure this has REGISTER_URL or use '/register'
import { ROUTES } from "../constants/routes"; // Ensure this has LOGIN route
import illustration2 from "../assets/images/illustration2.png"; // Add this import
import SnackbarAlert from "../components/SnackbarAlert"; // Import the new component

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [snack, setSnack] = useState({
        open: false,
        severity: "success",
        message: "",
    });

    const handleClose = () => setSnack((prev) => ({ ...prev, open: false }));

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSnack({ open: false, severity: "success", message: "" });

        try {
            const res = await fetch(apiConfig.REGISTER_URL || "/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setSnack({
                    open: true,
                    severity: "success",
                    message: data.message || "Registration successful! Redirecting...",
                });
                setTimeout(() => {
                    setSnack((prev) => ({ ...prev, open: false }));
                    navigate(ROUTES.LOGIN || "/login");
                }, 2000);
            } else {
                setSnack({
                    open: true,
                    severity: "error",
                    message: data.message || "Registration failed.",
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
                    src={illustration2}
                    alt="Register Illustration"
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
                <form onSubmit={handleRegister}>
                    <TextField
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Mobile"
                        name="mobile"
                        value={form.mobile}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        required
                        fullWidth
                        margin="normal"
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
                        {loading ? "Registering..." : "Register"}
                    </Button>
                </form>
                <Typography align="center" variant="body2" sx={{ mt: 2 }}>
                    Already have an account?{" "}
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => navigate(ROUTES.LOGIN || "/login")}
                    >
                        Login
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Register; 