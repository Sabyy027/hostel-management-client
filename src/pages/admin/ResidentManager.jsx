import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';

function ResidentManager() {
  const [residents, setResidents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/resident/dashboard-view');
      setResidents(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSendReminder = async (student) => {
    if (!window.confirm(`Send payment reminder to ${student.name}?`)) return;
    try {
      await apiClient.post('/billing/send-reminder', {
        studentId: student._id,
        email: student.email,
        name: student.name,
        amount: student.pendingDues
      });
      alert("Reminder Email Sent!");
    } catch (err) { alert("Failed to send email"); }
  };

  if (loading) return <div className="p-10 text-white text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Resident Overview</h1>

      <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-700 text-gray-400 text-xs uppercase">
            <tr>
              <th className="p-4 border-b border-gray-600">Resident</th>
              <th className="p-4 border-b border-gray-600">Room</th>
              <th className="p-4 border-b border-gray-600">Ticket Status</th>
              <th className="p-4 border-b border-gray-600 text-right">Dues</th>
              <th className="p-4 border-b border-gray-600 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {residents.map(res => (
              <tr key={res._id} className="hover:bg-gray-750 transition">
                <td className="p-4">
                  <div className="font-bold text-white">{res.name}</div>
                  <div className="text-xs text-gray-400">{res.email}</div>
                </td>
                <td className="p-4">
                  {res.room !== 'Unassigned' ? (
                    <div className="text-blue-400 font-bold text-lg">{res.room}</div>
                  ) : <span className="text-gray-500 text-xs">No Room</span>}
                </td>
                <td className="p-4">
                  {res.activeTickets > 0 ? (
                    <span className="text-red-400 font-bold text-sm">{res.activeTickets} Open Ticket(s)</span>
                  ) : (
                    <span className="text-green-500 text-xs">No Issues</span>
                  )}
                </td>
                <td className="p-4 text-right">
                  {res.pendingDues > 0 ? (
                    <div className="text-red-400 font-mono font-bold">₹{res.pendingDues}</div>
                  ) : (
                    <div className="text-green-500 text-xs">Settled</div>
                  )}
                </td>
                <td className="p-4 text-center">
                  {res.pendingDues > 0 && (
                    <button 
                      onClick={() => handleSendReminder(res)}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs font-bold shadow"
                    >
                      Send Reminder 📧
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResidentManager;