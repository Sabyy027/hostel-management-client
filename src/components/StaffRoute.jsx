import React from 'react';
import { Navigate } from 'react-router-dom';

function StaffRoute({ children }) {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Allow 'staff' AND 'admin' (Admins might want to view it for testing)
  if (user.role !== 'staff' && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default StaffRoute;