import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { Bell, Wrench, CreditCard, Info, DollarSign, Package, AlertTriangle, Home, Megaphone, Inbox } from 'lucide-react';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifs = async () => {
    try {
      const res = await apiClient.get('/notifications');
      console.log('Notifications fetched:', res.data);
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) { 
      console.error('Error fetching notifications:', err);
      console.error('Error details:', err.response?.data);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const markRead = async (id) => {
    try {
      await apiClient.put(`/notifications/${id}/read`);
      fetchNotifs();
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      'Maintenance': <Wrench size={16} className="text-orange-500" />,
      'Billing': <CreditCard size={16} className="text-blue-500" />,
      'System': <Info size={16} className="text-slate-500" />,
      'Payment': <DollarSign size={16} className="text-green-500" />,
      'Service': <Package size={16} className="text-purple-500" />,
      'Fine': <AlertTriangle size={16} className="text-red-500" />,
      'Booking': <Home size={16} className="text-indigo-500" />,
      'Announcement': <Megaphone size={16} className="text-amber-500" />
    };
    return icons[type] || <Info size={16} className="text-slate-500" />;
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        title={`${unreadCount} unread notifications`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="flex items-center gap-2 font-semibold text-slate-800">
              <Bell size={18} className="text-slate-600" />
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="bg-indigo-100 text-indigo-700 px-2.5 py-0.5 rounded-full text-xs font-semibold">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 && (
              <div className="p-12 text-slate-500 text-center">
                <div className="mb-3 opacity-50 flex justify-center">
                  <Inbox size={48} className="text-slate-400" />
                </div>
                <p className="font-semibold text-slate-700 text-sm">No notifications yet</p>
                <p className="text-xs mt-1 text-slate-400">You're all caught up!</p>
              </div>
            )}
            {notifications.map(n => (
              <div 
                key={n._id} 
                onClick={() => markRead(n._id)} 
                className={`p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer transition-all ${!n.read ? 'bg-indigo-50/50 border-l-4 border-l-indigo-500' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl flex-shrink-0">{getNotificationIcon(n.type)}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm leading-relaxed ${!n.read ? 'font-medium text-slate-800' : 'text-slate-600'}`}>
                        {n.message}
                      </p>
                      {!n.read && (
                        <span className="flex-shrink-0 w-2 h-2 bg-indigo-500 rounded-full mt-1.5"></span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">{n.type}</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-400">
                        {new Date(n.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {notifications.length > 0 && (
            <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
              <button 
                onClick={() => setIsOpen(false)}
                className="text-xs text-slate-600 hover:text-indigo-600 font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
export default NotificationBell;