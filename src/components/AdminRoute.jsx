import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Check if user is logged in
  if (!token || !user) {
    // Not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Check if user is an admin
  if (user.role !== 'admin') {
    // Logged in but NOT an admin, redirect to their dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // User is logged in AND is an admin
  return children;
}

export default AdminRoute;