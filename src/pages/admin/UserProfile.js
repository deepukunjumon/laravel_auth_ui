import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Typography,
  Alert,
  Stack,
  Container,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import apiConfig from "../../config/apiConfig";
import { useParams } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const roles = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
];

const UserProfile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(apiConfig.GET_USER_DETAILS(id), {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.data);
      } catch (err) {
        setError("Failed to load user details.");
      }
      setLoading(false);
    };
    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={300}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!user) return null;

  return (
    <Container maxWidth={false} sx={{ mt: 4, px: { xs: 1, sm: 3, md: 6 } }}>
      <Typography variant="h5" mb={2}>
        User Profile
      </Typography>
      <Box
        display="flex"
        flexDirection={{ xs: "column", md: "row" }}
        alignItems="stretch"
        sx={{ minHeight: { xs: 0, md: 400 } }}
      >
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            py: { xs: 2, md: 0 },
          }}
        >
          <Box display="flex" alignItems="center">
            <PersonIcon
              sx={{
                fontSize: { xs: 150, sm: 150, md: 360 },
                color: "primary.main",
                transition: "font-size 0.3s",
              }}
            />
            <VerifiedUserIcon
              sx={{
                fontSize: { xs: 20, sm: 20, md: 50 },
                color: "success.main",
                ml: { xs: -4, sm: -2, md: -8 },
                mt: { xs: -12, sm: -12, md: -25 },
                visibility: user.role === "admin" ? "visible" : "hidden",
                transition: "font-size 0.3s",
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            pl: { xs: 0, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Stack spacing={2}>
            <TextField
              label="Name"
              value={user.name}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Email"
              value={user.email}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              label="Mobile"
              value={user.mobile}
              InputProps={{ readOnly: true }}
              fullWidth
            />
            <TextField
              select
              label="Role"
              value={user.role}
              InputProps={{ readOnly: true }}
              fullWidth
            >
              {roles.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
        </Box>
      </Box>
    </Container>
  );
};

export default UserProfile;
