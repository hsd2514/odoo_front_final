// FormControls.jsx - shared form Field and Input components
import React from 'react';

export const Field = ({ label, children, error }) => (
  <label className="block text-sm mb-3">
    <span className="block mb-1 text-neutral-700">{label}</span>
    {children}
    {error && (
      <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
        {error}
      </div>
    )}
  </label>
);

export const Input = ({ error, className = '', ...props }) => (
  <input
    {...props}
    className={`w-full h-10 px-3 rounded-lg border bg-white shadow-sm transition-colors ${
      error
        ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
        : 'border-neutral/300 focus:border-neutral-400 focus:ring-neutral-100'
    } focus:outline-none focus:ring-2 ${className}`}
  />
);

export default { Field, Input };


