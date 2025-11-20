import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';

function ExpenseManager() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: '', category: 'Utilities', amount: '', date: '', description: '' });
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const res = await apiClient.get('/expenses');
      setExpenses(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchExpenses(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/expenses', form);
      alert("Expense Added");
      fetchExpenses();
      setForm({ title: '', category: 'Utilities', amount: '', date: '', description: '' });
    } catch (err) { alert("Error"); }
  };

  const handleDelete = async (id) => {
    if(window.confirm("Delete entry?")) {
      await apiClient.delete(`/expenses/${id}`);
      fetchExpenses();
    }
  };

  return (
    <div className="container mx-auto p-6 text-white grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* --- FORM SECTION --- */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg h-fit">
        <h2 className="text-xl font-bold mb-4 text-red-400">Log New Expense</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Title (e.g. Jan Electric Bill)" className="w-full p-2 bg-gray-700 rounded text-white" 
            value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
          
          <select className="w-full p-2 bg-gray-700 rounded text-white"
            value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
            <option>Utilities</option><option>Staff Wages</option><option>Mess/Food</option><option>Internet</option><option>Maintenance</option><option>Other</option>
          </select>

          <div className="flex gap-2">
            <input type="number" placeholder="Amount (₹)" className="w-1/2 p-2 bg-gray-700 rounded text-white" 
              value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} required />
            <input type="date" className="w-1/2 p-2 bg-gray-700 rounded text-white" 
              value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
          </div>

          <textarea placeholder="Description (Optional)" className="w-full p-2 bg-gray-700 rounded text-white h-20"
            value={form.description} onChange={e => setForm({...form, description: e.target.value})} />

          <button className="w-full bg-red-600 hover:bg-red-700 py-2 rounded font-bold">Add Expense</button>
        </form>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">Expense History</h2>
        <div className="overflow-auto max-h-[500px]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-900 text-gray-400 text-xs uppercase sticky top-0">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Amount</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {expenses.map(exp => (
                <tr key={exp._id} className="hover:bg-gray-750">
                  <td className="p-3 text-sm text-gray-400">{new Date(exp.date).toLocaleDateString()}</td>
                  <td className="p-3 font-bold">{exp.title}</td>
                  <td className="p-3 text-xs"><span className="bg-gray-700 px-2 py-1 rounded">{exp.category}</span></td>
                  <td className="p-3 text-right font-mono text-red-400">-₹{exp.amount}</td>
                  <td className="p-3 text-center"><button onClick={() => handleDelete(exp._id)} className="text-red-500 hover:text-white">&times;</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export default ExpenseManager;