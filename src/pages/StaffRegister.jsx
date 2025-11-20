import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';

function StaffRegister() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [form, setForm] = useState({ 
    username: '', email: '', password: '', age: '', gender: 'Male',
    phoneNumber: '', address: '', designation: 'Electrician' 
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/users/staff-signup-via-link', { ...form, token });
      alert('Registration Successful! You can now login.');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed. Link may be expired.');
    }
  };

  if (!token) return <div className="text-white text-center p-20">Invalid Link</div>;

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Staff Self-Registration</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Full Name" className="w-full p-2 rounded bg-gray-700 text-white"
            value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
          
          <input type="email" placeholder="Email" className="w-full p-2 rounded bg-gray-700 text-white"
            value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          
          <input type="password" placeholder="Set Password" className="w-full p-2 rounded bg-gray-700 text-white"
            value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />

          <div className="grid grid-cols-3 gap-4">
            <input type="text" placeholder="Phone" className="col-span-1 p-2 rounded bg-gray-700 text-white"
              value={form.phoneNumber} onChange={e => setForm({...form, phoneNumber: e.target.value})} required />
              
            <input type="number" placeholder="Age" className="col-span-1 p-2 rounded bg-gray-700 text-white"
              value={form.age} onChange={e => setForm({...form, age: e.target.value})} required />

            <select className="col-span-1 p-2 rounded bg-gray-700 text-white"
              value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <select className="w-full p-2 rounded bg-gray-700 text-white"
            value={form.designation} onChange={e => setForm({...form, designation: e.target.value})}>
            <option>Electrician</option><option>Plumber</option><option>Warden</option><option>Resident Tutor</option>
          </select>

          <textarea placeholder="Address" className="w-full p-2 rounded bg-gray-700 text-white h-20"
            value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />

          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded font-bold text-white">
            Complete Registration
          </button>
        </form>
      </div>
    </div>
  );
}
export default StaffRegister;