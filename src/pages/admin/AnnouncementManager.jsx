import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';
import { Megaphone, Plus, Edit2, Trash2, Eye, EyeOff, Calendar, Users, ChevronDown } from 'lucide-react';
import { useUI } from '../../context/UIContext';

function AnnouncementManager() {
  const { showToast } = useUI();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'Medium',
    category: 'General',
    targetAudience: 'All',
    expiryDate: ''
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await apiClient.get('/announcements/manage');
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Error fetching announcements:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image size should be less than 5MB', 'warning');
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('content', formData.content);
      submitData.append('priority', formData.priority);
      submitData.append('category', formData.category);
      submitData.append('targetAudience', formData.targetAudience);
      if (formData.expiryDate) {
        submitData.append('expiryDate', formData.expiryDate);
      }
      if (selectedImage) {
        submitData.append('image', selectedImage);
      }

      if (editingAnnouncement) {
        await apiClient.put(`/announcements/${editingAnnouncement._id}`, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Announcement updated successfully!', 'success');
      } else {
        await apiClient.post('/announcements', submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Announcement created successfully!', 'success');
      }
      
      fetchAnnouncements();
      closeModal();
    } catch (error) {
      console.error('Error saving announcement:', error);
      showToast('Failed to save announcement', 'error');
    }
  };

  const handleEdit = (announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      category: announcement.category,
      targetAudience: announcement.targetAudience,
      expiryDate: announcement.expiryDate ? new Date(announcement.expiryDate).toISOString().split('T')[0] : ''
    });
    // Load existing image if available
    if (announcement.imageUrl) {
      setImagePreview(announcement.imageUrl);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    
    try {
      await apiClient.delete(`/announcements/${id}`);
      showToast('Announcement deleted successfully!', 'success');
      fetchAnnouncements();
    } catch (error) {
      console.error('Error deleting announcement:', error);
      showToast('Failed to delete announcement', 'error');
    }
  };

  const handleToggleActive = async (id) => {
    try {
      await apiClient.patch(`/announcements/${id}/toggle`);
      fetchAnnouncements();
    } catch (error) {
      console.error('Error toggling announcement:', error);
      showToast('Failed to update announcement status', 'error');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAnnouncement(null);
    removeImage();
    setFormData({
      title: '',
      content: '',
      priority: 'Medium',
      category: 'General',
      targetAudience: 'All',
      expiryDate: ''
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Urgent': 'bg-red-100 text-red-800',
      'High': 'bg-orange-100 text-orange-800',
      'Medium': 'bg-blue-100 text-blue-800',
      'Low': 'bg-slate-100 text-slate-800'
    };
    return colors[priority] || colors.Medium;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-slate-600 font-medium">Loading announcements...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Announcement Manager</h1>
            <p className="text-sm text-slate-500">Create and manage notice board announcements</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            <Plus size={20} />
            New Announcement
          </button>
        </div>

        {/* Announcements Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Audience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {announcements.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                      <Megaphone className="mx-auto mb-3 text-slate-400" size={48} />
                      <p className="font-medium">No announcements yet</p>
                      <p className="text-sm">Create your first announcement to get started</p>
                    </td>
                  </tr>
                ) : (
                  announcements.map((announcement) => (
                    <tr key={announcement._id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-800">{announcement.title}</p>
                          <p className="text-sm text-slate-500 line-clamp-1">{announcement.content}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getPriorityColor(announcement.priority)}`}>
                          {announcement.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {announcement.category}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-sm text-slate-600">
                          <Users size={14} />
                          {announcement.targetAudience}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {announcement.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                            <Eye size={12} />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                            <EyeOff size={12} />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleToggleActive(announcement._id)}
                            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title={announcement.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {announcement.isActive ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                          <button
                            onClick={() => handleEdit(announcement)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(announcement._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-xl font-bold text-slate-800">
                  {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    placeholder="Enter announcement title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    rows="6"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                    placeholder="Enter announcement content"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Priority
                    </label>
                    <div className="relative">
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Urgent">Urgent</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Category
                    </label>
                    <div className="relative">
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      >
                        <option value="General">General</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Event">Event</option>
                        <option value="Rules">Rules</option>
                        <option value="Emergency">Emergency</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Target Audience
                    </label>
                    <div className="relative">
                      <select
                        value={formData.targetAudience}
                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                        className="w-full px-4 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      >
                        <option value="All">All</option>
                        <option value="Students">Students Only</option>
                        <option value="Staff">Staff Only</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Expiry Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Attach Image (Optional)
                  </label>
                  {!imagePreview ? (
                    <label className="w-full border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all">
                      <svg className="w-12 h-12 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm text-slate-600 font-medium">Click to upload image</span>
                      <span className="text-xs text-slate-500 mt-1">PNG, JPG up to 5MB</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  ) : (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="w-full h-64 object-cover rounded-lg border border-slate-300"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold transition-colors"
                  >
                    {editingAnnouncement ? 'Update Announcement' : 'Create Announcement'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

export default AnnouncementManager;
