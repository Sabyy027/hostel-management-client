import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import AdminLayout from '../../components/AdminLayout';

function StaffManager() {
  const [activeTab, setActiveTab] = useState('direct'); // 'direct' or 'link'
  const [staffList, setStaffList] = useState([]);
  const [inviteLink, setInviteLink] = useState('');
  
  // Detailed Form State
  const [form, setForm] = useState({
    username: '', email: '', age: '', gender: 'Male', phoneNumber: '', 
    altPhoneNumber: '', address: '', designation: 'Electrician'
  });

  const fetchStaff = async () => {
    try {
      const res = await apiClient.get('/users/staff');
      setStaffList(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchStaff(); }, []);

  // --- METHOD 1 HANDLER ---
  const handleDirectCreate = async (e) => {
    e.preventDefault();
    if (!window.confirm(`Confirm creating staff: ${form.username}? Credentials will be emailed.`)) return;
    
    try {
      console.log('Sending staff data:', form); // Debug: Check what's being sent
      await apiClient.post('/users/create-staff-direct', form);
      alert('Staff Created & Email Sent!');
      fetchStaff();
      setForm({ username: '', email: '', age: '', gender: 'Male', phoneNumber: '', altPhoneNumber: '', address: '', designation: 'Electrician' });
    } catch (err) { 
      console.error('Full error:', err);
      console.error('Response data:', err.response?.data);
      alert('Error: ' + (err.response?.data?.message || 'Server error - check console')); 
    }
  };

  // --- METHOD 2 HANDLER ---
  const generateLink = async () => {
    try {
      const res = await apiClient.post('/users/generate-invite');
      setInviteLink(res.data.link);
    } catch (err) { alert('Error generating link'); }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    alert("Link Copied!");
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manage Staff</h1>
        <p className="text-sm text-slate-500">Create and manage staff accounts</p>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        {/* TABS */}
        <div className="flex border-b border-gray-700 mb-6">
          <button onClick={() => setActiveTab('direct')} className={`px-4 py-2 font-bold ${activeTab === 'direct' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>
            Method 1: Direct Add
          </button>
          <button onClick={() => setActiveTab('link')} className={`px-4 py-2 font-bold ${activeTab === 'link' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}>
            Method 2: Invite Link
          </button>
        </div>

        {/* --- METHOD 1 FORM --- */}
        {activeTab === 'direct' && (
          <form onSubmit={handleDirectCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            <input type="text" placeholder="Full Name" className="p-2 rounded bg-gray-700 text-white" 
              value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
            
            <input type="email" placeholder="Email (Login ID)" className="p-2 rounded bg-gray-700 text-white" 
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            
            <input type="text" placeholder="Phone Number" className="p-2 rounded bg-gray-700 text-white" 
              value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} required />

            <input type="text" placeholder="Alt Phone (Optional)" className="p-2 rounded bg-gray-700 text-white" 
              value={form.altPhoneNumber} onChange={e => setForm({...form, altPhoneNumber: e.target.value})} />
            
            <div className="grid grid-cols-2 gap-4">
              <input type="number" placeholder="Age" className="p-2 rounded bg-gray-700 text-white" 
                value={form.age} onChange={e => setForm({...form, age: e.target.value})} required />
              
              <select className="p-2 rounded bg-gray-700 text-white"
                value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <select className="p-2 rounded bg-gray-700 text-white" 
              value={form.designation} onChange={e => setForm({...form, designation: e.target.value})}>
              <option>Electrician</option><option>Plumber</option><option>Carpenter</option>
              <option>Cleaner</option><option>Warden</option><option>Resident Tutor</option>
            </select>

            <textarea placeholder="Full Address" className="md:col-span-2 p-2 rounded bg-gray-700 text-white h-20"
              value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />

            <button type="submit" className="md:col-span-2 bg-green-600 hover:bg-green-700 p-2 rounded font-bold text-white">
              Create & Send Credentials
            </button>
          </form>
        )}

        {/* --- METHOD 2 GENERATOR --- */}
        {activeTab === 'link' && (
          <div className="text-center py-8 animate-fade-in">
            <p className="text-gray-300 mb-4">Generate a unique link for staff to register themselves.</p>
            <button onClick={generateLink} className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded font-bold text-white mb-4">
              Generate New Link
            </button>
            
            {inviteLink && (
              <div className="bg-gray-900 p-4 rounded border border-gray-600 flex items-center justify-between max-w-2xl mx-auto">
                <code className="text-blue-300 text-sm overflow-hidden text-ellipsis">{inviteLink}</code>
                <button onClick={copyLink} className="ml-4 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded text-xs text-white">
                  Copy
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Staff List Display (Same as before) */}
      <h2 className="text-xl font-bold mb-4">Staff Directory</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staffList.map(staff => (
          <div key={staff._id} className="bg-gray-900 p-4 rounded border border-gray-700">
            <div className="flex justify-between">
              <div className="font-bold text-lg text-white">{staff.username}</div>
              <div className="text-blue-400 text-sm uppercase">{staff.designation}</div>
            </div>
            <div className="text-slate-500 text-xs mt-1">{staff.email}</div>
            <div className="text-slate-500 text-xs">Ph: {staff.phoneNumber}</div>
          </div>
        ))}
      </div>
      </div>
    </AdminLayout>
  );
}
export default StaffManager;