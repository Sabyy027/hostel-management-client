import React from 'react';
import { Navigate } from 'react-router-dom';

function ManagerRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!token || !user) return <Navigate to="/login" replace />;

  // Allow Admin, Warden, OR Resident Tutor
  if (user.role === 'admin' || user.role === 'warden' || user.role === 'resident tutor') {
    return children;
  }

  return <Navigate to="/dashboard" replace />;
}

export default ManagerRoute;
