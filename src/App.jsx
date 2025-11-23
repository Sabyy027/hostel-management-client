import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import MyBooking from "./pages/MyBooking"; // <-- 1. Import

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ManagerRoute from "./components/ManagerRoute";
import BookingRequiredRoute from "./components/BookingRequiredRoute";
import HostelManager from "./pages/admin/HostelManager";
import OccupancyDashboard from "./pages/admin/OccupancyDashboard";
import StaffManager from "./pages/admin/StaffManager";
import MaintenanceAdmin from "./pages/admin/MaintenanceAdmin";
import RaiseComplaint from "./pages/student/RaiseComplaint";
import StudentServices from "./pages/student/StudentServices";
import PaymentHistory from "./pages/student/PaymentHistory";
import MyDues from "./pages/student/MyDues";
import StaffRoute from "./components/StaffRoute";
import StaffDashboard from "./pages/staff/StaffDashboard";
import StaffProfile from "./pages/staff/StaffProfile";
import ReportsDashboard from "./pages/admin/ReportsDashboard";
import StaffRegister from "./pages/StaffRegister";
import ChangePassword from "./pages/ChangePassword";
import ResidentManager from "./pages/admin/ResidentManager";
import BillingDashboard from "./pages/admin/BillingDashboard";
import ExpenseManager from "./pages/admin/ExpenseManager";
import AnnouncementManager from "./pages/admin/AnnouncementManager";
import WardenProfile from "./pages/admin/WardenProfile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Public Routes --- */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route
          path="/change-password"
          element={
            <ProtectedRoute>
              <ChangePassword />
            </ProtectedRoute>
          }
        />

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
              <BookingRequiredRoute>
                <Profile />
              </BookingRequiredRoute>
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
        {/* --- WARDEN & ADMIN SHARED PAGES --- */}
        <Route
          path="/admin/residents"
          element={
            <ManagerRoute>
              <ResidentManager />
            </ManagerRoute>
          }
        />
        <Route
          path="/admin/occupancy"
          element={
            <ManagerRoute>
              <OccupancyDashboard />
            </ManagerRoute>
          }
        />
        <Route
          path="/admin/maintenance"
          element={
            <ManagerRoute>
              <MaintenanceAdmin />
            </ManagerRoute>
          }
        />
        <Route
          path="/admin/announcements"
          element={
            <ManagerRoute>
              <AnnouncementManager />
            </ManagerRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <ManagerRoute>
              <WardenProfile />
            </ManagerRoute>
          }
        />

        {/* --- ADMIN ONLY (Keep as AdminRoute) --- */}
        <Route
          path="/admin/structure"
          element={
            <AdminRoute>
              <HostelManager />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/staff"
          element={
            <AdminRoute>
              <StaffManager />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/billing-tools"
          element={
            <AdminRoute>
              <BillingDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <AdminRoute>
              <ReportsDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/expenses"
          element={
            <AdminRoute>
              <ExpenseManager />
            </AdminRoute>
          }
        />

        {/* STUDENT ROUTES - Require Booking */}
        <Route
          path="/student/complaints"
          element={
            <ProtectedRoute>
              <BookingRequiredRoute>
                <RaiseComplaint />
              </BookingRequiredRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/services"
          element={
            <ProtectedRoute>
              <BookingRequiredRoute>
                <StudentServices />
              </BookingRequiredRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/payments"
          element={
            <ProtectedRoute>
              <BookingRequiredRoute>
                <PaymentHistory />
              </BookingRequiredRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/dues"
          element={
            <ProtectedRoute>
              <BookingRequiredRoute>
                <MyDues />
              </BookingRequiredRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff/dashboard"
          element={
            <StaffRoute>
              <StaffDashboard />
            </StaffRoute>
          }
        />
        <Route
          path="/staff/profile"
          element={
            <StaffRoute>
              <StaffProfile />
            </StaffRoute>
          }
        />
        <Route path="/staff-register" element={<StaffRegister />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
