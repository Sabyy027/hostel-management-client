import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import StaffLayout from '../../components/StaffLayout';
import { 
  Wrench, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  User, 
  MapPin, 
  Calendar,
  PlayCircle,
  Loader2,
  ClipboardCheck
} from 'lucide-react';

function StaffDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks assigned specifically to this logged-in staff member
  const fetchMyTasks = async () => {
    setLoading(true);
    try {
      // The backend endpoint /query/all automatically filters by 'assignedTo'
      // when the requester has the role 'staff'.
      const res = await apiClient.get('/query/all');
      setTickets(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  // Function to update task status
  const updateStatus = async (ticketId, newStatus) => {
    if (!window.confirm(`Mark complaint as ${newStatus}?`)) return;

    try {
      await apiClient.put(`/query/status/${ticketId}`, { status: newStatus });
      alert(`Complaint updated to ${newStatus}`);
      fetchMyTasks(); // Refresh the list
    } catch (err) {
      alert('Failed to update status. Please try again.');
      console.error(err);
    }
  };

  if (loading) return (
    <StaffLayout>
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-600 animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Loading your tasks...</p>
        </div>
      </div>
    </StaffLayout>
  );

  // Calculate stats
  const totalTasks = tickets.length;
  const pendingTasks = tickets.filter(t => t.status === 'Pending').length;
  const inProgressTasks = tickets.filter(t => t.status === 'In Progress').length;
  const resolvedTasks = tickets.filter(t => t.status === 'Resolved').length;

  return (
    <StaffLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">My Maintenance Tasks</h1>
            <p className="text-sm text-slate-500">Manage your assigned maintenance requests</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Total Tasks</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{totalTasks}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <ClipboardCheck className="text-slate-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Pending</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{pendingTasks}</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-lg">
                <Clock className="text-amber-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">In Progress</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{inProgressTasks}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <PlayCircle className="text-blue-600" size={20} />
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500 uppercase">Resolved</p>
                <p className="text-2xl font-bold text-slate-900 mt-1">{resolvedTasks}</p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="text-emerald-600" size={20} />
              </div>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {tickets.length === 0 && (
            <div className="text-center p-12 bg-white rounded-lg border border-slate-200">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <p className="text-xl font-semibold text-slate-800 mb-2">All Caught Up!</p>
              <p className="text-sm text-slate-500">No pending tasks assigned to you. Enjoy your break!</p>
            </div>
          )}

        {tickets.map(ticket => {
          const isPending = ticket.status === 'Pending';
          const isInProgress = ticket.status === 'In Progress';
          const isResolved = ticket.status === 'Resolved';
          const isHighPriority = ticket.priority === 'High';

          return (
            <div 
              key={ticket._id} 
              className={`bg-white rounded-lg border-2 overflow-hidden transition-all hover:shadow-lg ${
                isHighPriority 
                  ? 'border-red-200' 
                  : isInProgress 
                  ? 'border-blue-200' 
                  : isResolved 
                  ? 'border-emerald-200' 
                  : 'border-slate-200'
              }`}
            >
              {/* Header Bar */}
              <div className={`px-6 py-3 flex items-center justify-between border-b ${
                isHighPriority 
                  ? 'bg-red-50 border-red-200' 
                  : isInProgress 
                  ? 'bg-blue-50 border-blue-200' 
                  : isResolved 
                  ? 'bg-emerald-50 border-emerald-200' 
                  : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isHighPriority 
                      ? 'bg-red-100' 
                      : isInProgress 
                      ? 'bg-blue-100' 
                      : isResolved 
                      ? 'bg-emerald-100' 
                      : 'bg-amber-100'
                  }`}>
                    {isResolved ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    ) : isInProgress ? (
                      <PlayCircle className="w-5 h-5 text-blue-600" />
                    ) : isHighPriority ? (
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                        isHighPriority 
                          ? 'bg-red-600 text-white' 
                          : 'bg-slate-600 text-white'
                      }`}>
                        {ticket.priority}
                      </span>
                      <span className="font-bold text-sm text-slate-900">{ticket.category}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">Ticket #{ticket._id.slice(-6)}</p>
                  </div>
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
                  isResolved 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : isInProgress 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {ticket.status}
                </span>
              </div>

              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Ticket Details */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{ticket.title}</h3>
                      <p className="text-slate-600 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        {ticket.description}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="font-medium uppercase">Location</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">Room {ticket.room?.roomNumber}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <User className="w-3.5 h-3.5" />
                          <span className="font-medium uppercase">Raised By</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">{ticket.student?.username}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="font-medium uppercase">Date</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900">
                          {new Date(ticket.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="w-full md:w-56 flex flex-col gap-3 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-6">
                    {ticket.status !== 'Resolved' && (
                      <>
                        {ticket.status !== 'In Progress' && (
                          <button 
                            onClick={() => updateStatus(ticket._id, 'In Progress')}
                            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors shadow-sm"
                          >
                            <PlayCircle className="w-4 h-4" />
                            Start Work
                          </button>
                        )}
                        
                        <button 
                          onClick={() => updateStatus(ticket._id, 'Resolved')}
                          className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Mark Resolved
                        </button>
                      </>
                    )}
                    
                    {ticket.status === 'Resolved' && (
                      <div className="text-center p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-emerald-900 mb-1">Completed</p>
                        <p className="text-xs text-emerald-700">
                          {new Date(ticket.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </StaffLayout>
  );
}

export default StaffDashboard;