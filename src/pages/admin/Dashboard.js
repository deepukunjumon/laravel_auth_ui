import React, { useState, useEffect } from "react";
import { Grid, Typography, Box, Alert, IconButton, Stack, Avatar, useMediaQuery, CircularProgress } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import StatCard from "../../components/StatCard";
import apiConfig from "../../config/apiConfig";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/routes";
import { useTheme } from "@mui/material/styles";

const Dashboard = () => {
  const [userCounts, setUserCounts] = useState({
    total: 0,
    active: 0,
    disabled: 0,
    deleted: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch counts (reusable for refresh)
  const fetchUserCounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found");
      }

      const response = await axios.get(`${apiConfig.USERS_COUNTS}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.status_counts) {
        const counts = response.data.status_counts;
        const total =
          (counts.active || 0) + (counts.disabled || 0) + (counts.deleted || 0);

        setUserCounts({
          total,
          active: counts.active || 0,
          disabled: counts.disabled || 0,
          deleted: counts.deleted || 0,
        });
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching user counts:", err);
      setError("Failed to load user statistics. Please try again later.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCounts();
    // eslint-disable-next-line
  }, []);

  const statCards = [
    {
      title: "All Users",
      value: userCounts.total,
      icon: <PersonIcon />,
      color: "primary",
      subtitle: "Total Users",
      to: ROUTES.USERS_LIST,
      status: "",
    },
    {
      title: "Active Users",
      value: userCounts.active,
      icon: <CheckCircleOutlineIcon />,
      color: "success",
      subtitle: "Currently active",
      to: ROUTES.USERS_LIST,
      status: 1,
    },
    {
      title: "Disabled Users",
      value: userCounts.disabled,
      icon: <ErrorOutlineIcon />,
      color: "warning",
      subtitle: "Temporarily disabled",
      to: ROUTES.USERS_LIST,
      status: 0,
    },
    {
      title: "Deleted Users",
      value: userCounts.deleted,
      icon: <DeleteOutlineIcon />,
      color: "error",
      subtitle: "Removed from system",
      to: ROUTES.USERS_LIST,
      status: -1,
    },
  ];

  return (
    <>
      {/* Header with Refresh Button */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5" gutterBottom>
          <h4>Dashboard</h4>
        </Typography>
        <IconButton
          aria-label="refresh"
          onClick={fetchUserCounts}
          disabled={loading}
          size="large"
        >
          <RefreshIcon />
        </IconButton>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid
        container
        spacing={{ xs: 1.5, sm: 2, md: 3 }}
        alignItems="stretch"
      >
        {statCards.map((card, index) => (
          <Grid
            item
            xs={6}
            key={index}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Box
              sx={{
                width: 250,      // fixed width for all cards
                height: 130,     // fixed height for all cards
                display: "flex",
                alignItems: "stretch",
              }}
              onClick={() => {
                if (card.status !== undefined && card.status !== "") {
                  navigate(`${card.to}?status=${card.status}`);
                } else {
                  navigate(card.to);
                }
              }}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  if (card.status !== undefined && card.status !== "") {
                    navigate(`${card.to}?status=${card.status}`);
                  } else {
                    navigate(card.to);
                  }
                }
              }}
              role="button"
              aria-label={card.title}
              style={{ outline: "none" }}
            >
              <StatCard
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
                loading={loading && !isSmallScreen}
                subtitle={card.subtitle}
                sx={{
                  width: "100%",
                  height: "100%",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  boxShadow: 1,
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-2px) scale(1.03)",
                  },
                }}
              />
            </Box>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Dashboard;
