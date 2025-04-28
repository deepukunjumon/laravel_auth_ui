import React, { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import apiConfig from "../../config/apiConfig";
import axios from "axios";
import { Box, Typography, Alert, Stack, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useLocation, useNavigate } from "react-router-dom";

const columns = [
  { field: "id", headerName: "ID" },
  { field: "name", headerName: "Name" },
  { field: "email", headerName: "Email" },
  { field: "mobile", headerName: "Mobile" },
  { field: "role", headerName: "Role" },
  { field: "status", headerName: "Status" },
  { field: "created_at", headerName: "Created At" },
];

const statusOptions = [
  { value: "", label: "All" },
  { value: 1, label: "Active" },
  { value: 0, label: "Disabled" },
  { value: -1, label: "Deleted" },
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
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const location = useLocation();
  const navigate = useNavigate();

  // Effect: Sync status state with query string (but only if different)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusParam = params.get("status");
    // Only update state if different
    if ((statusParam || "") !== (status || "")) {
      setStatus(statusParam || "");
    }
    // eslint-disable-next-line
  }, [location.search]);

  // When status changes (from dropdown), update the query string if different
  const handleStatusChange = (newStatus) => {
    if ((newStatus || "") !== (status || "")) {
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
      // setStatus will be handled by the effect above
    }
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
    // eslint-disable-next-line
  }, [search, status]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
      />
    </Box>
  );
};

export default UsersList;
