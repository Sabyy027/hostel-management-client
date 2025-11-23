import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Home, BedDouble, AlertCircle, DollarSign, CreditCard, User, ShoppingBag, Building2, Lock, ChevronDown, ChevronRight, X, LogOut } from 'lucide-react';

const StudentMobileMenu = ({ isOpen, onClose, hasBooking }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [expandedSections, setExpandedSections] = useState({});

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('hasBooking');
    onClose();
    navigate('/login');
  };

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home, requiresBooking: true, showOnlyWhenNoBooking: false, section: 'Overview' },
    { name: 'My Booking', path: '/my-booking', icon: BedDouble, requiresBooking: false, showOnlyWhenNoBooking: true, section: 'Booking' },
    { name: 'Complaints', path: '/student/complaints', icon: AlertCircle, requiresBooking: true, showOnlyWhenNoBooking: false, section: 'Services' },
    { name: 'My Dues', path: '/student/dues', icon: DollarSign, requiresBooking: true, showOnlyWhenNoBooking: false, section: 'Financial' },
    { name: 'Payment History', path: '/student/payments', icon: CreditCard, requiresBooking: true, showOnlyWhenNoBooking: false, section: 'Financial' },
    { name: 'Services', path: '/student/services', icon: ShoppingBag, requiresBooking: true, showOnlyWhenNoBooking: false, section: 'Services' },
    { name: 'Profile', path: '/my-profile', icon: User, requiresBooking: true, showOnlyWhenNoBooking: false, section: 'Account' },
  ];

  // Organize menu items into sections
  const menuSections = [
    {
      title: 'Overview',
      items: menuItems.filter(item => item.section === 'Overview' && (!item.requiresBooking || hasBooking) && (!item.showOnlyWhenNoBooking || !hasBooking))
    },
    {
      title: 'Booking',
      items: menuItems.filter(item => item.section === 'Booking' && (!item.requiresBooking || hasBooking) && (!item.showOnlyWhenNoBooking || !hasBooking))
    },
    {
      title: 'Services',
      items: menuItems.filter(item => item.section === 'Services' && (!item.requiresBooking || hasBooking) && (!item.showOnlyWhenNoBooking || !hasBooking))
    },
    {
      title: 'Financial',
      items: menuItems.filter(item => item.section === 'Financial' && (!item.requiresBooking || hasBooking) && (!item.showOnlyWhenNoBooking || !hasBooking))
    },
    {
      title: 'Account',
      items: menuItems.filter(item => item.section === 'Account' && (!item.requiresBooking || hasBooking) && (!item.showOnlyWhenNoBooking || !hasBooking))
    }
  ].filter(section => section.items.length > 0);

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
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Building2 className="text-white" size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">HMS</h3>
              <p className="text-xs text-slate-500">Student Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Booking Notice */}
        {!hasBooking && (
          <div className="mx-2 mt-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Lock size={14} className="text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-800">Book a Room First</p>
                <p className="text-xs text-amber-700 mt-0.5">
                  Complete your room booking to unlock all features
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto p-2">
          <div className="space-y-2">
            {menuSections.map((section) => {
              const isExpanded = expandedSections[section.title] ?? true;
              const hasActiveItem = section.items.some(item => location.pathname === item.path);
              
              return (
                <div key={section.title} className="space-y-1">
                  {/* Section Header */}
                  <button
                    onClick={() => toggleSection(section.title)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                      hasActiveItem 
                        ? 'bg-indigo-50 text-indigo-700'
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
                        const isLocked = item.requiresBooking && !hasBooking;
                        const isActive = location.pathname === item.path;
                        
                        if (isLocked) {
                          return (
                            <div
                              key={item.path}
                              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-400 cursor-not-allowed opacity-60"
                            >
                              <div className="flex items-center gap-3">
                                <Icon size={18} className="flex-shrink-0" />
                                <span className="font-medium text-sm">{item.name}</span>
                              </div>
                              <Lock size={14} className="text-slate-400" />
                            </div>
                          );
                        }

                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={onClose}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                isActive
                                  ? 'bg-indigo-600 text-white shadow-sm'
                                  : 'text-slate-700 hover:bg-slate-100'
                              }`
                            }
                          >
                            <Icon size={18} className="flex-shrink-0" />
                            <span className="font-medium text-sm">{item.name}</span>
                          </NavLink>
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

export default StudentMobileMenu;

