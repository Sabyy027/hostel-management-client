import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import ProfileDropdown from './ProfileDropdown';
import AIChatbot from './AIChatbot';
import { 
  LayoutDashboard, 
  Wrench,
  Building2,
  LogOut,
  Bell,
  User,
  Menu,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StaffLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const menuItems = [
    { 
      label: 'My Tasks', 
      path: '/staff/dashboard', 
      icon: Wrench,
      color: 'amber'
    },
    { 
      label: 'My Profile', 
      path: '/staff/profile', 
      icon: User,
      color: 'amber'
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900 h-screen border-r border-slate-800 flex flex-col transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Building2 className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">HMS</h1>
              <p className="text-xs text-slate-400">Staff Portal</p>
            </div>
          </div>
        </div>

        {/* Main Menu */}
        <div className="flex-1 py-6 px-4 overflow-y-auto">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                    active
                      ? 'bg-amber-600 text-white shadow-lg shadow-amber-500/30'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon 
                    size={20} 
                    className={active ? 'text-white' : `text-${item.color}-400 group-hover:text-${item.color}-300`}
                  />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* User Info Footer */}
        <div className="p-4 border-t border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-500"
              />
            ) : (
              <div className="w-10 h-10 bg-amber-600 text-white rounded-full flex items-center justify-center font-bold">
                {(user.username || 'S').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user.username || 'Staff'}
              </p>
              <p className="text-xs text-slate-400">{user.designation || 'Staff Member'}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:ml-64 overflow-hidden w-full">
        {/* Top Bar */}
        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                Welcome back, <span className="hidden sm:inline">{user.name || user.username || 'Staff'}</span><span className="sm:hidden">{(user.name || user.username || 'Staff').split(' ')[0]}</span>
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

            {/* User Profile Dropdown */}
            <ProfileDropdown user={user} roleColor="amber" />

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

      {/* AI Chatbot - Available for staff */}
      <AIChatbot />
    </div>
  );
};

export default StaffLayout;
