import React from 'react';
import { Navigate } from 'react-router-dom';

function ManagerRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!token || !user) return <Navigate to="/login" replace />;

  // Allow Admin OR Warden
  if (user.role === 'admin' || user.role === 'warden') {
    return children;
  }

  return <Navigate to="/dashboard" replace />;
}

export default ManagerRoute;
