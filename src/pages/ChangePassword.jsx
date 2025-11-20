import React, { useState } from 'react';
import apiClient from '../api/axios';
import { useNavigate } from 'react-router-dom';

function ChangePassword() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return alert("Passwords do not match");
    
    try {
      await apiClient.post('/auth/change-password', { newPassword: password });
      
      // Update the local user object so the app knows they are verified
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        user.isFirstLogin = false;
        localStorage.setItem('user', JSON.stringify(user));
      }

      alert("Password Updated! Welcome to the Dashboard.");
      
      // Redirect to Staff Dashboard
      navigate('/staff/dashboard');
      
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-red-500">
        <h1 className="text-2xl font-bold text-white mb-2">Security Update Required</h1>
        <p className="text-gray-400 mb-6 text-sm">
          Since this is your first login, you must create a new, secure password to continue.
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">New Password</label>
            <input 
              type="password" 
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:border-blue-500"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              minLength={6}
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Confirm Password</label>
            <input 
              type="password" 
              className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:border-blue-500"
              value={confirm} 
              onChange={e => setConfirm(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 py-2 rounded font-bold text-white mt-4">
            Set Password & Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;