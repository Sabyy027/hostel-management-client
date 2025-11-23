import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { Building2, Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react'; 
import apiClient from '../api/axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // 3. Add loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // 4. Get the navigate function

  // 5. Make the submit handler async
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const loginData = { email, password };

    try {
      // 6. Send the POST request to your login endpoint
      const response = await axios.post(
        apiClient.defaults.baseURL + '/auth/login',
        loginData
      );

      // 7. Handle success & Store Data
      console.log('Login successful:', response.data);
      setLoading(false);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Store booking status
      const hasBooking = response.data.hasBooking || false;
      localStorage.setItem('hasBooking', hasBooking.toString());
      
      const user = response.data.user;

      // --- NEW LOGIC: CHECK FIRST LOGIN ---
      if (user.isFirstLogin) {
        navigate('/change-password');
        return; // Stop here, don't redirect to dashboard yet
      }
      // ------------------------------------

      // Normal Redirects
      if (user.role === 'admin' || user.role === 'warden' || user.role === 'resident tutor') {
        navigate('/dashboard'); 
      } else if (user.role === 'staff') {
        navigate('/staff/dashboard'); 
      } else {
        // Students redirect based on booking status
        navigate(hasBooking ? '/dashboard' : '/my-booking');
      }

    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response?.data);
      setLoading(false);
      
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else if (err.response) {
        setError(`Server error: ${err.response.status}. Please check backend logs.`);
      } else if (err.request) {
        setError('No response from server. Is the backend running on port 4000?');
      } else {
        setError('Login failed. Please try again.');
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Side - Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden">
        {/* Branding Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-16">
          <div className="flex flex-col items-center">
            {/* Rounded Square Icon with Building */}
            <div className="mb-8">
              <div className="w-24 h-24 bg-indigo-500/80 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl">
                <Building2 className="text-white" size={48} />
              </div>
            </div>
            
            {/* HMS Text */}
            <div className="text-center">
              <h1 className="text-6xl font-bold text-white mb-4 tracking-tight">
                HMS
              </h1>
              <p className="text-xl text-indigo-100 font-medium">
                Hostel Management System
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Building2 className="text-indigo-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">HMS</h2>
          </div>

          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-full mb-4">
              <LogIn className="w-7 h-7 text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-500">Sign in to your hostel account</p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label 
                htmlFor="email" 
                className="mb-2 block text-sm font-medium text-slate-700 flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-slate-500" />
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                placeholder="john@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="mb-2 block text-sm font-medium text-slate-700 flex items-center gap-2"
              >
                <Lock className="w-4 h-4 text-slate-500" />
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 pr-12 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="mt-2 text-right">
                <Link 
                  to="/forgot-password" 
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-center text-sm text-red-700 font-medium">
                  {error}
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 px-5 py-3 text-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                  Sign up now
                </Link>
              </p>
            </div>
          </div>

          {/* Footer Text */}
          <p className="mt-6 text-center text-xs text-slate-500">
            By signing in, you agree to our Terms of Service
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;