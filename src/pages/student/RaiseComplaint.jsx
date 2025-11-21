import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import StudentLayout from '../../components/StudentLayout';

function RaiseComplaint() {
  const [tickets, setTickets] = useState([]);
  const [form, setForm] = useState({ category: 'Electrical', title: '', description: '', priority: 'Medium' });

  // Fetch my previous tickets
  const fetchTickets = async () => {
    try {
      const res = await apiClient.get('/maintenance/all');
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
    <StudentLayout>
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Maintenance & Complaints</h2>
          <p className="text-slate-500">Report issues and track your maintenance requests</p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* --- LEFT: Raise Ticket Form --- */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
          <h3 className="text-lg font-bold mb-4 text-slate-800">New Complaint</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
              <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                <option>Electrical</option><option>Plumbing</option><option>Furniture</option><option>Cleaning</option><option>Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Issue Title</label>
              <input type="text" className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="e.g. Fan not working"
                value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
              <textarea className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg h-24 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all" placeholder="Describe the issue in detail..."
                value={form.description} onChange={e => setForm({...form, description: e.target.value})} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                <option>Low</option><option>Medium</option><option>High</option><option>Emergency</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg text-white font-bold transition-colors shadow-lg shadow-indigo-200">Submit Request</button>
          </form>
        </div>

        {/* --- RIGHT: History --- */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-800">My Tickets</h3>
          {tickets.map(t => (
            <div key={t._id} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-500 border border-slate-200">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-lg text-slate-800">{t.title}</h4>
                <span className={`px-3 py-1 rounded-full text-xs uppercase font-bold ${
                  t.status === 'Resolved' ? 'bg-green-100 text-green-700' : 
                  t.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 
                  'bg-amber-100 text-amber-700'
                }`}>
                  {t.status}
                </span>
              </div>
              <p className="text-slate-600 text-sm mt-2">{t.description}</p>
              <div className="flex items-center gap-2 mt-3 text-xs text-slate-500">
                <span className="px-2 py-1 bg-slate-100 rounded">{t.category}</span>
                <span className={`px-2 py-1 rounded ${
                  t.priority === 'Emergency' ? 'bg-red-100 text-red-700' :
                  t.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                  'bg-slate-100 text-slate-700'
                }`}>{t.priority}</span>
              </div>
              {t.assignedTo && <div className="mt-2 text-xs text-indigo-600 font-medium">✓ Assigned to staff</div>}
              {t.adminComment && <div className="mt-3 text-sm bg-indigo-50 border border-indigo-100 p-3 rounded-lg"><span className="font-semibold text-indigo-700">Admin Note:</span> {t.adminComment}</div>}
            </div>
          ))}
          {tickets.length === 0 && (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
              <p className="text-slate-500">No complaints yet.</p>
              <p className="text-sm text-slate-400 mt-1">Your maintenance tickets will appear here</p>
            </div>
          )}
        </div>

      </div>
    </div>
    </StudentLayout>
  );
}
export default RaiseComplaint;