import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProfileDropdown = ({ user, roleColor = 'indigo' }) => {
  const navigate = useNavigate();

  const getProfilePath = () => {
    const role = user.role?.toLowerCase();
    
    switch (role) {
      case 'student':
        return '/my-profile';
      case 'staff':
        return '/staff/profile';
      case 'warden':
      case 'resident tutor':
      case 'admin':
        return '/admin/profile';
      default:
        return '/my-profile';
    }
  };

  const handleProfileClick = () => {
    navigate(getProfilePath());
  };

  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-100',
      text: 'text-indigo-600'
    },
    amber: {
      bg: 'bg-amber-100',
      text: 'text-amber-600'
    },
    teal: {
      bg: 'bg-teal-100',
      text: 'text-teal-600'
    }
  };

  const colors = colorClasses[roleColor] || colorClasses.indigo;

  return (
    <button
      onClick={handleProfileClick}
      className="flex items-center gap-3 pl-4 border-l border-slate-200 hover:bg-slate-50 rounded-lg transition-colors p-2"
      title="View Profile"
    >
      <div className="text-right">
        <p className="text-sm font-semibold text-slate-800">{user.name || user.username}</p>
        <p className="text-xs text-slate-500 capitalize">{user.designation || user.role}</p>
      </div>
      <div className="relative">
        {user.photoUrl ? (
          <img
            src={user.photoUrl}
            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-slate-200"
          />
        ) : (
          <div className={`w-10 h-10 ${colors.bg} ${colors.text} rounded-full flex items-center justify-center font-bold`}>
            {(user.name || user.username || 'U').charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </button>
  );
};

export default ProfileDropdown;
