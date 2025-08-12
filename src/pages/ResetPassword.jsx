import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import { resetPassword } from '../services/auth';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    new_password: '',
    confirm_password: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }
    setToken(tokenFromUrl);
  }, [searchParams]);

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
    
    if (form.new_password !== form.confirm_password) {
      setError('Passwords do not match');
      return;
    }

    if (form.new_password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await resetPassword(token, form.new_password, form.confirm_password);
      setMessage(response.message || 'Password reset successfully!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/auth/login');
      }, 3000);
    } catch (err) {
      const errorMessage = err?.response?.data?.detail || 'Failed to reset password. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!token && !error) {
    return (
      <AuthCard>
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-neutral/60">Loading...</p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-neutral mb-2">Reset Password</h1>
        <p className="text-neutral/60 text-sm">
          Enter your new password below.
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
          <p className="text-green-700 text-xs mt-2">Redirecting to login page...</p>
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
          {error.includes('Invalid reset link') && (
            <Link 
              to="/auth/forgot-password" 
              className="text-red-700 hover:text-red-800 text-xs mt-2 inline-block underline"
            >
              Request new reset link
            </Link>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="new_password" className="block text-sm font-medium text-neutral mb-2">
            New Password
          </label>
          <input
            type="password"
            id="new_password"
            name="new_password"
            value={form.new_password}
            onChange={handleChange}
            required
            minLength={6}
            className="w-full h-12 px-4 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Enter new password (min 6 characters)"
          />
        </div>

        <div>
          <label htmlFor="confirm_password" className="block text-sm font-medium text-neutral mb-2">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirm_password"
            name="confirm_password"
            value={form.confirm_password}
            onChange={handleChange}
            required
            className="w-full h-12 px-4 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            placeholder="Confirm new password"
          />
        </div>

        <button 
          type="submit"
          className="w-full h-12 rounded-xl text-sm font-medium tracking-wide bg-black text-white hover:bg-neutral-800 transition disabled:opacity-70 shadow-[0_1px_2px_rgba(0,0,0,0.25)]" 
          disabled={loading || !token}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
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
            <p className="font-medium mb-1">Password requirements</p>
            <p>Your password must be at least 6 characters long. Choose a strong password for better security.</p>
          </div>
        </div>
      </div>
    </AuthCard>
  );
};

export default ResetPassword;
