import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BedDouble, 
  Users, 
  Wrench, 
  CreditCard, 
  BarChart3,
  Building2,
  UserCog,
  DollarSign,
  Receipt,
  TrendingUp,
  Megaphone,
  User
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isWarden = user.role === 'warden' || user.role === 'rt';

  // Warden/Resident Tutor: Only Dashboard, Residents, Occupancy, Maintenance
  const wardenMenuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: LayoutDashboard,
      color: 'teal'
    },
    { 
      label: 'Residents', 
      path: '/admin/residents', 
      icon: Users,
      color: 'teal'
    },
    { 
      label: 'Occupancy', 
      path: '/admin/occupancy', 
      icon: BedDouble,
      color: 'cyan'
    },
    { 
      label: 'Maintenance', 
      path: '/admin/maintenance', 
      icon: Wrench,
      color: 'amber'
    },
    { 
      label: 'Announcements', 
      path: '/admin/announcements', 
      icon: Megaphone,
      color: 'pink'
    },
    { 
      label: 'My Profile', 
      path: '/admin/profile', 
      icon: User,
      color: 'teal'
    },
  ];

  // Admin: Full Access
  const adminMenuItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: LayoutDashboard,
      color: 'indigo'
    },
    { 
      label: 'Rooms', 
      path: '/admin/structure', 
      icon: BedDouble,
      color: 'purple'
    },
    { 
      label: 'Residents', 
      path: '/admin/residents', 
      icon: Users,
      color: 'teal'
    },
    {
      label: 'Occupancy',
      path: '/admin/occupancy',
      icon: Building2,
      color: 'cyan'
    },
    {
      label: 'Staff',
      path: '/admin/staff',
      icon: UserCog,
      color: 'blue'
    },
    { 
      label: 'Maintenance', 
      path: '/admin/maintenance', 
      icon: Wrench,
      color: 'amber'
    },
    { 
      label: 'Announcements', 
      path: '/admin/announcements', 
      icon: Megaphone,
      color: 'pink'
    },
    { 
      label: 'Billing', 
      path: '/admin/billing-tools', 
      icon: CreditCard,
      color: 'emerald'
    },
    {
      label: 'Expenses',
      path: '/admin/expenses',
      icon: DollarSign,
      color: 'orange'
    },
    { 
      label: 'Reports', 
      path: '/admin/reports', 
      icon: BarChart3,
      color: 'blue'
    },
  ];

  const adminSecondaryItems = [];

  // Select menu based on role
  const menuItems = isWarden ? wardenMenuItems : adminMenuItems;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-slate-900 h-screen border-r border-slate-800 flex flex-col fixed left-0 top-0">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${isWarden ? 'bg-teal-600' : 'bg-indigo-600'} rounded-lg flex items-center justify-center`}>
            <Building2 className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">HMS</h1>
            <p className="text-xs text-slate-400">
              {isWarden ? (user.role === 'rt' ? 'Resident Tutor Portal' : 'Warden Portal') : 'Admin Portal'}
            </p>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                  active
                    ? `${isWarden ? 'bg-teal-600 shadow-lg shadow-teal-500/30' : 'bg-indigo-600 shadow-lg shadow-indigo-500/30'} text-white`
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

      {/* User Info Footer - Only for Warden/RT */}
      {isWarden && (
        <div className="p-4 border-t border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            {user.photoUrl ? (
              <img
                src={user.photoUrl}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border-2 border-teal-500"
              />
            ) : (
              <div className="w-10 h-10 bg-teal-600 text-white rounded-full flex items-center justify-center font-bold">
                {(user.username || 'U').charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user.username || 'User'}
              </p>
              <p className="text-xs text-slate-400 capitalize">{user.role === 'rt' ? 'Resident Tutor' : user.role || 'Staff'}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSidebar;
