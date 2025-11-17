import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios';

function StaffManager() {
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({ username: '', email: '', password: '', designation: 'Electrician' });

  const fetchStaff = async () => {
    const res = await apiClient.get('/users/staff');
    setStaffList(res.data);
  };
  useEffect(() => { fetchStaff(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/users/create-staff', form);
      alert('Staff Created!');
      fetchStaff();
      setForm({ username: '', email: '', password: '', designation: 'Electrician' });
    } catch (err) { alert('Error creating staff'); }
  };

  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Staff Management</h1>
      
      {/* Create Form */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Add New Staff</h2>
        <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Name" className="p-2 rounded bg-gray-700" 
            value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
          <input type="email" placeholder="Email" className="p-2 rounded bg-gray-700" 
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input type="password" placeholder="Password" className="p-2 rounded bg-gray-700" 
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
          <select className="p-2 rounded bg-gray-700" 
            value={form.designation} onChange={e => setForm({...form, designation: e.target.value})}>
            <option>Electrician</option>
            <option>Plumber</option>
            <option>Carpenter</option>
            <option>Cleaner</option>
            <option>Resident Tutor</option>
          </select>
          <button type="submit" className="bg-green-600 p-2 rounded font-bold text-white">Create Account</button>
        </form>
      </div>

      {/* Staff List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {staffList.map(staff => (
          <div key={staff._id} className="bg-gray-900 p-4 rounded border border-gray-700">
            <div className="font-bold text-lg">{staff.username}</div>
            <div className="text-blue-400 text-sm uppercase">{staff.designation}</div>
            <div className="text-gray-500 text-xs">{staff.email}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default StaffManager;