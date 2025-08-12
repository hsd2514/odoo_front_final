// Register.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import Navbar from '../components/Navbar';
import PasswordField from '../components/PasswordField';
import { auth } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { getValidationError } from '../utils/validation';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName:'', email:'', phone:'', password:'', confirmPassword:'' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validate phone number
    if (form.phone) {
      const phoneError = getValidationError('Phone Number', form.phone, 'phone');
      if (phoneError) errors.phone = phoneError;
    }
    
    // Validate email
    if (form.email) {
      const emailError = getValidationError('Email', form.email, 'email');
      if (emailError) errors.email = emailError;
    }
    
    // Validate password match
    if (form.password !== form.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await auth.register({
        full_name: form.fullName,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirm_password: form.confirmPassword,
      });
      setSuccess('Account created successfully. Redirecting to login...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      setError(err?.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle={<span>Already have an account? <Link to="/login" className="link link-primary">Sign in</Link></span>}
      topLeftContent={<Navbar />}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">{error}</div>}
        {success && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-2">{success}</div>}
        <div className="form-control">
          <label className="label font-medium text-[13px]" htmlFor="fullName">Full Name</label>
          <input 
            id="fullName" 
            name="fullName" 
            type="text" 
            className="w-full rounded-xl border border-neutral/20 bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 focus:ring-neutral/10 focus:border-neutral/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]" 
            placeholder="Full Name" 
            value={form.fullName} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-control">
          <label className="label font-medium text-[13px]" htmlFor="email">Email</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            className={`w-full rounded-xl border transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 focus:ring-neutral/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] ${
              fieldErrors.email 
                ? 'border-red-300 bg-red-50 focus:bg-red-50 focus:border-red-400 focus:ring-red-100' 
                : 'border-neutral/20 bg-[#f4f6fa] focus:bg-white focus:border-neutral/40 focus:ring-neutral/10'
            }`}
            placeholder="Email" 
            value={form.email} 
            onChange={handleChange} 
            required 
          />
          {fieldErrors.email && (
            <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {fieldErrors.email}
            </div>
          )}
        </div>
        <div className="form-control">
          <label className="label font-medium text-[13px]" htmlFor="phone">Phone Number</label>
          <input 
            id="phone" 
            name="phone" 
            type="tel" 
            className={`w-full rounded-xl border transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 focus:ring-neutral/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] ${
              fieldErrors.phone 
                ? 'border-red-300 bg-red-50 focus:bg-red-50 focus:border-red-400 focus:ring-red-100' 
                : 'border-neutral/20 bg-[#f4f6fa] focus:bg-white focus:border-neutral/40 focus:ring-neutral/10'
            }`}
            placeholder="Phone Number" 
            value={form.phone} 
            onChange={handleChange} 
            required 
          />
          {fieldErrors.phone && (
            <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {fieldErrors.phone}
            </div>
          )}
        </div>
        <PasswordField name="password" label="Password" value={form.password} onChange={handleChange} placeholder="Password" required showStrength />
        <div className="form-control">
          <label className="label font-medium text-[13px]" htmlFor="confirmPassword">Confirm Password</label>
          <div className="relative group">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={`w-full rounded-xl border transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 focus:ring-neutral/10 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] ${
                fieldErrors.confirmPassword 
                  ? 'border-red-300 bg-red-50 focus:bg-red-50 focus:border-red-400 focus:ring-red-100' 
                  : 'border-neutral/20 bg-[#f4f6fa] focus:bg-white focus:border-neutral/40 focus:ring-neutral/10'
              }`}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>
          {fieldErrors.confirmPassword && (
            <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {fieldErrors.confirmPassword}
            </div>
          )}
        </div>
        <button className="w-full h-12 rounded-xl text-sm font-medium tracking-wide bg-black text-white hover:bg-neutral-800 transition disabled:opacity-70 shadow-[0_1px_2px_rgba(0,0,0,0.25)]" disabled={loading}>{loading ? 'Creating…' : 'Create Account'}</button>
      </form>
    </AuthCard>
  );
};

export default Register;
