import React, { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { Megaphone, Calendar, User, AlertCircle, Info, AlertTriangle, Clock, X, Siren, PartyPopper, Wrench, FileText } from 'lucide-react';

const NoticeBoard = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [imageModal, setImageModal] = useState(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await apiClient.get('/announcements');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Urgent': 'bg-red-50 border-red-300 text-red-800',
      'High': 'bg-orange-50 border-orange-300 text-orange-800',
      'Medium': 'bg-blue-50 border-blue-300 text-blue-800',
      'Low': 'bg-slate-50 border-slate-300 text-slate-800'
    };
    return colors[priority] || colors.Medium;
  };

  const getPriorityIcon = (priority) => {
    switch(priority) {
      case 'Urgent': return <AlertTriangle size={16} />;
      case 'High': return <AlertCircle size={16} />;
      default: return <Info size={16} />;
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Emergency': <Siren size={18} className="text-red-500" />,
      'Event': <PartyPopper size={18} className="text-purple-500" />,
      'Maintenance': <Wrench size={18} className="text-orange-500" />,
      'Rules': <FileText size={18} className="text-blue-500" />,
      'General': <Megaphone size={18} className="text-slate-500" />
    };
    return icons[category] || <Megaphone size={18} className="text-slate-500" />;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          <div className="h-20 bg-slate-200 rounded"></div>
          <div className="h-20 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
            <Megaphone className="text-slate-400" size={32} />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">No Announcements</h3>
          <p className="text-sm text-slate-500">Check back later for updates and notices</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm shadow-lg">
            <Megaphone size={26} strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Notice Board</h2>
            <p className="text-indigo-100 text-sm font-medium">Latest announcements and updates</p>
          </div>
        </div>
      </div>

      {/* Announcements List */}
      <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto custom-scrollbar">
        {announcements.map((announcement) => (
          <div 
            key={announcement._id} 
            className={`p-5 hover:bg-gradient-to-r hover:from-slate-50 hover:to-indigo-50/30 transition-all duration-200 ${
              announcement.priority === 'Urgent' ? 'bg-red-50/40 border-l-4 border-red-500' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon with gradient background */}
              <div className="mt-0.5 flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm">
                  {getCategoryIcon(announcement.category)}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      <h3 className="font-bold text-slate-900 text-base leading-tight">
                        {announcement.title}
                      </h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${getPriorityColor(announcement.priority)}`}>
                        {getPriorityIcon(announcement.priority)}
                        {announcement.priority}
                      </span>
                    </div>
                    
                    {/* Meta Info */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-2.5">
                      <span className="flex items-center gap-1.5 font-medium">
                        <User size={13} />
                        {announcement.createdBy?.username || 'Admin'}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} />
                        {formatDate(announcement.createdAt)}
                      </span>
                      {announcement.expiryDate && (
                        <span className="flex items-center gap-1.5 text-amber-600 font-medium">
                          <Clock size={13} />
                          Expires: {new Date(announcement.expiryDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="text-sm text-slate-700 leading-relaxed">
                  {expandedId === announcement._id ? (
                    <div>
                      <p className="whitespace-pre-wrap mb-3">{announcement.content}</p>
                      {announcement.imageUrl && (
                        <div className="relative group">
                          <img 
                            src={announcement.imageUrl} 
                            alt="Announcement" 
                            className="mt-2 w-full max-w-lg h-56 object-cover rounded-xl border-2 border-slate-200 cursor-pointer hover:border-indigo-400 transition-all shadow-md hover:shadow-xl"
                            onClick={() => setImageModal(announcement.imageUrl)}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-xl transition-colors pointer-events-none"></div>
                        </div>
                      )}
                      <button
                        onClick={() => setExpandedId(null)}
                        className="mt-3 text-indigo-600 hover:text-indigo-700 font-semibold text-xs flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        <span>Show less</span>
                        <span>↑</span>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="line-clamp-2 mb-2">{announcement.content}</p>
                      {announcement.imageUrl && (
                        <div className="relative group inline-block">
                          <img 
                            src={announcement.imageUrl} 
                            alt="Announcement thumbnail" 
                            className="mt-2 w-full h-32 object-cover rounded-lg border-2 border-slate-200 cursor-pointer hover:border-indigo-400 transition-all shadow-sm hover:shadow-md"
                            onClick={() => setExpandedId(announcement._id)}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 bg-white/90 px-3 py-1 rounded-full text-xs font-semibold text-slate-700 transition-opacity">
                              Click to expand
                            </span>
                          </div>
                        </div>
                      )}
                      {(announcement.content.length > 100 || announcement.imageUrl) && (
                        <button
                          onClick={() => setExpandedId(announcement._id)}
                          className="mt-2 text-indigo-600 hover:text-indigo-700 font-semibold text-xs flex items-center gap-1 hover:gap-2 transition-all"
                        >
                          <span>{announcement.imageUrl ? 'View full announcement' : 'Read more'}</span>
                          <span>→</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Category Badge */}
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 text-xs font-semibold rounded-full border border-slate-200 shadow-sm">
                    {getCategoryIcon(announcement.category)}
                    {announcement.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Footer */}
      {announcements.length > 3 && (
        <div className="bg-gradient-to-r from-slate-50 to-indigo-50/30 px-6 py-4 text-center border-t border-slate-200">
          <button className="text-sm text-indigo-600 hover:text-indigo-700 font-bold flex items-center justify-center gap-2 mx-auto hover:gap-3 transition-all group">
            <span>View All Announcements ({announcements.length})</span>
            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      )}

      {/* Image Modal */}
      {imageModal && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn"
          onClick={() => setImageModal(null)}
        >
          <div className="relative max-w-6xl w-full animate-scaleIn">
            <button
              onClick={() => setImageModal(null)}
              className="absolute -top-14 right-0 text-white hover:text-indigo-400 font-semibold flex items-center gap-3 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              <X size={24} strokeWidth={2.5} />
              <span className="text-sm">Press ESC or click outside to close</span>
            </button>
            <img 
              src={imageModal} 
              alt="Full size view" 
              className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl border-4 border-white/20"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default NoticeBoard;
