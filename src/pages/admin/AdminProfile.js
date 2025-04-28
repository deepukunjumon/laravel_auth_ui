import React, { useEffect, useState } from "react";
import {
    Typography,
    TextField,
    Button,
    Stack,
    CircularProgress,
    IconButton,
    Tooltip,
    Avatar,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import apiConfig from "../../config/apiConfig";
import SnackbarAlert from "../../components/SnackbarAlert";
import EditIcon from "@mui/icons-material/Edit";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";

const AdminProfile = () => {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        mobile: "",
    });
    const [originalProfile, setOriginalProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const [snack, setSnack] = useState({
        open: false,
        severity: "success",
        message: "",
    });

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

    // Get user ID from token
    const getUserId = () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return null;
            const decoded = jwtDecode(token);
            return decoded.id || decoded.user_id || decoded.sub;
        } catch {
            return null;
        }
    };

    const userId = getUserId();

    // Fetch user details
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get(
                    apiConfig.GET_USER_DETAILS(userId),
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                // Use res.data.data for user details
                const user = res.data.data || { name: "", email: "", mobile: "" };
                setProfile({
                    name: user.name || "",
                    email: user.email || "",
                    mobile: user.mobile || "",
                });
                setOriginalProfile({
                    name: user.name || "",
                    email: user.email || "",
                    mobile: user.mobile || "",
                });
            } catch (e) {
                setSnack({
                    open: true,
                    severity: "error",
                    message: "Failed to load profile.",
                });
            }
            setLoading(false);
        };
        if (userId) fetchProfile();
    }, [userId]);

    // Handle form changes
    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    // Handle update
    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(
                apiConfig.UPDATE_USER_DETAILS(userId),
                profile,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setSnack({
                open: true,
                severity: "success",
                message: "Profile updated successfully.",
            });
            setEditing(false);
            setOriginalProfile(profile);
        } catch {
            setSnack({
                open: true,
                severity: "error",
                message: "Failed to update profile.",
            });
        }
        setSaving(false);
    };

    // Handle cancel
    const handleCancel = () => {
        setProfile(originalProfile);
        setEditing(false);
    };

    // Helper to get initials for Avatar
    const getInitials = (name) => {
        if (!name) return "";
        const names = name.split(" ");
        return names.map((n) => n[0]).join("").toUpperCase();
    };

    return (
        <>
            <SnackbarAlert
                open={snack.open}
                onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
                severity={snack.severity}
                message={snack.message}
            />
            <Stack
                direction={isSmallScreen ? "column" : "row"}
                spacing={4}
                maxWidth={600}
                mt={6}
                mx="auto"
                alignItems={isSmallScreen ? "center" : "flex-start"}
                justifyContent="center"
            >
                {isSmallScreen ? (
                    // Small screens: Avatar on top, details centered
                    <>
                        <Stack
                            alignItems="center"
                            justifyContent="center"
                            flex={1}
                            width="100%"
                            mb={2}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: deepPurple[500],
                                    width: 120,
                                    height: 120,
                                    fontSize: 48,
                                }}
                            >
                                {getInitials(profile.name)}
                            </Avatar>
                        </Stack>
                        <Stack
                            spacing={2}
                            flex={2}
                            minWidth="100%"
                            alignItems="center"
                            sx={{ textAlign: "center" }}
                        >
                            {loading && !isSmallScreen ? (
                                <CircularProgress />
                            ) : !editing ? (
                                <>
                                    <Stack direction="row" alignItems="center" spacing={1} justifyContent="center">
                                        <Typography variant="h5" fontWeight={700}>
                                            {profile.name}
                                        </Typography>
                                        <Tooltip title="Admin Verified">
                                            <VerifiedUserIcon color="primary" fontSize="medium" />
                                        </Tooltip>
                                        <IconButton
                                            aria-label="Edit"
                                            onClick={() => setEditing(true)}
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Stack>
                                    <div>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Email
                                        </Typography>
                                        <Typography variant="body1">{profile.email}</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Mobile
                                        </Typography>
                                        <Typography variant="body1">{profile.mobile}</Typography>
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={handleUpdate}>
                                    <Stack spacing={2}>
                                        <TextField
                                            label="Name"
                                            name="name"
                                            value={profile.name}
                                            onChange={handleChange}
                                            required
                                            fullWidth
                                        />
                                        <TextField
                                            label="Email"
                                            name="email"
                                            value={profile.email}
                                            onChange={handleChange}
                                            required
                                            fullWidth
                                            type="email"
                                        />
                                        <TextField
                                            label="Mobile"
                                            name="mobile"
                                            value={profile.mobile}
                                            onChange={handleChange}
                                            required
                                            fullWidth
                                        />
                                        <Stack direction="row" spacing={2} justifyContent="center">
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                disabled={saving}
                                            >
                                                {saving ? "Saving..." : "Save"}
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={handleCancel}
                                                disabled={saving}
                                            >
                                                Cancel
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </form>
                            )}
                        </Stack>
                    </>
                ) : (
                    // Large screens: Details left, avatar right
                    <>
                        <Stack spacing={2} flex={2} minWidth={0}>
                            {loading && !isSmallScreen ? (
                                <CircularProgress />
                            ) : !editing ? (
                                <>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Typography variant="h5" fontWeight={700}>
                                            {profile.name}
                                        </Typography>
                                        <Tooltip title="Admin Verified">
                                            <VerifiedUserIcon color="primary" fontSize="medium" />
                                        </Tooltip>
                                        <IconButton
                                            aria-label="Edit"
                                            onClick={() => setEditing(true)}
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </Stack>
                                    <div>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Email
                                        </Typography>
                                        <Typography variant="body1">{profile.email}</Typography>
                                    </div>
                                    <div>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            Mobile
                                        </Typography>
                                        <Typography variant="body1">{profile.mobile}</Typography>
                                    </div>
                                </>
                            ) : (
                                <form onSubmit={handleUpdate}>
                                    <Stack spacing={2}>
                                        <TextField
                                            label="Name"
                                            name="name"
                                            value={profile.name}
                                            onChange={handleChange}
                                            required
                                            fullWidth
                                        />
                                        <TextField
                                            label="Email"
                                            name="email"
                                            value={profile.email}
                                            onChange={handleChange}
                                            required
                                            fullWidth
                                            type="email"
                                        />
                                        <TextField
                                            label="Mobile"
                                            name="mobile"
                                            value={profile.mobile}
                                            onChange={handleChange}
                                            required
                                            fullWidth
                                        />
                                        <Stack direction="row" spacing={2}>
                                            <Button
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                disabled={saving}
                                            >
                                                {saving ? "Saving..." : "Save"}
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="secondary"
                                                onClick={handleCancel}
                                                disabled={saving}
                                            >
                                                Cancel
                                            </Button>
                                        </Stack>
                                    </Stack>
                                </form>
                            )}
                        </Stack>
                        <Stack
                            alignItems="center"
                            justifyContent="center"
                            flex={1}
                            width={160}
                            mt={0}
                        >
                            <Avatar
                                sx={{
                                    bgcolor: deepPurple[500],
                                    width: 120,
                                    height: 120,
                                    fontSize: 48,
                                }}
                            >
                                {getInitials(profile.name)}
                            </Avatar>
                        </Stack>
                    </>
                )}
            </Stack>
        </>
    );
};

export default AdminProfile;