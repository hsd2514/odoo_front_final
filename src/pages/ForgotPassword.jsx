import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import { forgotPassword } from '../services/auth';

const ForgotPassword = () => {
  const [form, setForm] = useState({
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear messages when user starts typing
    if (message) setMessage('');
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await forgotPassword(form.email);
      setMessage(response.message || 'Password reset email sent successfully!');
      setForm({ email: '' }); // Clear form on success
    } catch (err) {
      const errorMessage = err?.response?.data?.detail || 'Failed to send reset email. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-neutral mb-2">Forgot Password</h1>
        <p className="text-neutral/60 text-sm">
          Enter your email address and we'll send you a link to reset your password.
        </p>
      </div>

      {message && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800 text-sm">{message}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-neutral mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full h-12 px-4 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter your email address"
          />
        </div>

        <button 
          type="submit"
          className="w-full h-12 rounded-xl text-sm font-medium tracking-wide bg-black text-white hover:bg-neutral-800 transition disabled:opacity-70 shadow-[0_1px_2px_rgba(0,0,0,0.25)]" 
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link to="/auth/login" className="text-neutral/80 hover:text-neutral transition-colors text-sm">
          ← Back to Sign In
        </Link>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Check your email</p>
            <p>We'll send you a secure link to reset your password. The link will expire in 15 minutes.</p>
          </div>
        </div>
      </div>
    </AuthCard>
  );
};

export default ForgotPassword;
