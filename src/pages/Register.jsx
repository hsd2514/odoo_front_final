// Register.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import Navbar from '../components/Navbar';
import PasswordField from '../components/PasswordField';
import { auth } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName:'', email:'', phone:'', password:'', confirmPassword:'' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) return alert('Passwords do not match');
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
          <input id="fullName" name="fullName" type="text" className="w-full rounded-xl border border-neutral/20 bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 focus:ring-neutral/10 focus:border-neutral/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
        </div>
        <div className="form-control">
          <label className="label font-medium text-[13px]" htmlFor="email">Email</label>
          <input id="email" name="email" type="email" className="w-full rounded-xl border border-neutral/20 bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 focus:ring-neutral/10 focus:border-neutral/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]" placeholder="Email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-control">
          <label className="label font-medium text-[13px]" htmlFor="phone">Phone Number</label>
          <input id="phone" name="phone" type="tel" className="w-full rounded-xl border border-neutral/20 bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 focus:ring-neutral/10 focus:border-neutral/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]" placeholder="Phone Number" value={form.phone} onChange={handleChange} required />
        </div>
        <PasswordField name="password" label="Password" value={form.password} onChange={handleChange} placeholder="Password" required />
        <PasswordField name="confirmPassword" label="Confirm Password" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
        <button className="w-full h-12 rounded-xl text-sm font-medium tracking-wide bg-black text-white hover:bg-neutral-800 transition disabled:opacity-70 shadow-[0_1px_2px_rgba(0,0,0,0.25)]" disabled={loading}>{loading ? 'Creating…' : 'Create Account'}</button>
      </form>
    </AuthCard>
  );
};

export default Register;
