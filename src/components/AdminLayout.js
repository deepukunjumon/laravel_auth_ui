// src/components/AdminLayout.js
import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  CssBaseline,
  Tooltip,
  useTheme,
  Collapse,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import GroupIcon from "@mui/icons-material/Group";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { logout as apiLogout } from "../services/auth";
import { jwtDecode } from "jwt-decode";
import SnackbarAlert from "./SnackbarAlert"; // Adjust path as needed
import DateTimeDisplay from "./DateTimeDisplay"; // Import the new component

const drawerWidth = 280;
const collapsedWidth = 60;

// Helper functions
const getUserFromToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return { name: "Admin", email: "", role: "admin" };
    const decoded = jwtDecode(token);
    return {
      name: decoded.name || decoded.username || decoded.email || "Admin",
      email: decoded.email || "",
      avatarUrl: decoded.avatarUrl || undefined,
      role: decoded.role || "admin",
    };
  } catch (error) {
    return { name: "Admin", email: "", role: "admin" };
  }
};

const getInitials = (name) => {
  if (!name) return "A";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
};

const usernameObj = getUserFromToken();
const username = usernameObj.name;

const sidebarItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: ROUTES.ADMIN_DASHBOARD },
  {
    label: "Users",
    icon: <PeopleIcon />,
    children: [
      { label: "User List", icon: <GroupIcon />, path: ROUTES.USERS_LIST },
      {
        label: "Add User",
        icon: <PersonAddIcon />,
        path: ROUTES.ADMIN_USERS_ADD,
      },
      { label: "Edit User", icon: <EditIcon />, path: ROUTES.ADMIN_USERS },
    ],
  },
];

const AdminLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [navigate]);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleMenuToggle = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  // Helper to close drawer on mobile after navigation
  const handleNavigate = (path) => {
    navigate(path);
    if (isMobile) setDrawerOpen(false);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);
    setSnack({ open: false, severity: "success", message: "" });
    try {
      await apiLogout();
      setSnack({
        open: true,
        severity: "success",
        message: "Logged out successfully.",
      });
      setTimeout(() => {
        setSnack((prev) => ({ ...prev, open: false }));
        navigate(ROUTES.LOGIN);
      }, 1200);
    } catch {
      setSnack({
        open: true,
        severity: "error",
        message: "Logout failed. Please try again.",
      });
    }
    setLogoutLoading(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f7fafd" }}>
      <CssBaseline />
      <SnackbarAlert
        open={snack.open}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
        severity={snack.severity}
        message={snack.message}
        autoHideDuration={3000}
      />
      {/* Navbar */}
      <AppBar
        position="fixed"
        elevation={2}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: theme.palette.primary.main,
          color: "#fff",
          boxShadow: "0 2px 8px 0 rgba(31,41,55,0.08)",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setDrawerOpen((v) => !v)}
            sx={{ mr: 2, display: { sm: "inline-flex" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 700 }}>
            Admin Dashboard
          </Typography>
          {!isMobile && <DateTimeDisplay />}
          <Tooltip title={"Profile"}>
            <IconButton onClick={handleMenuOpen} sx={{ ml: 1 }}>
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <Avatar
                  sx={{
                    bgcolor: "#fff",
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    width: isMobile ? 32 : 40,
                    height: isMobile ? 32 : 40,
                    fontSize: isMobile ? 16 : 20,
                  }}
                  alt={username}
                  src={usernameObj.avatarUrl || undefined}
                >
                  {getInitials(username)}
                </Avatar>
                {usernameObj.role === "admin" && (
                  <VerifiedUserIcon
                    sx={{
                      position: "absolute",
                      top: -4,
                      right: -5,
                      fontSize: isMobile ? 16 : 20,
                      color: "success.main",
                      bgcolor: "white",
                      borderRadius: "50%",
                      padding: 0.3,
                      boxShadow: 1,
                    }}
                  />
                )}
              </Box>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem disabled>
              <Typography variant="body2">{username}</Typography>
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate(ROUTES.ADMIN_PROFILE);
              }}
            >
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem
              onClick={async () => {
                handleMenuClose();
                await handleLogout();
              }}
              disabled={logoutLoading}
            >
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              {logoutLoading ? "Logging out..." : "Logout"}
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerOpen ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          whiteSpace: "nowrap",
          "& .MuiDrawer-paper": {
            width: drawerOpen ? drawerWidth : collapsedWidth,
            background: "#fff",
            boxSizing: "border-box",
            borderRight: "1px solid #eee",
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: drawerOpen ? "space-between" : "center",
            alignItems: "center",
            px: 2,
            minHeight: 64,
            borderBottom: "1px solid #f2f2f2",
            background: "#fff",
          }}
        >
          {drawerOpen && (
            <Typography
              variant="h6"
              sx={{ fontWeight: 500, fontSize: 18, color: "#444" }}
            >
              Menu
            </Typography>
          )}
          <IconButton
            onClick={() => setDrawerOpen((v) => !v)}
            size="small"
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          >
            <ChevronLeftIcon fontSize="medium" />
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          {sidebarItems.map((item) => {
            const isActive =
              location.pathname === item.path ||
              (item.children &&
                item.children.some((sub) => location.pathname === sub.path));
            const hasChildren = !!item.children;
            const isExpanded = openMenus[item.label];

            return (
              <React.Fragment key={item.label}>
                <Tooltip
                  title={drawerOpen ? "" : item.label}
                  placement="right"
                  arrow
                >
                  <ListItem
                    button
                    selected={isActive}
                    onClick={
                      hasChildren
                        ? () => handleMenuToggle(item.label)
                        : () => item.path && handleNavigate(item.path)
                    }
                    sx={{
                      mt: 0.5,
                      mx: 1,
                      borderRadius: "8px",
                      minHeight: 44,
                      color: isActive ? theme.palette.primary.main : "#333",
                      background: isActive ? "rgba(33,150,243,0.10)" : "none",
                      cursor: "pointer",
                      "&:hover": {
                        background: "rgba(33,150,243,0.13)",
                        color: theme.palette.primary.main,
                        cursor: "pointer",
                      },
                      "&:focus": {
                        cursor: "pointer",
                      },
                      transition: "all 0.13s",
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive
                          ? theme.palette.primary.main
                          : "#bdbdbd",
                        minWidth: 0,
                        mr: drawerOpen ? 2 : "auto",
                        justifyContent: "center",
                        fontSize: 24,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {drawerOpen && (
                      <ListItemText
                        primary={item.label}
                        sx={{ fontSize: 16, fontWeight: 700 }}
                      />
                    )}
                    {hasChildren &&
                      drawerOpen &&
                      (isExpanded ? <ExpandLess /> : <ExpandMore />)}
                  </ListItem>
                </Tooltip>
                {hasChildren && (
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((sub) => {
                        const subActive = location.pathname === sub.path;
                        return (
                          <ListItem
                            button
                            key={sub.label}
                            selected={subActive}
                            onClick={() => handleNavigate(sub.path)}
                            sx={{
                              pl: drawerOpen ? 6 : 2,
                              borderRadius: "8px",
                              color: subActive
                                ? theme.palette.primary.main
                                : "#555",
                              background: subActive
                                ? "rgba(33,150,243,0.08)"
                                : "none",
                              fontSize: 15,
                              cursor: "pointer",
                              "&:hover": {
                                background: "rgba(33,150,243,0.13)",
                                color: theme.palette.primary.main,
                                cursor: "pointer",
                              },
                              "&:focus": {
                                cursor: "pointer",
                              },
                            }}
                          >
                            <ListItemIcon
                              sx={{
                                color: subActive
                                  ? theme.palette.primary.main
                                  : "#bdbdbd",
                                minWidth: 0,
                                mr: drawerOpen ? 2 : "auto",
                                justifyContent: "center",
                                fontSize: 22,
                              }}
                            >
                              {sub.icon}
                            </ListItemIcon>
                            {drawerOpen && (
                              <ListItemText
                                primary={sub.label}
                                sx={{ fontSize: 15, fontWeight: 600 }}
                              />
                            )}
                          </ListItem>
                        );
                      })}
                    </List>
                  </Collapse>
                )}
              </React.Fragment>
            );
          })}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#f7fafd",
          p: { xs: 1, sm: 3 },
          minHeight: "100vh",
          marginLeft: isMobile
            ? 0
            : drawerOpen
            ? `${drawerWidth - (drawerWidth - 15)}px`
            : `${collapsedWidth - (collapsedWidth - 15)}px`,
          transition: "margin 0.2s",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminLayout;
