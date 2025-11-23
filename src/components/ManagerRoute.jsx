import React from 'react';
import { Navigate } from 'react-router-dom';

function ManagerRoute({ children }) {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!token || !user) return <Navigate to="/login" replace />;

  // Allow Admin, Warden, or RT
  const isAdmin = user.role === 'admin';
  const isWarden = user.role === 'warden';
  const isRT = user.role === 'rt';
  
  if (isAdmin || isWarden || isRT) {
    return children;
  }

  return <Navigate to="/dashboard" replace />;
}

export default ManagerRoute;
