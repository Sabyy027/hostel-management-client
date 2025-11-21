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
  TrendingUp
} from 'lucide-react';

const AdminSidebar = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isWarden = user.role === 'warden' || user.role === 'resident tutor';

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
      label: 'Maintenance', 
      path: '/admin/maintenance', 
      icon: Wrench,
      color: 'amber'
    },
    { 
      label: 'Billing', 
      path: '/admin/billing-tools', 
      icon: CreditCard,
      color: 'emerald'
    },
    { 
      label: 'Reports', 
      path: '/admin/reports', 
      icon: BarChart3,
      color: 'blue'
    },
  ];

  const adminSecondaryItems = [
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
      label: 'Expenses',
      path: '/admin/expenses',
      icon: DollarSign,
      color: 'orange'
    },
  ];

  // Select menu based on role
  const menuItems = isWarden ? wardenMenuItems : adminMenuItems;
  const secondaryItems = isWarden ? [] : adminSecondaryItems;

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-slate-900 min-h-screen border-r border-slate-800 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${isWarden ? 'bg-teal-600' : 'bg-indigo-600'} rounded-lg flex items-center justify-center`}>
            <Building2 className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">HostelFlow</h1>
            <p className="text-xs text-slate-400">
              {isWarden ? (user.designation ? `${user.designation} Portal` : 'Warden Portal') : 'Management System'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="flex-1 py-6 px-4">
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

        {/* Secondary Menu - Only for Admin */}
        {!isWarden && secondaryItems.length > 0 && (
          <div className="mt-8">
            <div className="px-4 mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Quick Access
              </p>
            </div>
            <div className="space-y-1">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all text-sm ${
                      active
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSidebar;
