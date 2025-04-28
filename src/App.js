// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/admin/Dashboard";
import Profile from "./pages/user/Profile";
import AdminLayout from "./components/AdminLayout";
import UsersList from "./pages/admin/UsersList";
import { ROUTES } from "./constants/routes"; // Import ROUTES from constants

function App() {
  return (
    <Router>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<Login />} />

        {/* Admin routes with AdminLayout */}
        <Route element={<AdminLayout />}>
          <Route path={ROUTES.ADMIN_DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.USERS_LIST} element={<UsersList />} />
          <Route
            path={ROUTES.ADMIN_USERS}
            element={
              <div>
                <h2>User Management</h2>
                <p>This page is under construction</p>
              </div>
            }
          />
          <Route
            path={ROUTES.ADMIN_SETTINGS}
            element={
              <div>
                <h2>Admin Settings</h2>
                <p>This page is under construction</p>
              </div>
            }
          />
          <Route
            path={ROUTES.ADMIN_PROFILE}
            element={
              <div>
                <h2>Admin Profile</h2>
                <p>This page is under construction</p>
              </div>
            }
          />
        </Route>

        <Route path={ROUTES.USER_PROFILE} element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;
