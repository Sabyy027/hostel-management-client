import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import apiClient from '../api/axios';

const BookingRequiredRoute = ({ children }) => {
  const [hasBooking, setHasBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBookingStatus = async () => {
      try {
        const response = await apiClient.get('/bookings/status');
        setHasBooking(response.data.hasBooking);
      } catch (error) {
        console.error('Error checking booking status:', error);
        setHasBooking(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkBookingStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-slate-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!hasBooking) {
    return <Navigate to="/my-booking" replace />;
  }

  return children;
};

export default BookingRequiredRoute;
