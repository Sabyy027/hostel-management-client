import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; 

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
        'http://localhost:4000/api/auth/login',
        loginData
      );

      // 7. Handle success & Store Data
      console.log('Login successful:', response.data);
      setLoading(false);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      const user = response.data.user;

      // --- NEW LOGIC: CHECK FIRST LOGIN ---
      if (user.isFirstLogin) {
        navigate('/change-password');
        return; // Stop here, don't redirect to dashboard yet
      }
      // ------------------------------------

      // Normal Redirects
      if (user.role === 'admin' || user.role === 'warden') {
        navigate('/dashboard'); 
      } else if (user.role === 'staff') {
        navigate('/staff/dashboard'); 
      } else {
        navigate('/dashboard'); // Student
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
    <div className="flex h-screen items-center justify-center bg-gray-900 px-6">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-white">
          Welcome Back
        </h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label 
              htmlFor="email" 
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="john@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-900/50 border border-red-500 p-3">
              <p className="text-center text-sm text-red-200">
                {error}
              </p>
            </div>
          )}

          {/* 12. Update button for loading state */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Logging In...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-blue-500 hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;