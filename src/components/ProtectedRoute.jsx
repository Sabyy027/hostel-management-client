import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const hasBooking = localStorage.getItem('hasBooking') === 'true';
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Redirect students without booking to My Booking page (except if already there)
  if (user.role === 'student' && !hasBooking && location.pathname !== '/my-booking') {
    return <Navigate to="/my-booking" replace />;
  }

  return children;
}

export default ProtectedRoute;