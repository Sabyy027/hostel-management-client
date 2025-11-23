import React, { useState } from 'react';
import apiClient from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useUI } from '../context/UIContext';

function ChangePassword() {
  const { showToast, showLoading, hideLoading } = useUI();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return showToast("Passwords do not match", 'warning');
    
    try {
      showLoading('Updating password...');
      await apiClient.post('/auth/change-password', { newPassword: password });
      
      // Update the local user object so the app knows they are verified
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) {
        user.isFirstLogin = false;
        localStorage.setItem('user', JSON.stringify(user));
      }

      hideLoading();
      showToast("Password Updated! Welcome to the Dashboard.", 'success', 3000);
      
      // Redirect to Staff Dashboard
      setTimeout(() => navigate('/staff/dashboard'), 1000);
      
    } catch (err) {
      hideLoading();
      showToast(err.response?.data?.message || "Failed to update password", 'error');
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