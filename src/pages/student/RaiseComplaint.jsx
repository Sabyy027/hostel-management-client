import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import StudentLayout from '../../components/StudentLayout';
import { AlertCircle, CheckCircle, Clock, UserCog, Calendar, Send, Wrench, ChevronDown, Zap, Droplets, Armchair, Sparkles } from 'lucide-react';
import { useUI } from '../../context/UIContext';

function RaiseComplaint() {
  const { showToast } = useUI();
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ category: 'Electrical', title: '', description: '', priority: 'Medium' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch my previous tickets - REMOVED as students cannot view complaints
  const fetchTickets = async () => {
    // Students cannot view their previous complaints anymore
    // Complaints are visible to admin only
    setTickets([]);
  };
  useEffect(() => { fetchTickets(); }, []);

  // Handle image selection
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

  // Submit new complaint
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    try {
      const formData = new FormData();
      formData.append('category', form.category);
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('priority', form.priority);
      if (selectedImage) {
        formData.append('image', selectedImage);
      }

      await apiClient.post('/query', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccess(true);
      setForm({ category: 'Electrical', title: '', description: '', priority: 'Medium' });
      removeImage();
      // Don't fetch tickets as students can't view them
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error submitting complaint', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Electrical': <Zap size={20} className="text-yellow-500" />,
      'Plumbing': <Droplets size={20} className="text-blue-500" />,
      'Furniture': <Armchair size={20} className="text-amber-600" />,
      'Cleaning': <Sparkles size={20} className="text-purple-500" />,
      'Other': <Wrench size={20} className="text-slate-500" />
    };
    return icons[category] || <Wrench size={20} className="text-slate-500" />;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Emergency': 'bg-red-100 text-red-700 border-red-200',
      'High': 'bg-orange-100 text-orange-700 border-orange-200',
      'Medium': 'bg-blue-100 text-blue-700 border-blue-200',
      'Low': 'bg-slate-100 text-slate-700 border-slate-200'
    };
    return colors[priority] || colors['Medium'];
  };

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-amber-100 text-amber-700 border-amber-200',
      'Assigned': 'bg-blue-100 text-blue-700 border-blue-200',
      'In Progress': 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Resolved': 'bg-emerald-100 text-emerald-700 border-emerald-200'
    };
    return colors[status] || colors['Pending'];
  };

  const getStatusIcon = (status) => {
    if (status === 'Resolved') return <CheckCircle size={16} className="text-emerald-600" />;
    if (status === 'In Progress' || status === 'Assigned') return <UserCog size={16} className="text-indigo-600" />;
    return <Clock size={16} className="text-amber-600" />;
  };

  return (
    <StudentLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="text-orange-600" size={24} />
              </div>
              Raise Complaint
            </h2>
            <p className="text-slate-500 mt-1">Submit your complaints directly to admin - they will review and take action</p>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- LEFT: Raise Ticket Form --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit sticky top-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Send className="text-indigo-600" size={18} />
            </div>
            <h3 className="text-lg font-bold text-slate-800">New Complaint</h3>
          </div>
          
          {success && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-600" />
              <span className="text-sm text-emerald-700 font-medium">Complaint registered successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl">
                  {getCategoryIcon(form.category)}
                </span>
                <select 
                  className="w-full pl-12 pr-10 py-3 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none"
                  value={form.category} 
                  onChange={e => setForm({...form, category: e.target.value})}
                >
                  <option>Electrical</option>
                  <option>Plumbing</option>
                  <option>Furniture</option>
                  <option>Cleaning</option>
                  <option>Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Issue Title</label>
              <input 
                type="text" 
                className="w-full bg-white border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" 
                placeholder="e.g. Fan not working"
                value={form.title} 
                onChange={e => setForm({...form, title: e.target.value})} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea 
                className="w-full bg-white border border-slate-300 p-3 rounded-lg h-28 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" 
                placeholder="Describe the issue in detail..."
                value={form.description} 
                onChange={e => setForm({...form, description: e.target.value})} 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Priority Level</label>
              <div className="relative">
                <select 
                  className="w-full bg-white border border-slate-300 p-3 pr-10 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all appearance-none"
                  value={form.priority} 
                  onChange={e => setForm({...form, priority: e.target.value})}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Emergency</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1.5">Select based on urgency</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Attach Image (Optional)</label>
              {!imagePreview ? (
                <label className="w-full border-2 border-dashed border-slate-300 rounded-lg p-4 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-all">
                  <svg className="w-10 h-10 text-slate-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                    className="w-full h-48 object-cover rounded-lg border border-slate-300"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              <p className="text-xs text-slate-500 mt-1.5">Helps admin understand the issue better</p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg text-white font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Request
                </>
              )}
            </button>
          </form>
        </div>

        {/* --- RIGHT: Info --- */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                <AlertCircle className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-blue-900 mb-2">How Complaints Work</h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>All complaints are submitted directly to the hostel admin</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>Admin reviews your complaint and assigns it to appropriate staff</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>You'll receive email and in-app notifications about the progress</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>For urgent issues, select "Emergency" priority level</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
    </StudentLayout>
  );
}
export default RaiseComplaint;