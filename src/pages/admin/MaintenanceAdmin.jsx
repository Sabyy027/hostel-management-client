import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';

function MaintenanceAdmin() {
  const [tickets, setTickets] = useState([]);
  const [staffList, setStaffList] = useState([]);

  const fetchData = async () => {
    const [ticketRes, staffRes] = await Promise.all([
      apiClient.get('/maintenance/all'),
      apiClient.get('/users/staff')
    ]);
    setTickets(ticketRes.data);
    setStaffList(staffRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleAssign = async (ticketId, staffId) => {
    if (!staffId) return;
    try {
      await apiClient.put(`/maintenance/assign/${ticketId}`, { staffId });
      fetchData();
    } catch (err) { alert('Assignment failed'); }
  };

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Maintenance Dashboard</h1>
      
      <div className="space-y-4">
        {tickets.map(ticket => (
          <div key={ticket._id} className="bg-gray-800 p-4 rounded shadow flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs font-bold ${ticket.priority === 'High' ? 'bg-red-600' : 'bg-blue-600'}`}>
                  {ticket.priority}
                </span>
                <span className="font-bold text-lg">{ticket.category}</span>
              </div>
              <p className="text-gray-300 mt-1">{ticket.description}</p>
              <div className="text-sm text-gray-500 mt-2">
                Room {ticket.room?.roomNumber} • Raised by {ticket.student?.username}
              </div>
            </div>

            <div className="text-right">
              <div className="mb-2">Status: <span className="font-bold text-yellow-400">{ticket.status}</span></div>
              
              {/* ASSIGNMENT DROPDOWN */}
              {ticket.status !== 'Resolved' && (
                <select 
                  className="bg-gray-700 p-2 rounded text-sm"
                  value={ticket.assignedTo?._id || ''}
                  onChange={(e) => handleAssign(ticket._id, e.target.value)}
                >
                  <option value="">-- Assign Staff --</option>
                  {staffList.map(staff => (
                    <option key={staff._id} value={staff._id}>
                      {staff.username} ({staff.designation})
                    </option>
                  ))}
                </select>
              )}
              {ticket.assignedTo && <div className="text-xs text-blue-300 mt-1">Assigned to: {ticket.assignedTo.username}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default MaintenanceAdmin;