import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import { Trash2, PlusCircle, Tag, Wifi, AlertCircle, Zap } from 'lucide-react';
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

  return (
    <AdminLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Billing & Services</h1>
        <p className="text-sm text-slate-500">Manage services, discounts, and fines</p>
      </div>

      {/* ZONE 1: CONFIGURATION (Services & Discounts) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEFT: SERVICE LIBRARY */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
            <div className="flex items-center gap-2">
              <Wifi className="text-blue-400" />
              <h2 className="text-xl font-bold text-blue-400">Service Library</h2>
            </div>
            <button 
              onClick={initMess}
              className="text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
            >
              Init Mess Service
            </button>
          </div>

          {/* Edit Modal */}
          {editingService && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-gray-800 p-6 rounded-xl max-w-lg w-full border border-gray-700">
                <h3 className="text-xl font-bold text-white mb-4">Edit Service</h3>
                <form onSubmit={handleUpdateService} className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Service Name</label>
                    <input 
                      type="text" 
                      className="w-full p-2 rounded bg-gray-900 text-white text-sm" 
                      value={editingService.name} 
                      onChange={e => setEditingService({...editingService, name: e.target.value})} 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Description</label>
                    <textarea 
                      className="w-full p-2 rounded bg-gray-900 text-white text-sm" 
                      rows="2"
                      value={editingService.description || ''} 
                      onChange={e => setEditingService({...editingService, description: e.target.value})} 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Price (₹)</label>
                      <input 
                        type="number" 
                        className="w-full p-2 rounded bg-gray-900 text-white text-sm" 
                        value={editingService.price} 
                        onChange={e => setEditingService({...editingService, price: e.target.value})} 
                        required 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Period</label>
                      <select 
                        className="w-full p-2 rounded bg-gray-900 text-white text-sm" 
                        value={editingService.period} 
                        onChange={e => setEditingService({...editingService, period: e.target.value})}
                      >
                        <option>One-Time</option>
                        <option>Monthly</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Service Type</label>
                    <select 
                      className="w-full p-2 rounded bg-gray-900 text-white text-sm" 
                      value={editingService.serviceType} 
                      onChange={e => setEditingService({...editingService, serviceType: e.target.value})}
                      disabled={editingService.isPredefined}
                    >
                      <option value="General">General</option>
                      <option value="WiFi">WiFi</option>
                      <option value="Mess">Mess</option>
                    </select>
                  </div>
                  {editingService.serviceType !== 'Mess' && (
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Credentials (WiFi ID/Password)</label>
                      <textarea 
                        className="w-full p-2 rounded bg-gray-900 text-white text-sm font-mono" 
                        rows="3"
                        placeholder="Username: wifi123&#10;Password: pass456"
                        value={editingService.credentials || ''} 
                        onChange={e => setEditingService({...editingService, credentials: e.target.value})} 
                      />
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
                      Update Service
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setEditingService(null)}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Create Form */}
          <form onSubmit={handleCreateService} className="mb-4 space-y-2">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Service Name" 
                className="flex-1 p-2 rounded bg-gray-900 text-sm text-white" 
                value={newService.name} 
                onChange={e => setNewService({...newService, name: e.target.value})} 
                required 
              />
              <input 
                type="number" 
                placeholder="Price" 
                className="w-24 p-2 rounded bg-gray-900 text-sm text-white" 
                value={newService.price} 
                onChange={e => setNewService({...newService, price: e.target.value})} 
                required 
              />
            </div>
            <div className="flex gap-2">
              <select 
                className="flex-1 p-2 rounded bg-gray-900 text-sm text-white" 
                value={newService.period} 
                onChange={e => setNewService({...newService, period: e.target.value})}
              >
                <option>One-Time</option>
                <option>Monthly</option>
              </select>
              <select 
                className="flex-1 p-2 rounded bg-gray-900 text-sm text-white" 
                value={newService.serviceType} 
                onChange={e => setNewService({...newService, serviceType: e.target.value})}
              >
                <option value="General">General</option>
                <option value="WiFi">WiFi</option>
              </select>
              <button type="submit" className="bg-blue-600 px-4 rounded hover:bg-blue-700">
                <PlusCircle size={18}/>
              </button>
            </div>
            {newService.serviceType === 'WiFi' && (
              <textarea 
                placeholder="WiFi Credentials (ID/Pass)" 
                className="w-full p-2 rounded bg-gray-900 text-sm text-white font-mono" 
                rows="2"
                value={newService.credentials} 
                onChange={e => setNewService({...newService, credentials: e.target.value})} 
              />
            )}
          </form>

          {/* List */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {services.map(s => (
               <div key={s._id} className="bg-gray-700/50 p-3 rounded text-sm">
                 <div className="flex justify-between items-start mb-1">
                   <div className="flex-1">
                     <div className="flex items-center gap-2">
                       <span className="font-semibold text-white">{s.name}</span>
                       {s.serviceType === 'Mess' && (
                         <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded">MESS</span>
                       )}
                       {s.serviceType === 'WiFi' && (
                         <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded">WiFi</span>
                       )}
                     </div>
                     <span className="text-xs text-gray-400">({s.period})</span>
                   </div>
                   <div className="flex gap-2 items-center">
                      <span className="text-green-400 font-mono">₹{s.price}</span>
                      <button 
                        onClick={() => setEditingService(s)} 
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Edit
                      </button>
                      {!s.isPredefined && (
                        <button 
                          onClick={() => handleDeleteService(s._id)} 
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 size={14}/>
                        </button>
                      )}
                   </div>
                 </div>
                 {s.credentials && (
                   <div className="mt-2 text-xs text-gray-400 bg-gray-900 p-2 rounded">
                     <span className="text-amber-400">🔑</span> Has credentials
                   </div>
                 )}
               </div>
            ))}
          </div>
        </div>

        {/* RIGHT: DISCOUNT RULES */}
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
          <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
            <Tag className="text-green-400" />
            <h2 className="text-xl font-bold text-green-400">Discount Rules</h2>
          </div>
          {/* Form */}
          <form onSubmit={handleCreateDiscount} className="mb-4 flex gap-2">
             <input type="text" placeholder="Name (e.g. Merit)" className="w-1/3 p-2 rounded bg-gray-900 text-sm" value={newDiscount.name} onChange={e => setNewDiscount({...newDiscount, name: e.target.value})} required />
             <select className="w-1/4 p-2 rounded bg-gray-900 text-sm" value={newDiscount.type} onChange={e => setNewDiscount({...newDiscount, type: e.target.value})}>
               <option value="Fixed">₹ Flat</option><option value="Percentage">% Off</option>
             </select>
             <input type="number" placeholder="Val" className="w-1/5 p-2 rounded bg-gray-900 text-sm" value={newDiscount.value} onChange={e => setNewDiscount({...newDiscount, value: e.target.value})} required />
             <button className="bg-green-600 px-3 rounded hover:bg-green-700"><PlusCircle size={18}/></button>
          </form>
          {/* List */}
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {discounts.map(d => (
               <div key={d._id} className="flex justify-between bg-gray-700/50 p-2 rounded text-sm">
                 <span>{d.name} <span className="text-xs text-gray-400">({d.targetCategory})</span></span>
                 <div className="flex gap-3">
                    <span className="text-green-400 font-mono">{d.type === 'Fixed' ? `₹${d.value}` : `${d.value}%`}</span>
                    <button onClick={() => handleDeleteDiscount(d._id)} className="text-red-400"><Trash2 size={14}/></button>
                 </div>
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* ZONE 2: PENALTY TERMINAL (Fines Only) */}
      <div className="bg-red-900/20 border border-red-600/50 rounded-xl p-8 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="text-red-500" size={28} />
            <h2 className="text-2xl font-bold text-white">Penalty Terminal (Apply Fines)</h2>
        </div>

        <form onSubmit={handleApplyFine} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            
            {/* Select Student */}
            <div className="md:col-span-4">
                <label className="block text-sm text-gray-400 mb-2">Select Resident</label>
                <select className="w-full p-3 rounded bg-gray-800 border border-gray-600 text-white focus:border-red-500 outline-none"
                  value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} required>
                  <option value="">-- Search Resident --</option>
                  {students.map(s => <option key={s._id} value={s._id}>{s.name} {s.room ? `(Room ${s.room.roomNumber})` : '(No Room)'}</option>)}
                </select>
            </div>

            {/* Fine Details */}
            <div className="md:col-span-8 flex gap-4">
               <input type="text" placeholder="Violation / Reason (e.g. Broken Lock)" className="flex-1 p-3 rounded bg-gray-800 border border-gray-600" 
                 value={fineReason} onChange={e => setFineReason(e.target.value)} required/>
               <input type="number" placeholder="Amount (₹)" className="w-32 p-3 rounded bg-gray-800 border border-gray-600" 
                 value={fineAmount} onChange={e => setFineAmount(e.target.value)} required/>
               
               <button type="submit" className="px-8 py-3 rounded font-bold shadow-lg bg-red-600 hover:bg-red-700 text-white">
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