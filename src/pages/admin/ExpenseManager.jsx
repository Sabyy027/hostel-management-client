import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { TrendingDown, Plus, Trash2, Calendar, Tag, DollarSign, ChevronDown } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

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

  // Calculate total expenses
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
          <TrendingDown className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Expense Manager</h1>
          <p className="text-sm text-slate-500">Track and manage operational expenses</p>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-500 font-medium">Total Expenses</p>
            <p className="text-3xl font-bold text-red-600 mt-1">₹{totalExpenses.toLocaleString()}</p>
          </div>
          <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center">
            <DollarSign className="w-7 h-7 text-red-600" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* --- FORM SECTION --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-fit">
        <h2 className="text-lg font-bold mb-4 text-slate-800 flex items-center gap-2">
          <Plus className="w-5 h-5 text-red-600" />
          Log New Expense
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" 
            placeholder="Title (e.g. Jan Electric Bill)" 
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" 
            value={form.title} 
            onChange={e => setForm({...form, title: e.target.value})} 
            required 
          />
          
          <div className="relative">
            <select 
              className="w-full px-3 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all appearance-none"
              value={form.category} 
              onChange={e => setForm({...form, category: e.target.value})}
            >
              <option>Utilities</option>
              <option>Staff Wages</option>
              <option>Mess/Food</option>
              <option>Internet</option>
              <option>Maintenance</option>
              <option>Other</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <input 
              type="number" 
              placeholder="Amount (₹)" 
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" 
              value={form.amount} 
              onChange={e => setForm({...form, amount: e.target.value})} 
              required 
            />
            <input 
              type="date" 
              className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all" 
              value={form.date} 
              onChange={e => setForm({...form, date: e.target.value})} 
              required 
            />
          </div>

          <textarea 
            placeholder="Description (Optional)" 
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all h-20"
            value={form.description} 
            onChange={e => setForm({...form, description: e.target.value})} 
          />

          <button className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </form>
      </div>

      {/* --- TABLE SECTION --- */}
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold mb-4 text-slate-800">Expense History ({expenses.length})</h2>
        <div className="overflow-auto max-h-[600px]">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Title</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Category</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase">Amount</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-slate-600 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map(exp => (
                <tr key={exp._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-slate-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {new Date(exp.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800">{exp.title}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full text-xs font-medium">
                      <Tag className="w-3 h-3" />
                      {exp.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-bold text-red-600">₹{exp.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => handleDelete(exp._id)} 
                      className="text-red-600 hover:text-red-700 transition-colors p-1"
                      title="Delete Expense"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-4 py-12 text-center">
                    <TrendingDown className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p className="text-slate-400 font-medium">No expenses recorded yet</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
      </div>
    </AdminLayout>
  );
}
export default ExpenseManager;