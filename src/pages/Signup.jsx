import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { Home, Users, UserPlus, Mail, Lock, User, Building2 } from 'lucide-react';
import apiClient from '../api/axios';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 3. Add loading and error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate(); // 4. Get the navigate function

  // 5. Make the submit handler async
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(null); // Clear previous errors
    setLoading(true); // Start loading

    // This is the data we'll send to the server
    const signupData = { username, email, password };

    try {
      // 6. Send the POST request to your backend
      const response = await axios.post(
        apiClient.defaults.baseURL + '/auth/signup', // Uses axios.js base URL
        signupData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      // 7. Handle success
      console.log('Signup successful:', response.data);
      setLoading(false);
      
      // Navigate to the login page on success
      navigate('/login');

    } catch (err) {
      // 8. Handle errors
      console.error('Signup error:', err);
      setLoading(false);
      
      // Set the error message from the server's response
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Signup failed. Please try again.');
      }
    }
  };

  // Hostel images carousel (same as login)
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hostelImages = [
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=80',
    'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80',
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % hostelImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50 overflow-hidden">
      {/* Left Side - Image Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Image Carousel */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-16">
          <div className="mb-12 text-center">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Welcome to HMS
            </h1>
            <p className="text-xl text-indigo-100">
              Your home away from home
            </p>
          </div>

          {/* Image Container */}
          <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            {hostelImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Hostel ${index + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                  index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
            
            {/* Image Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {hostelImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex 
                      ? 'bg-white w-8' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="mt-12 grid grid-cols-2 gap-6 text-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Home className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Comfortable Rooms</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium">Community Living</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Signup Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-6 lg:px-16 lg:py-12">
        <div className="w-full max-w-md">
          {/* Mobile Header */}
          <div className="lg:hidden -mx-6 -mt-6 mb-6 bg-gradient-to-br from-indigo-600 to-purple-700 p-6 pb-12 rounded-b-[2.5rem] shadow-xl text-center relative overflow-hidden">
             {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-[-50%] left-[-20%] w-64 h-64 bg-white rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-[-20%] right-[-20%] w-64 h-64 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl mb-4 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 transform hover:scale-105 transition-transform duration-300">
                <Building2 className="text-white drop-shadow-md" size={40} />
              </div>
              <h2 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-sm">HMS</h2>
              <p className="text-indigo-100 text-sm font-medium mt-2 tracking-wide uppercase opacity-90">Hostel Management System</p>
            </div>
          </div>

          {/* Logo/Icon Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
              <UserPlus className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Create Your Account
            </h2>
            <p className="text-slate-500">Join us to book your hostel room</p>
          </div>

          {/* Main Card */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label 
                htmlFor="username" 
                className="mb-2 block text-sm font-medium text-slate-700 flex items-center gap-2"
              >
                <User className="w-4 h-4 text-slate-500" />
                Username
              </label>
              <input
                type="text"
                id="username"
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                placeholder="johndoe"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

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
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
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
              <input
                type="password"
                id="password"
                className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-800 placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-colors"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="mt-1 text-xs text-slate-500">
                Must be at least 6 characters
              </p>
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
              className="w-full rounded-lg bg-emerald-600 px-5 py-3 text-center text-base font-medium text-white hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-700 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Text */}
        <p className="mt-6 text-center text-xs text-slate-500">
          By signing up, you agree to our Terms of Service and Privacy Policy
        </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;