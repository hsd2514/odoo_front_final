// Login.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import Navbar from '../components/Navbar';
import PasswordField from '../components/PasswordField';
import { auth, setAuthToken } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', remember:false });

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'email':
        if (!value) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Please enter a valid email address';
        break;
      case 'password':
        if (!value) error = 'Password is required';
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(form).forEach(key => {
      if (key !== 'remember') { // Skip checkbox validation
        const error = validateField(key, form[key]);
        if (error) errors[key] = error;
      }
    });
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
    try {
      const result = await auth.login({
        email: form.email,
        password: form.password,
        remember: form.remember,
      });
      const token = result?.access_token || result?.token || result?.data?.access_token || result?.data?.token;
      if (token) setAuthToken(token);
      navigate('/home');
    } catch (err) {
      setError(err?.message || 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const getInputClassName = (fieldName) => {
    const baseClasses = "w-full rounded-xl border bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]";
    const errorClasses = fieldErrors[fieldName] ? "border-red-300 focus:ring-red-100 focus:border-red-400" : "border-neutral/20 focus:ring-neutral/10 focus:border-neutral/40";
    return `${baseClasses} ${errorClasses}`;
  };

  return (
    <AuthCard
      title="Welcome Back"
      subtitle={<span>Enter your email and password to access your account</span>}
      footer={<span>Don't have an account? <Link to="/register" className="link link-primary">Create one</Link></span>}
      topLeftContent={<Navbar />}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">{error}</div>}
        
        <div className="form-control">
          <label className="label font-medium text-[13px]" htmlFor="email">Email</label>
          <input 
            id="email" 
            name="email" 
            type="email" 
            className={getInputClassName('email')}
            placeholder="Enter your email" 
            value={form.email} 
            onChange={handleChange}
            onBlur={handleBlur}
            required 
          />
          {fieldErrors.email && (
            <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
              <span className="w-1 h-1 bg-red-500 rounded-full"></span>
              {fieldErrors.email}
            </div>
          )}
        </div>
        
        <PasswordField 
          name="password" 
          label="Password" 
          value={form.password} 
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your password" 
          required 
          error={fieldErrors.password}
        />
        
        <div className="flex items-center justify-between text-[13px]">
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input 
              type="checkbox" 
              name="remember" 
              checked={form.remember} 
              onChange={handleChange} 
              className="checkbox checkbox-sm rounded-[4px] [--chkbg:#111] [--chkfg:white]" 
            />
            <span className="text-neutral/80">Remember me</span>
          </label>
          <Link to="/forgot" className="text-neutral/80 hover:text-neutral transition-colors">Forgot Password</Link>
        </div>
        
        <button 
          className="w-full h-12 rounded-xl text-sm font-medium tracking-wide bg-black text-white hover:bg-neutral-800 transition disabled:opacity-70 shadow-[0_1px_2px_rgba(0,0,0,0.25)]" 
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>
    </AuthCard>
  );
};

export default Login;
