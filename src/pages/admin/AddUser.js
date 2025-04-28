import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Alert,
  Stack,
  Paper,
} from "@mui/material";
import axios from "axios";
import apiConfig from "../../config/apiConfig";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";

const roles = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

const AddUser = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(apiConfig.ADD_USER, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("User added successfully!");
      setTimeout(() => navigate(-1), 1200); // Go back after success
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to add user. Please check the details and try again."
      );
    }
    setLoading(false);
  };

  return (
    <Container maxWidth={false} sx={{ mt: 4, px: { xs: 1, sm: 3, md: 6 } }}>
      <Paper sx={{ p: { xs: 2, sm: 4, md: 6 }, maxWidth: 900, mx: "auto" }}>
        <Typography variant="h5" mb={2}>
          Add New User
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              label="Mobile"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              select
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              required
              fullWidth
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
              fullWidth
            >
              {loading ? "Adding..." : "Add User"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default AddUser;
