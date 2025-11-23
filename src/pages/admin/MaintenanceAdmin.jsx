import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';
import { Wrench, User, MapPin, Calendar, AlertCircle, CheckCircle, Clock, UserCog, Filter, Search, ChevronDown, Zap, Droplets, Armchair, Sparkles, X } from 'lucide-react';
import { useUI } from '../../context/UIContext';

function MaintenanceAdmin() {
  const { showToast } = useUI();
  const [tickets, setTickets] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [imageModal, setImageModal] = useState(null);

  const fetchData = async () => {
    try {
      const [complaintRes, staffRes] = await Promise.all([
        apiClient.get('/query/all'),
        apiClient.get('/users/staff')
      ]);
      setTickets(complaintRes.data);
      setStaffList(staffRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAssign = async (ticketId, staffId) => {
    if (!staffId) return;
    try {
      await apiClient.put(`/query/assign/${ticketId}`, { staffId });
      showToast('Staff assigned successfully', 'success');
      fetchData();
    } catch (err) { 
      showToast('Assignment failed', 'error'); 
    }
  };

  // Filter tickets
  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = filterStatus === 'All' || ticket.status === filterStatus;
    const matchesPriority = filterPriority === 'All' || ticket.priority === filterPriority;
    const matchesSearch = !searchTerm || 
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.student?.username.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Stats
  const stats = {
    total: tickets.length,
    pending: tickets.filter(t => t.status === 'Pending').length,
    inProgress: tickets.filter(t => t.status === 'In Progress').length,
    resolved: tickets.filter(t => t.status === 'Resolved').length,
    urgent: tickets.filter(t => t.priority === 'Emergency' || t.priority === 'High').length
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <AlertCircle className="text-orange-600" size={24} />
              </div>
              Student Complaints
            </h1>
            <p className="text-slate-500 mt-1">Review and assign resident complaints to staff</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Total Complaints</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stats.total}</p>
              </div>
              <div className="p-3 bg-slate-100 rounded-lg">
                <Wrench className="text-slate-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Pending</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-lg">
                <Clock className="text-amber-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">In Progress</p>
                <p className="text-2xl font-bold text-indigo-600 mt-1">{stats.inProgress}</p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-lg">
                <UserCog className="text-indigo-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Resolved</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.resolved}</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-lg">
                <CheckCircle className="text-emerald-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">Urgent</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{stats.urgent}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="text-red-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  placeholder="Search by title, category, or student..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full p-2 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Priority</label>
              <div className="relative">
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full p-2 pr-8 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                >
                  <option value="All">All Priority</option>
                  <option value="Emergency">Emergency</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-4">
          {filteredTickets.map(ticket => (
            <div key={ticket._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Left Section */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-3xl">{getCategoryIcon(ticket.category)}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3 className="text-lg font-bold text-slate-800">{ticket.title}</h3>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">{ticket.description}</p>
                      
                      {/* Image Attachment */}
                      {ticket.imageUrl && (
                        <div className="mb-3">
                          <img 
                            src={ticket.imageUrl} 
                            alt="Complaint attachment" 
                            className="w-full max-w-md h-48 object-cover rounded-lg border border-slate-300 cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => setImageModal(ticket.imageUrl)}
                          />
                          <p className="text-xs text-slate-500 mt-1">Click to view full size</p>
                        </div>
                      )}
                      
                      {/* Info Row */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                            {ticket.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin size={14} />
                          <span className="font-medium text-slate-700">Room {ticket.room?.roomNumber}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <User size={14} />
                          <span>{ticket.student?.username}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          <span>{new Date(ticket.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Section - Assignment */}
                <div className="flex flex-col items-start lg:items-end gap-3 min-w-[250px]">
                  {ticket.status !== 'Resolved' && (
                    <div className="w-full">
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Assign to Staff</label>
                      <div className="relative">
                        <select 
                          className="w-full bg-white border border-slate-300 p-2.5 pr-10 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none"
                          value={ticket.assignedTo?._id || ''}
                          onChange={(e) => handleAssign(ticket._id, e.target.value)}
                        >
                          <option value="">-- Select Staff --</option>
                          {staffList.map(staff => (
                            <option key={staff._id} value={staff._id}>
                              {staff.username} ({staff.designation})
                            </option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {ticket.assignedTo && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg w-full">
                      <UserCog size={16} className="text-emerald-600" />
                      <div className="text-sm">
                        <p className="text-emerald-700 font-medium">{ticket.assignedTo.username}</p>
                        <p className="text-emerald-600 text-xs">{ticket.assignedTo.designation}</p>
                      </div>
                    </div>
                  )}

                  {ticket.status === 'Resolved' && ticket.resolvedDate && (
                    <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg">
                      <CheckCircle size={16} className="text-emerald-600" />
                      <span className="text-xs text-emerald-700 font-medium">
                        Resolved on {new Date(ticket.resolvedDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {filteredTickets.length === 0 && (
            <div className="bg-white p-12 rounded-xl border border-slate-200 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-100 rounded-full mb-4">
                <Wrench className="text-slate-400" size={32} />
              </div>
              <p className="text-slate-600 font-medium">No maintenance tickets found</p>
              <p className="text-sm text-slate-400 mt-1">
                {searchTerm || filterStatus !== 'All' || filterPriority !== 'All' 
                  ? 'Try adjusting your filters' 
                  : 'All maintenance requests will appear here'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {imageModal && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setImageModal(null)}
        >
          <div className="relative max-w-7xl w-full">
            <button
              onClick={() => setImageModal(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors flex items-center gap-2"
            >
              <X size={28} strokeWidth={2} />
              <span className="text-sm">Press ESC or click outside to close</span>
            </button>
            <img 
              src={imageModal} 
              alt="Full size view" 
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
export default MaintenanceAdmin;