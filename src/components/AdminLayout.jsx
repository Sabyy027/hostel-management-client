import React, { useState } from 'react';
import AdminSidebar from './AdminSidebar';
import NotificationBell from './NotificationBell';
import AIChatbot from './AIChatbot';
import MobileMenu from './MobileMenu';
import { Bell, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Get role display name - use designation field from backend
  const getRoleDisplayName = () => {
    // If designation exists, use it (e.g., "Warden", "Resident Tutor")
    if (user.designation) return user.designation;
    
    // Fallback to role-based display
    if (user.role === 'resident tutor') return 'Resident Tutor';
    if (user.role === 'warden') return 'Warden';
    if (user.role === 'admin') return 'Admin';
    if (user.role === 'staff') return 'Staff';
    return 'User';
  };

  // Get display name - if user.name is "Warden" or matches role, use username or role display name
  const getDisplayName = () => {
    if (user.name && user.name.toLowerCase() !== 'warden' && user.name.toLowerCase() !== 'resident tutor' && user.name.toLowerCase() !== 'admin') {
      return user.name;
    }
    return user.username || getRoleDisplayName();
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar - Always visible on desktop */}
      <div className="hidden lg:block">
        <AdminSidebar />
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
              <Menu size={20} />
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
            {/* Notifications */}
            <NotificationBell />

            {/* User Profile - Hidden on small mobile */}
            <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-semibold text-slate-800">{getDisplayName()}</p>
                <p className="text-xs text-slate-500">{getRoleDisplayName()}</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">
                {getDisplayName().charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Mobile Profile Avatar */}
            <div className="sm:hidden w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold text-sm">
              {getDisplayName().charAt(0).toUpperCase()}
            </div>

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
      <MobileMenu 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
        userRole={user.role}
      />

      {/* AI Chatbot - Available for admins */}
      <AIChatbot />
    </div>
  );
};

export default AdminLayout;
