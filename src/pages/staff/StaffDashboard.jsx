import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';

function StaffDashboard() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch tasks assigned specifically to this logged-in staff member
  const fetchMyTasks = async () => {
    setLoading(true);
    try {
      // The backend endpoint /maintenance/all automatically filters by 'assignedTo'
      // when the requester has the role 'staff'.
      const res = await apiClient.get('/maintenance/all');
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
    if (!window.confirm(`Mark ticket as ${newStatus}?`)) return;

    try {
      await apiClient.put(`/maintenance/status/${ticketId}`, { status: newStatus });
      alert(`Ticket updated to ${newStatus}`);
      fetchMyTasks(); // Refresh the list
    } catch (err) {
      alert('Failed to update status. Please try again.');
      console.error(err);
    }
  };

  if (loading) return <div className="p-10 text-white text-center">Loading your tasks...</div>;

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
      <p className="text-gray-400 mb-8">Manage your assigned maintenance requests.</p>

      <div className="grid gap-6">
        {tickets.length === 0 && (
          <div className="text-center p-10 bg-gray-800 rounded-lg border border-gray-700">
            <p className="text-xl text-gray-400">No pending tasks assigned to you.</p>
            <p className="text-sm text-gray-500">Enjoy your break!</p>
          </div>
        )}

        {tickets.map(ticket => (
          <div key={ticket._id} className="bg-gray-800 p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              
              {/* Ticket Details */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    ticket.priority === 'High' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                  }`}>
                    {ticket.priority}
                  </span>
                  <span className="font-bold text-lg text-white">{ticket.category}</span>
                  <span className="text-gray-400 text-sm">#{ticket._id.slice(-6)}</span>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{ticket.title}</h3>
                <p className="text-gray-300 bg-gray-900/50 p-3 rounded mb-3">
                  {ticket.description}
                </p>
                
                <div className="text-sm text-gray-400 grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-xs uppercase text-gray-500 font-bold">Location</span>
                    <span className="text-white font-mono text-base">Room {ticket.room?.roomNumber}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase text-gray-500 font-bold">Raised By</span>
                    <span className="text-white">{ticket.student?.username}</span>
                  </div>
                  <div>
                    <span className="block text-xs uppercase text-gray-500 font-bold">Date</span>
                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Actions Column */}
              <div className="w-full md:w-48 flex flex-col gap-3 border-t md:border-t-0 md:border-l border-gray-700 pt-4 md:pt-0 md:pl-6">
                <div className="text-center mb-2">
                   <span className="text-xs text-gray-500 block uppercase font-bold">Current Status</span>
                   <span className={`text-sm font-bold uppercase ${
                     ticket.status === 'Resolved' ? 'text-green-400' : 'text-yellow-400'
                   }`}>
                     {ticket.status}
                   </span>
                </div>

                {ticket.status !== 'Resolved' && (
                  <>
                    {ticket.status !== 'In Progress' && (
                      <button 
                        onClick={() => updateStatus(ticket._id, 'In Progress')}
                        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded text-sm transition"
                      >
                        Start Work
                      </button>
                    )}
                    
                    <button 
                      onClick={() => updateStatus(ticket._id, 'Resolved')}
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm transition"
                    >
                      Mark Resolved
                    </button>
                  </>
                )}
                
                {ticket.status === 'Resolved' && (
                  <div className="text-center text-xs text-gray-500 italic mt-2">
                    Completed on {new Date(ticket.updatedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StaffDashboard;