import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { Trash2, PlusCircle, Tag, Wifi, AlertCircle, DollarSign, TrendingUp, Edit2, X, Check, ChevronDown, Key } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';

function BillingDashboard() {
  // --- DATA STATE ---
  const [services, setServices] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- CONFIG FORMS STATE ---
  const [newService, setNewService] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    period: 'One-Time', 
    serviceType: 'General',
    credentials: ''
  });
  const [newDiscount, setNewDiscount] = useState({ name: '', type: 'Fixed', value: '', targetCategory: 'Room' });
  const [editingService, setEditingService] = useState(null);

  // --- FINE TERMINAL STATE ---
  const [selectedStudent, setSelectedStudent] = useState('');
  const [fineAmount, setFineAmount] = useState('');
  const [fineReason, setFineReason] = useState('');

  // --- FETCH ALL DATA ---
  const fetchData = async () => {
    try {
      const [svcRes, discRes, stuRes] = await Promise.all([
        apiClient.get('/services'),
        apiClient.get('/discounts'),
        apiClient.get('/resident/dashboard-view')
      ]);
      setServices(svcRes.data);
      setDiscounts(discRes.data);
      setStudents(stuRes.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // --- HANDLERS: CONFIGURATION ---
  const handleCreateService = async (e) => {
    e.preventDefault();
    try { 
      await apiClient.post('/services', newService); 
      fetchData(); 
      setNewService({ name: '', description: '', price: '', period: 'One-Time', serviceType: 'General', credentials: '' }); 
    } catch (err) { alert("Error creating service"); }
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/services/${editingService._id}`, editingService);
      fetchData();
      setEditingService(null);
      alert("Service updated successfully!");
    } catch (err) {
      alert("Error updating service");
    }
  };

  const handleDeleteService = async (id) => { 
    if(window.confirm("Delete this service?")) { 
      await apiClient.delete(`/services/${id}`); 
      fetchData(); 
    }
  };

  const initMess = async () => {
    try {
      const res = await apiClient.post('/services/init-mess');
      alert(res.data.message);
      fetchData();
    } catch (err) {
      alert("Error initializing Mess service");
    }
  };

  const handleCreateDiscount = async (e) => {
    e.preventDefault();
    try { await apiClient.post('/discounts', newDiscount); fetchData(); setNewDiscount({ name: '', type: 'Fixed', value: '', targetCategory: 'Room' }); } catch (err) { alert("Error"); }
  };
  const handleDeleteDiscount = async (id) => { if(window.confirm("Delete?")) { await apiClient.delete(`/discounts/${id}`); fetchData(); }};

  // --- HANDLER: APPLY FINE ---
  const handleApplyFine = async (e) => {
    e.preventDefault();
    if (!selectedStudent) return alert("Please select a student");

    try {
      await apiClient.post('/billing/create-charge', {
        studentId: selectedStudent,
        type: 'Fine',
        amount: Number(fineAmount),
        description: `FINE: ${fineReason}`
      });
      alert("Fine Applied Successfully!");
      setFineAmount(''); setFineReason(''); setSelectedStudent('');
    } catch (err) {
      alert("Action Failed: " + (err.response?.data?.message || "Server Error"));
    }
  };

  if(loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center h-64">
        <p className="text-slate-600 font-medium">Loading...</p>
      </div>
    </AdminLayout>
  );

  // Calculate stats
  const totalServices = services.length;
  const totalDiscounts = discounts.length;
  const monthlyRevenue = services.filter(s => s.period === 'Monthly').reduce((sum, s) => sum + s.price, 0);

  return (
    <AdminLayout>
      <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Billing & Services</h1>
        <p className="text-sm text-slate-500">Manage services, discounts, and fines</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500 font-medium">Active Services</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">{totalServices}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Wifi className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Discount Rules</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">{totalDiscounts}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Tag className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">Monthly Revenue</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">₹{monthlyRevenue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ZONE 1: CONFIGURATION (Services & Discounts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT: SERVICE LIBRARY */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Wifi className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Service Library</h2>
                <p className="text-xs text-slate-500">Manage available services</p>
              </div>
            </div>
            <button 
              onClick={initMess}
              className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
            >
              Init Mess
            </button>
          </div>

          {/* Edit Modal */}
          {editingService && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-800">Edit Service</h3>
                  <button 
                    onClick={() => setEditingService(null)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleUpdateService} className="p-4 sm:p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Service Name</label>
                    <input 
                      type="text" 
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm" 
                      value={editingService.name} 
                      onChange={e => setEditingService({...editingService, name: e.target.value})} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
                    <textarea 
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm" 
                      rows="2"
                      value={editingService.description || ''} 
                      onChange={e => setEditingService({...editingService, description: e.target.value})} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Price (₹)</label>
                      <input 
                        type="number" 
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm" 
                        value={editingService.price} 
                        onChange={e => setEditingService({...editingService, price: e.target.value})} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Period</label>
                      <div className="relative">
                        <select 
                          className="w-full px-3 py-2 pr-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm appearance-none" 
                          value={editingService.period} 
                          onChange={e => setEditingService({...editingService, period: e.target.value})}
                        >
                          <option>One-Time</option>
                          <option>Monthly</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Service Type</label>
                    <div className="relative">
                      <select 
                        className="w-full px-3 py-2 pr-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm appearance-none" 
                        value={editingService.serviceType} 
                        onChange={e => setEditingService({...editingService, serviceType: e.target.value})}
                        disabled={editingService.isPredefined}
                      >
                        <option value="General">General</option>
                        <option value="WiFi">WiFi</option>
                        <option value="Mess">Mess</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      </div>
                    </div>
                  </div>
                  {editingService.serviceType !== 'Mess' && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">Credentials (WiFi ID/Password)</label>
                      <textarea 
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-mono bg-slate-50" 
                        rows="3"
                        placeholder="Username: wifi123&#10;Password: pass456"
                        value={editingService.credentials || ''} 
                        onChange={e => setEditingService({...editingService, credentials: e.target.value})} 
                      />
                    </div>
                  )}
                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                      <Check className="w-4 h-4" />
                      Update Service
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setEditingService(null)}
                      className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-2.5 rounded-lg font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Create Form */}
          <form onSubmit={handleCreateService} className="mb-6 space-y-3">
            <div className="flex gap-3">
              <input 
                type="text" 
                placeholder="Service Name" 
                className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm" 
                value={newService.name} 
                onChange={e => setNewService({...newService, name: e.target.value})} 
                required 
              />
              <input 
                type="number" 
                placeholder="Price" 
                className="w-28 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm" 
                value={newService.price} 
                onChange={e => setNewService({...newService, price: e.target.value})} 
                required 
              />
            </div>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <select 
                  className="w-full px-3 py-2 pr-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm appearance-none" 
                  value={newService.period} 
                  onChange={e => setNewService({...newService, period: e.target.value})}
                >
                  <option>One-Time</option>
                  <option>Monthly</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>
              <div className="relative flex-1">
                <select 
                  className="w-full px-3 py-2 pr-10 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm appearance-none" 
                  value={newService.serviceType} 
                  onChange={e => setNewService({...newService, serviceType: e.target.value})}
                >
                  <option value="General">General</option>
                  <option value="WiFi">WiFi</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                </div>
              </div>
              <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 px-4 rounded-lg transition-colors flex items-center justify-center">
                <PlusCircle className="w-5 h-5 text-white" />
              </button>
            </div>
            {newService.serviceType === 'WiFi' && (
              <textarea 
                placeholder="WiFi Credentials (ID/Pass)" 
                className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm font-mono bg-slate-50" 
                rows="2"
                value={newService.credentials} 
                onChange={e => setNewService({...newService, credentials: e.target.value})} 
              />
            )}
          </form>

          {/* List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {services.map(s => (
               <div key={s._id} className="bg-slate-50 hover:bg-slate-100 p-4 rounded-lg border border-slate-200 transition-colors">
                 <div className="flex justify-between items-start mb-2">
                   <div className="flex-1">
                     <div className="flex items-center gap-2 mb-1">
                       <span className="font-semibold text-slate-800">{s.name}</span>
                       {s.serviceType === 'Mess' && (
                         <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">MESS</span>
                       )}
                       {s.serviceType === 'WiFi' && (
                         <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">WiFi</span>
                       )}
                       {s.serviceType === 'General' && (
                         <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-medium">General</span>
                       )}
                     </div>
                     <span className="text-xs text-slate-500">Period: {s.period}</span>
                   </div>
                   <div className="flex gap-3 items-center">
                      <span className="text-indigo-600 font-mono font-bold">₹{s.price}</span>
                      <button 
                        onClick={() => setEditingService(s)} 
                        className="text-indigo-600 hover:text-indigo-700 transition-colors"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {!s.isPredefined && (
                        <button 
                          onClick={() => handleDeleteService(s._id)} 
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                   </div>
                 </div>
                 {s.credentials && (
                   <div className="mt-2 text-xs text-slate-600 bg-amber-50 border border-amber-200 p-2 rounded flex items-center gap-2">
                     <Key size={14} className="text-amber-600" />
                     <span>Has credentials</span>
                   </div>
                 )}
               </div>
            ))}
          </div>
        </div>

        {/* RIGHT: DISCOUNT RULES */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Tag className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Discount Rules</h2>
              <p className="text-xs text-slate-500">Manage discount policies</p>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleCreateDiscount} className="mb-6 flex gap-3">
             <input 
               type="text" 
               placeholder="Name (e.g. Merit)" 
               className="flex-1 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm" 
               value={newDiscount.name} 
               onChange={e => setNewDiscount({...newDiscount, name: e.target.value})} 
               required 
             />
             <div className="relative w-28">
               <select 
                 className="w-full px-3 py-2 pr-8 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm appearance-none" 
                 value={newDiscount.type} 
                 onChange={e => setNewDiscount({...newDiscount, type: e.target.value})}
               >
                 <option value="Fixed">₹ Flat</option>
                 <option value="Percentage">% Off</option>
               </select>
               <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
                 <ChevronDown className="h-4 w-4 text-slate-400" />
               </div>
             </div>
             <input 
               type="number" 
               placeholder="Value" 
               className="w-24 px-3 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm" 
               value={newDiscount.value} 
               onChange={e => setNewDiscount({...newDiscount, value: e.target.value})} 
               required 
             />
             <button className="bg-emerald-600 hover:bg-emerald-700 px-4 rounded-lg transition-colors flex items-center justify-center">
               <PlusCircle className="w-5 h-5 text-white" />
             </button>
          </form>
          {/* List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {discounts.map(d => (
               <div key={d._id} className="flex justify-between items-center bg-slate-50 hover:bg-slate-100 p-4 rounded-lg border border-slate-200 transition-colors">
                 <div>
                   <span className="font-semibold text-slate-800">{d.name}</span>
                   <span className="text-xs text-slate-500 ml-2">({d.targetCategory})</span>
                 </div>
                 <div className="flex gap-4 items-center">
                    <span className="text-emerald-600 font-mono font-bold">
                      {d.type === 'Fixed' ? `₹${d.value}` : `${d.value}%`}
                    </span>
                    <button 
                      onClick={() => handleDeleteDiscount(d._id)} 
                      className="text-red-600 hover:text-red-700 transition-colors"
                      title="Delete Discount"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                 </div>
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* ZONE 2: PENALTY TERMINAL (Fines Only) */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="text-indigo-600 w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Penalty Terminal</h2>
              <p className="text-sm text-slate-600">Apply fines to residents</p>
            </div>
        </div>

        <form onSubmit={handleApplyFine} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            
            {/* Select Student */}
            <div className="md:col-span-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Resident</label>
                <select className="w-full px-3 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} required>
                  <option value="">-- Search Resident --</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name} {s.room ? `(Room ${s.room.roomNumber})` : '(No Room)'}</option>)}
                </select>
            </div>

            {/* Fine Details */}
            <div className="md:col-span-8 flex gap-3">
               <input 
                 type="text" 
                 placeholder="Violation / Reason (e.g. Broken Lock)" 
                 className="flex-1 px-3 py-2.5 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                 value={fineReason} 
                 onChange={e => setFineReason(e.target.value)} 
                 required
               />
               <input 
                 type="number" 
                 placeholder="Amount (₹)" 
                 className="w-32 px-3 py-2.5 rounded-lg bg-white border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all font-mono" 
                 value={fineAmount} 
                 onChange={e => setFineAmount(e.target.value)} 
                 required
               />
               
               <button type="submit" className="px-6 py-2.5 rounded-lg font-bold shadow-lg shadow-indigo-200 bg-indigo-600 hover:bg-indigo-700 text-white transition-all hover:scale-105 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  APPLY FINE
               </button>
            </div>
        </form>
      </div>
      </div>
    </AdminLayout>
  );
}

export default BillingDashboard;