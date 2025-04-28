// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Profile from "./pages/user/Profile";
import AdminLayout from "./components/AdminLayout";
import UsersList from "./pages/admin/UsersList";
import AddUser from "./pages/admin/AddUser";
import { ROUTES } from "./constants/routes"; // Import ROUTES from constants
import Register from "./pages/Register"; // Import the Register page
import PrivateRoute from "./components/PrivateRoute"; // Import the PrivateRoute
import AdminProfile from "./pages/admin/AdminProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />

        {/* Protected Admin routes */}
        <Route
          element={
            <PrivateRoute>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.USERS_LIST} element={<UsersList />} />
          <Route path={ROUTES.ADMIN_USERS_ADD} element={<AddUser />} />
          <Route path={ROUTES.ADMIN_USERS} element={<UsersList />} />
          <Route path={ROUTES.ADMIN_USERS} element={<UsersList />} />
          <Route path={ROUTES.ADMIN_PROFILE} element={<AdminProfile />} />
          <Route
            path={ROUTES.ADMIN_SETTINGS}
            element={
              <div>
                <h2>Admin Settings</h2>
                <p>This page is under construction</p>
              </div>
            }
          />
        </Route>

        {/* User profile route (if protected, wrap with PrivateRoute as well) */}
        <Route
          path={ROUTES.USER_PROFILE}
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
