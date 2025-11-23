import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { Home, Building2, Users, ShieldCheck, Eye, EyeOff, Mail, Lock, LogIn } from 'lucide-react'; 
import apiClient from '../api/axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 3. Add loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // 4. Get the navigate function

  // Hostel images carousel
  const hostelImages = [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80', // Modern hostel room
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80', // Hostel common area
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80', // Student studying
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % hostelImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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
      {/* Left Side - Image Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Image Carousel */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-16">
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Building2 className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">HMS</h1>
                <p className="text-indigo-100 text-sm">Hostel Management System</p>
              </div>
            </div>
          </div>

          {/* Image Slider */}
          <div className="relative w-full max-w-lg">
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
              {hostelImages.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Hostel ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>
              ))}
            </div>

            {/* Image Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {hostelImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'w-8 bg-white'
                      : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-3 gap-6 w-full max-w-lg">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="text-white" size={24} />
              </div>
              <p className="text-white text-sm font-medium">500+ Students</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-3">
                <Building2 className="text-white" size={24} />
              </div>
              <p className="text-white text-sm font-medium">Modern Facilities</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center mx-auto mb-3">
                <ShieldCheck className="text-white" size={24} />
              </div>
              <p className="text-white text-sm font-medium">24/7 Security</p>
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