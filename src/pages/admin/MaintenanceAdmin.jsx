import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';

function MaintenanceAdmin() {
  const [tickets, setTickets] = useState([]);
  const [staffList, setStaffList] = useState([]);

  const fetchData = async () => {
    try {
      const [ticketRes, staffRes] = await Promise.all([
        apiClient.get('/maintenance/all'),
        apiClient.get('/users/staff')
      ]);
      setTickets(ticketRes.data);
      setStaffList(staffRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAssign = async (ticketId, staffId) => {
    if (!staffId) return;
    try {
      await apiClient.put(`/maintenance/assign/${ticketId}`, { staffId });
      fetchData(); // Refresh to show assignment
      alert("Task assigned successfully");
    } catch (err) { alert('Assignment failed'); }
  };

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Maintenance Overview</h1>
      
      <div className="space-y-4">
        {tickets.map(ticket => (
          <div key={ticket._id} className="bg-gray-800 p-5 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${ticket.priority === 'High' ? 'bg-red-600' : 'bg-blue-600'}`}>
                    {ticket.priority}
                  </span>
                  <span className="font-bold text-lg">{ticket.category}</span>
                  <span className="text-sm text-gray-400">- {ticket.title}</span>
                </div>
                <p className="text-gray-300 text-sm mb-3">{ticket.description}</p>
                <div className="text-xs text-gray-500">
                  Room: <span className="text-white">{ticket.room?.roomNumber}</span> • 
                  Student: <span className="text-white">{ticket.student?.username}</span> •
                  Date: {new Date(ticket.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="text-right flex flex-col items-end gap-2">
                <div className="text-sm font-bold text-yellow-400 uppercase">{ticket.status}</div>
                
                {/* ASSIGNMENT DROPDOWN */}
                {ticket.status !== 'Resolved' && (
                  <select 
                    className="bg-gray-700 p-2 rounded text-sm border border-gray-600 text-white w-48"
                    value={ticket.assignedTo?._id || ''}
                    onChange={(e) => handleAssign(ticket._id, e.target.value)}
                  >
                    <option value="">-- Assign To --</option>
                    {staffList.map(staff => (
                      <option key={staff._id} value={staff._id}>
                        {staff.username} ({staff.designation})
                      </option>
                    ))}
                  </select>
                )}
                
                {ticket.assignedTo && (
                  <div className="text-xs text-green-400 mt-1">
                    Assigned: {ticket.assignedTo.username}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        {tickets.length === 0 && <p className="text-gray-500">No maintenance requests found.</p>}
      </div>
    </div>
  );
}
export default MaintenanceAdmin;