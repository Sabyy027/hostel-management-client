import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyBooking from "./pages/MyBooking"; // <-- 1. Import

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import HostelManager from "./pages/admin/HostelManager";
import OccupancyDashboard from "./pages/admin/OccupancyDashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* --- Protected Route (for ALL users) --- */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              {" "}
              <Dashboard />{" "}
            </ProtectedRoute>
          }
        />

        {/* --- Admin-Only Route --- */}

        {/* --- Student-Only Routes (for now, accessible by all logged-in) --- */}
        <Route
          path="/my-profile"
          element={
            <ProtectedRoute>
              {" "}
              <Profile />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-booking"
          element={
            <ProtectedRoute>
              {" "}
              <MyBooking />{" "}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/structure"
          element={
            <AdminRoute>
              {" "}
              <HostelManager />{" "}
            </AdminRoute>
          }
        />

        <Route
          path="/admin/occupancy"
          element={
            <AdminRoute>
              {" "}
              <OccupancyDashboard />{" "}
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
