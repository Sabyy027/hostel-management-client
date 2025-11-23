import React from 'react';
import StudentSidebar from './StudentSidebar';
import NotificationBell from './NotificationBell';
import ProfileDropdown from './ProfileDropdown';
import AIChatbot from './AIChatbot';
import { Bell, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StudentLayout = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const hasBooking = localStorage.getItem('hasBooking') === 'true';

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
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              Welcome back, {getDisplayName()}
            </h2>
            <p className="text-sm text-slate-500">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>

          <div className="flex items-center gap-4">
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
        <div className="flex-1 p-8 overflow-y-auto">
          {children}
        </div>
      </div>

      {/* AI Chatbot - Available only after booking */}
      {hasBooking && <AIChatbot />}
    </div>
  );
};

export default StudentLayout;
