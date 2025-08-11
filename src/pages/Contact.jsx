import React, { useState } from 'react';
import { api } from '../services/api';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: 'General',
    subject: '',
    message: '',
    subscribe: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await api.request('/contact', { method: 'POST', body: form });
      setSuccess('Thanks! Your message has been sent. We will get back to you shortly.');
      setForm({ fullName: '', email: '', phone: '', inquiryType: 'General', subject: '', message: '', subscribe: true });
    } catch (err) {
      setError(err?.message || 'Failed to send your message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-neutral px-6 py-10">
      <div className="mx-auto max-w-6xl grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section>
          <h1 className="text-[2rem] leading-tight font-serif font-semibold tracking-tight">Contact us</h1>
          <p className="mt-1 text-neutral/70 max-w-prose">Questions about rentals, billing, or partnerships? Send us a message and our team will respond within one business day.</p>

          <div className="mt-6 rounded-2xl bg-white/95 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.05)] ring-1 ring-black/5">
            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
              {error && <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">{error}</div>}
              {success && <div className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-2">{success}</div>}

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="fullName" className="block text-[13px] font-medium mb-1">Full name</label>
                  <input id="fullName" name="fullName" value={form.fullName} onChange={handleChange} required className="w-full rounded-xl border border-neutral/20 bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 focus:ring-neutral/10 focus:border-neutral/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]" placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-[13px] font-medium mb-1">Email</label>
                  <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="w-full rounded-xl border border-neutral/20 bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 focus:ring-neutral/10 focus:border-neutral/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]" placeholder="you@example.com" />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-[13px] font-medium mb-1">Phone (optional)</label>
                  <input id="phone" name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-xl border border-neutral/20 bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 focus:ring-neutral/10 focus:border-neutral/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]" placeholder="+91-00000-00000" />
                </div>
                <div>
                  <label htmlFor="inquiryType" className="block text-[13px] font-medium mb-1">Inquiry type</label>
                  <select id="inquiryType" name="inquiryType" value={form.inquiryType} onChange={handleChange} className="w-full rounded-xl border border-neutral/20 bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-4 h-12 text-sm focus:outline-none focus:ring-4 focus:ring-neutral/10 focus:border-neutral/40">
                    <option>General</option>
                    <option>Rentals</option>
                    <option>Billing</option>
                    <option>Support</option>
                    <option>Partnerships</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-[13px] font-medium mb-1">Subject</label>
                <input id="subject" name="subject" value={form.subject} onChange={handleChange} required className="w-full rounded-xl border border-neutral/20 bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 focus:ring-neutral/10 focus:border-neutral/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]" placeholder="How can we help?" />
              </div>

              <div>
                <label htmlFor="message" className="block text-[13px] font-medium mb-1">Message</label>
                <textarea id="message" name="message" value={form.message} onChange={handleChange} required rows={6} className="w-full rounded-xl border border-neutral/20 bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-4 py-3 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 focus:ring-neutral/10 focus:border-neutral/40 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]" placeholder="Write your message..." />
              </div>

              <div className="flex items-center justify-between text-[13px]">
                <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" name="subscribe" checked={form.subscribe} onChange={handleChange} className="checkbox checkbox-sm rounded-[4px] [--chkbg:#111] [--chkfg:white]" />
                  <span className="text-neutral/80">Email me rental tips and updates</span>
                </label>
                <button className="px-4 h-11 rounded-xl text-sm font-medium tracking-wide bg-black text-white hover:bg-neutral-800 transition disabled:opacity-70 shadow-[0_1px_2px_rgba(0,0,0,0.25)]" disabled={loading}>{loading ? 'Sending…' : 'Send message'}</button>
              </div>
            </form>
          </div>
        </section>

        {/* Contact info aside */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-neutral/20 bg-white/95 p-6 shadow-sm">
            <h2 className="text-base font-semibold tracking-tight">Get in touch</h2>
            <p className="mt-1 text-sm text-neutral/70">Our team is available Mon–Sat, 9am–7pm IST.</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center gap-2"><EnvelopeIcon className="w-4" /> support@rentkar.com</div>
              <div className="flex items-center gap-2"><PhoneIcon className="w-4" /> +91 00000 00000</div>
              <div className="flex items-center gap-2"><MapPinIcon className="w-4" /> Pune, India</div>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral/20 bg-white/95 p-6 shadow-sm">
            <h3 className="text-sm font-semibold tracking-tight">Why choose us?</h3>
            <ul className="mt-2 space-y-2 text-sm text-neutral/80 list-disc list-inside">
              <li>Flexible hourly, daily, weekly pricing</li>
              <li>Verified quality gear</li>
              <li>Secure payments and deposits</li>
              <li>Fast pickup and return logistics</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Contact;


