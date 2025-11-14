import React from 'react';

function Login() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 px-6">
      <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-lg">
        <h2 className="mb-6 text-center text-3xl font-bold text-white">
          Welcome Back
        </h2>
        
        <form className="space-y-6">
          {/* Email Field */}
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
            />
          </div>

          {/* Password Field */}
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
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 text-center text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-800"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{' '}
          <a href="/signup" className="font-medium text-blue-500 hover:underline">
            Sign up now
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;