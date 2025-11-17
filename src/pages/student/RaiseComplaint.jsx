import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';

function RaiseComplaint() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ category: 'Electrical', title: '', description: '', priority: 'Medium' });

  // Fetch my previous tickets
  const fetchTickets = async () => {
    try {
      const res = await apiClient.get('/maintenance/my');
      setTickets(res.data);
    } catch (err) { console.error(err); }
  };
  useEffect(() => { fetchTickets(); }, []);

  // Submit new ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/maintenance', form);
      alert('Complaint Registered!');
      setForm({ category: 'Electrical', title: '', description: '', priority: 'Medium' });
      fetchTickets();
    } catch (err) {
      alert(err.response?.data?.message || 'Error raising ticket');
    }
  };

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Maintenance & Complaints</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT: Raise Ticket Form --- */}
        <div className="bg-gray-800 p-6 rounded-lg h-fit">
          <h2 className="text-xl font-bold mb-4 text-blue-400">New Complaint</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Category</label>
              <select className="w-full bg-gray-700 p-2 rounded"
                value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option>Electrical</option><option>Plumbing</option><option>Furniture</option><option>Cleaning</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Issue Title</label>
              <input type="text" className="w-full bg-gray-700 p-2 rounded" placeholder="e.g. Fan not working"
                value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Description</label>
              <textarea className="w-full bg-gray-700 p-2 rounded h-24" placeholder="Details..."
                value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Priority</label>
              <select className="w-full bg-gray-700 p-2 rounded"
                value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                <option>Low</option><option>Medium</option><option>High</option><option>Emergency</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 py-2 rounded font-bold">Submit Request</button>
          </form>
        </div>

        {/* --- RIGHT: History --- */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold mb-4">My History</h2>
          {tickets.map(t => (
            <div key={t._id} className="bg-gray-800 p-4 rounded border-l-4 border-blue-500">
              <div className="flex justify-between">
                <h3 className="font-bold text-lg">{t.title}</h3>
                <span className={`px-2 py-1 rounded text-xs uppercase font-bold ${t.status === 'Resolved' ? 'bg-green-600' : 'bg-yellow-600'}`}>
                  {t.status}
                </span>
              </div>
              <p className="text-gray-400 text-sm mt-1">{t.description}</p>
              {t.assignedTo && <div className="mt-2 text-xs text-blue-300">Assigned to: Staff Member</div>}
              {t.adminComment && <div className="mt-2 text-sm bg-gray-700 p-2 rounded">Admin Note: {t.adminComment}</div>}
            </div>
          ))}
          {tickets.length === 0 && <p className="text-gray-500">No complaints yet.</p>}
        </div>

      </div>
    </div>
  );
}
export default RaiseComplaint;