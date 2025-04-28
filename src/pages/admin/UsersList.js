import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import apiConfig from "../../config/apiConfig";
import axios from "axios";
import { Box, Typography, Alert, Stack, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useLocation, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import Fab from "@mui/material/Fab";
import { ROUTES } from "../../constants/routes";
import SnackbarAlert from "../../components/SnackbarAlert";
import ConfirmDialog from "../../components/ConfirmDialog";
import { STRINGS } from "../../constants/strings";

const columns = [
  { field: "id", headerName: "ID" },
  { field: "name", headerName: "Name" },
  { field: "email", headerName: "Email" },
  { field: "mobile", headerName: "Mobile" },
  { field: "role", headerName: "Role" },
  { field: "status", headerName: "Status" },
  { field: "", headerName: "Actions" },
];

const statusOptions = [
  { value: "", label: "All" },
  { value: "1", label: "Active" },
  { value: "0", label: "Disabled" },
  { value: "-1", label: "Deleted" },
];

const statusMap = {
  1: "Active",
  0: "Disabled",
  "-1": "Deleted",
  Active: "Active",
  Disabled: "Disabled",
  Deleted: "Deleted",
};

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const location = useLocation();
  const navigate = useNavigate();
  const [snack, setSnack] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const params = new URLSearchParams(location.search);
  const status = params.get("status") ?? "";

  const handleStatusChange = (newStatus) => {
    const params = new URLSearchParams(location.search);
    if (newStatus !== "" && newStatus !== null && newStatus !== undefined) {
      params.set("status", newStatus);
    } else {
      params.delete("status");
    }
    navigate(
      { pathname: location.pathname, search: params.toString() },
      { replace: true }
    );
  };

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const params = {};
      if (search) params.search = search;
      if (status !== "" && status !== null && status !== undefined) {
        params.status = parseInt(status, 10);
      }
      const response = await axios.get(apiConfig.USERS_LIST, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });
      let usersArr = [];
      if (Array.isArray(response.data.users)) {
        usersArr = response.data.users;
      } else if (
        response.data.users &&
        typeof response.data.users === "object"
      ) {
        usersArr = Object.values(response.data.users);
      }
      usersArr = usersArr.map((u) => ({
        ...u,
        status: statusMap[u.status] || u.status,
      }));
      setUsers(usersArr);
    } catch (err) {
      setError("Failed to fetch users.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [search, status]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (row) => {
    navigate();
  };

  const handleDelete = (row) => {
    setRowToDelete(row);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        apiConfig.DELETE_USER(rowToDelete.id),
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUsers();
      setSnack({
        open: true,
        severity: "success",
        message: response.data?.message || "User deleted successfully.",
      });
    } catch (err) {
      setError("Failed to delete user.");
      setSnack({
        open: true,
        severity: "error",
        message: err.response?.data?.message || "Failed to delete user.",
      });
    }
    setDeleteLoading(false);
    setConfirmOpen(false);
    setRowToDelete(null);
  };

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Typography variant="h5">User List</Typography>
        <IconButton
          aria-label="refresh"
          onClick={fetchUsers}
          disabled={loading}
          size="large"
        >
          <RefreshIcon />
        </IconButton>
      </Stack>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <DataTable
        data={users}
        loading={loading}
        columns={columns}
        onSearch={setSearch}
        onStatusFilter={handleStatusChange}
        searchValue={search}
        statusValue={status}
        statusType="user"
        statusField="status"
        statusOptions={statusOptions}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Floating Add User Button */}
      <Fab
        color="primary"
        aria-label="add"
        sx={{
          position: "fixed",
          bottom: { xs: 24, md: 32 },
          right: { xs: 24, md: 32 },
          zIndex: 1201,
        }}
        onClick={() => navigate(ROUTES.ADMIN_USERS_ADD)}
      >
        <AddIcon />
      </Fab>
      <SnackbarAlert
        open={snack.open}
        onClose={() => setSnack((prev) => ({ ...prev, open: false }))}
        severity={snack.severity}
        message={snack.message}
      />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete User"
        content={STRINGS.CONFIRM_DELETE_USER_CONTENT(rowToDelete?.name)}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
      />
    </Box>
  );
};

export default UsersList;
