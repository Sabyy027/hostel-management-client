import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  Megaphone,
  User,
  ChevronDown,
  ChevronRight,
  X,
  LogOut
} from 'lucide-react';

const MobileMenu = ({ isOpen, onClose, userRole }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isWarden = userRole === 'warden' || userRole === 'rt';
  const [expandedSections, setExpandedSections] = useState({});

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onClose();
    navigate('/login');
  };

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

  // Select menu based on role
  const menuItems = isWarden ? wardenMenuItems : adminMenuItems;

  const isActive = (path) => location.pathname === path;

  // Organize menu items into sections
  const menuSections = isWarden ? [
    {
      title: 'Overview',
      items: wardenMenuItems.filter(item => item.path === '/dashboard')
    },
    {
      title: 'Management',
      items: wardenMenuItems.filter(item => ['/admin/residents', '/admin/occupancy'].includes(item.path))
    },
    {
      title: 'Operations',
      items: wardenMenuItems.filter(item => ['/admin/maintenance', '/admin/announcements'].includes(item.path))
    },
    {
      title: 'Profile',
      items: wardenMenuItems.filter(item => item.path === '/admin/profile')
    }
  ] : [
    {
      title: 'Overview',
      items: adminMenuItems.filter(item => item.path === '/dashboard')
    },
    {
      title: 'Management',
      items: adminMenuItems.filter(item => ['/admin/structure', '/admin/residents', '/admin/occupancy', '/admin/staff'].includes(item.path))
    },
    {
      title: 'Operations',
      items: adminMenuItems.filter(item => ['/admin/maintenance', '/admin/announcements'].includes(item.path))
    },
    {
      title: 'Financial',
      items: adminMenuItems.filter(item => ['/admin/billing-tools', '/admin/expenses', '/admin/reports'].includes(item.path))
    }
  ];

  const toggleSection = (sectionTitle) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50 lg:hidden"
        onClick={onClose}
      />

      {/* Menu Dropdown */}
      <div className="fixed top-16 right-4 z-50 lg:hidden w-[calc(100vw-2rem)] max-w-sm bg-white rounded-xl shadow-2xl border border-slate-200 max-h-[calc(100vh-5rem)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${isWarden ? 'bg-teal-600' : 'bg-indigo-600'} rounded-lg flex items-center justify-center`}>
              <Building2 className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">HMS</h3>
              <p className="text-xs text-slate-500">
                {isWarden ? (userRole === 'rt' ? 'Resident Tutor' : 'Warden') : 'Admin'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-2">
            {menuSections.map((section) => {
              const isExpanded = expandedSections[section.title] ?? true;
              const hasActiveItem = section.items.some(item => isActive(item.path));
              
              return (
                <div key={section.title} className="space-y-1">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.title)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                      hasActiveItem 
                        ? `${isWarden ? 'bg-teal-50 text-teal-700' : 'bg-indigo-50 text-indigo-700'}`
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-semibold text-xs uppercase tracking-wider">{section.title}</span>
                    {isExpanded ? (
                      <ChevronDown size={16} className="text-slate-400" />
                    ) : (
                      <ChevronRight size={16} className="text-slate-400" />
                    )}
                  </button>

                  {/* Section Items */}
                  {isExpanded && (
                    <div className="space-y-1 pl-2">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        
                        return (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                              active
                                ? `${isWarden ? 'bg-teal-600 text-white' : 'bg-indigo-600 text-white'} shadow-sm`
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <Icon 
                              size={18} 
                              className={active ? 'text-white' : `text-${item.color}-600`}
                            />
                            <span className="font-medium text-sm">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer - Logout */}
        <div className="p-3 border-t border-slate-200 bg-slate-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium text-sm"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default MobileMenu;

