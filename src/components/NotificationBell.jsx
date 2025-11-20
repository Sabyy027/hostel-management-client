import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';

function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifs = async () => {
    try {
      const res = await apiClient.get('/notifications');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const markRead = async (id) => {
    await apiClient.put(`/notifications/${id}/read`);
    fetchNotifs();
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-300 hover:text-white">
        🔔
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-50 overflow-hidden">
          <div className="p-3 bg-gray-800 font-bold text-white border-b border-gray-700">Notifications</div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 && <div className="p-4 text-gray-500 text-center text-sm">No new notifications</div>}
            {notifications.map(n => (
              <div key={n._id} onClick={() => markRead(n._id)} className={`p-3 border-b border-gray-800 hover:bg-gray-800 cursor-pointer ${!n.read ? 'bg-blue-900/20' : ''}`}>
                <p className="text-sm text-gray-300">{n.message}</p>
                <span className="text-[10px] text-gray-500">{new Date(n.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default NotificationBell;