import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; 
import axios from 'axios'; // <-- 2. Import axios

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
        'http://localhost:4000/api/auth/signup', // Your backend API URL
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

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 px-6">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-white">
          Create Your Account
        </h2>
        
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* ... (Username and Email fields - no changes) ... */}
          <div>
            <label 
              htmlFor="username" 
              className="mb-2 block text-sm font-medium text-gray-300"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full rounded-lg border border-gray-600 bg-gray-700 p-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
              placeholder="johndoe"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

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


          {/* 9. Show error message if it exists */}
          {error && (
            <p className="text-center text-sm text-red-400">
              {error}
            </p>
          )}

          {/* 10. Disable button and show text while loading */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800 disabled:opacity-50"
            disabled={loading} // Disable button when loading
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;