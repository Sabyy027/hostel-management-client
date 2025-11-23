import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Building2, Mail, ArrowLeft, CheckCircle } from 'lucide-react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post(
        apiClient.defaults.baseURL + '/auth/forgot-password',
        { email }
      );

      setLoading(false);
      setSuccess(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      setLoading(false);
      
      if (err.response && err.response.data && err.response.data.message) {
        setError({
          message: err.response.data.message,
          notRegistered: err.response.data.notRegistered
        });
      } else {
        setError({ message: 'Failed to send reset email. Please try again.' });
      }
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen bg-slate-50">
        {/* Left Side - Same gradient as login */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-center items-center w-full p-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Building2 className="text-white" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">HMS</h1>
                <p className="text-indigo-100 text-sm">Hostel Management System</p>
              </div>
            </div>
            <CheckCircle className="text-white mb-4" size={80} />
            <h2 className="text-2xl font-bold text-white text-center">Check Your Email</h2>
          </div>
        </div>

        {/* Right Side - Success Message */}
        <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="lg:hidden inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <CheckCircle className="text-green-600" size={32} />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-2">
                Check Your Email
              </h2>
              <p className="text-slate-500">We've sent you a password reset link</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-center text-sm text-green-700">
                  A password reset link has been sent to <strong>{email}</strong>
                </p>
              </div>

              <div className="space-y-4 text-sm text-slate-600">
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold">1.</span>
                  <p>Check your inbox for an email from HMS</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold">2.</span>
                  <p>Click the reset link in the email (valid for 1 hour)</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-indigo-600 font-bold">3.</span>
                  <p>Enter your new password</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200">
                <p className="text-xs text-slate-500 text-center mb-4">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Left Side - Same gradient as login */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-indigo-600 to-purple-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Building2 className="text-white" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">HMS</h1>
              <p className="text-indigo-100 text-sm">Hostel Management System</p>
            </div>
          </div>
          <Mail className="text-white mb-4" size={80} />
          <h2 className="text-2xl font-bold text-white text-center">Reset Your Password</h2>
          <p className="text-indigo-100 text-center mt-2">We'll send you a secure link to reset your password</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Mail className="text-indigo-600" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">HMS</h2>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Forgot Password?
            </h2>
            <p className="text-slate-500">Enter your email to receive a reset link</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label 
                  htmlFor="email" 
                  className="mb-2 block text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-colors"
                  placeholder="your-email@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                  <p className="text-center text-sm text-red-700 font-medium mb-2">
                    {error.message || error}
                  </p>
                  {error.notRegistered && (
                    <div className="text-center mt-3">
                      <Link 
                        to="/signup" 
                        className="inline-block text-sm text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                      >
                        Sign up here →
                      </Link>
                    </div>
                  )}
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
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="flex items-center justify-center gap-2 text-sm text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-500">
            This feature is only available for students and staff members
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
