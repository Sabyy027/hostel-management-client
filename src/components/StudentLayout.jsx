import React, { useState } from 'react';
import StudentSidebar from './StudentSidebar';
import NotificationBell from './NotificationBell';
import ProfileDropdown from './ProfileDropdown';
import AIChatbot from './AIChatbot';
import StudentMobileMenu from './StudentMobileMenu';
import { Bell, LogOut, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentLayout = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const hasBooking = localStorage.getItem('hasBooking') === 'true';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('hasBooking');
    navigate('/login');
  };

  const getDisplayName = () => {
    if (user.name) return user.name;
    return user.username || 'Student';
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar - Always visible on desktop */}
      <div className="hidden lg:block">
        <StudentSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64 overflow-hidden w-full">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Three-Dot Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors relative"
              aria-label="Open menu"
            >
              <MoreVertical size={20} />
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Welcome back, <span className="hidden sm:inline">{getDisplayName()}</span><span className="sm:hidden">{getDisplayName().split(' ')[0]}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 hidden sm:block">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              <p className="text-xs text-slate-500 sm:hidden">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications - Only visible after booking */}
            {hasBooking && <NotificationBell />}

            {/* User Profile Dropdown */}
            <ProfileDropdown user={user} roleColor="indigo" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <StudentMobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)}
        hasBooking={hasBooking}
      />

      {/* AI Chatbot - Available only after booking */}
      {hasBooking && <AIChatbot />}
    </div>
  );
};

export default StudentLayout;
