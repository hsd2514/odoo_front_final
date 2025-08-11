import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

/**
 * Reusable password field with show/hide toggle
 * Props: name, label, value, onChange, placeholder, required, error, onBlur
 */
const PasswordField = ({ 
  name = 'password', 
  label = 'Password', 
  value, 
  onChange, 
  placeholder = 'Password', 
  required,
  error,
  onBlur
}) => {
  const [show, setShow] = useState(false);
  
  const getInputClassName = () => {
    const baseClasses = "w-full rounded-xl border bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-4 h-12 pr-14 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)]";
    const errorClasses = error ? "border-red-300 focus:ring-red-100 focus:border-red-400" : "border-neutral/20 focus:ring-neutral/10 focus:border-neutral/40";
    return `${baseClasses} ${errorClasses}`;
  };

  return (
    <div className="form-control">
      {label && <label className="label font-medium text-[13px]" htmlFor={name}>{label}</label>}
      <div className="relative group">
        <input
          id={name}
          name={name}
          type={show ? 'text' : 'password'}
          className={getInputClassName()}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          autoComplete="current-password"
        />
        <button
          type="button"
            aria-label={show ? 'Hide password' : 'Show password'}
            aria-pressed={show}
            onMouseDown={(e)=> e.preventDefault()}
            onClick={() => setShow(prev => !prev)}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center rounded-lg border border-neutral/200 bg-white/80 backdrop-blur hover:bg-white text-neutral-600 hover:text-neutral-800 transition shadow-sm"
        >
          {show ? <EyeSlashIcon className="w-4" /> : <EyeIcon className="w-4" />}
        </button>
      </div>
      {error && (
        <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </div>
      )}
    </div>
  );
};

export default PasswordField;
