import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, BedDouble, AlertCircle, DollarSign, CreditCard, Settings, User, ShoppingBag, Building2, Lock } from 'lucide-react';
import apiClient from '../api/axios';

const StudentSidebar = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const navigate = useNavigate();
  const [hasBooking, setHasBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkBookingStatus = async () => {
      try {
        const response = await apiClient.get('/bookings/status');
        setHasBooking(response.data.hasBooking);
      } catch (error) {
        console.error('Error checking booking status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkBookingStatus();

    // Listen for booking completion event
    const handleBookingComplete = () => {
      setHasBooking(true);
    };

    window.addEventListener('bookingCompleted', handleBookingComplete);

    return () => {
      window.removeEventListener('bookingCompleted', handleBookingComplete);
    };
  }, []);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, requiresBooking: false },
    { name: 'My Booking', path: '/my-booking', icon: BedDouble, requiresBooking: false },
    { name: 'Maintenance', path: '/student/complaints', icon: AlertCircle, requiresBooking: true },
    { name: 'My Dues', path: '/student/dues', icon: DollarSign, requiresBooking: true },
    { name: 'Payment History', path: '/student/payments', icon: CreditCard, requiresBooking: true },
    { name: 'Services', path: '/student/services', icon: ShoppingBag, requiresBooking: true },
    { name: 'Profile', path: '/my-profile', icon: User, requiresBooking: true },
  ];

  return (
    <div className="w-64 bg-slate-900 min-h-screen border-r border-slate-800 flex flex-col">
      {/* Logo / Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center`}>
            <Building2 className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">HostelHub</h1>
            <p className="text-xs text-slate-400">Student Portal</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6 px-4">
        {!hasBooking && !isLoading && (
          <div className="mb-4 px-4 py-3 bg-amber-900/30 border border-amber-600/50 rounded-lg">
            <div className="flex items-start gap-2">
              <Lock size={16} className="text-amber-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-400">Book a Room First</p>
                <p className="text-xs text-amber-300/70 mt-1">
                  Complete your room booking to unlock all features
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isLocked = item.requiresBooking && !hasBooking;

            if (isLocked) {
              return (
                <div
                  key={item.path}
                  className="flex items-center justify-between px-4 py-3 rounded-lg text-slate-500 cursor-not-allowed opacity-50 relative group"
                  title="Complete your booking to unlock this feature"
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="flex-shrink-0" />
                    <span className="font-medium text-sm">{item.name}</span>
                  </div>
                  <Lock size={14} className="text-slate-600" />
                  
                  {/* Tooltip */}
                  <div className="absolute left-full ml-2 px-3 py-2 bg-slate-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                    🔒 Book a room first to access this
                  </div>
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                    isActive
                      ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="font-medium text-sm">{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* User Info Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-700 text-white rounded-full flex items-center justify-center font-bold">
            {(user.username || 'S').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user.username || 'Student'}
            </p>
            <p className="text-xs text-slate-400">Student</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar;
