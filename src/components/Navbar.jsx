// Navbar.jsx
// Minimal top-left auth nav with Login and Sign Up buttons

import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cardColors, borderColors, textColors } from '../utils/colors';

const Navbar = () => {
  const location = useLocation();
  const onLogin = location.pathname !== '/login';
  const onRegister = location.pathname !== '/register';
  const [userRole, setUserRole] = useState('user'); // This should come from auth context

  // Mock admin role for demo - replace with actual auth context
  useEffect(() => {
    // For demo purposes, set admin role
    // In production, this should come from your authentication context
    setUserRole('admin');
  }, []);

  return (
    <div className="flex items-center gap-2">
      {onLogin && (
        <Link
          to="/login"
          className="px-3 h-9 inline-flex items-center rounded-lg text-sm border transition-all duration-200 shadow-sm"
          style={{
            borderColor: borderColors.primary,
            backgroundColor: cardColors.secondary,
            color: textColors.secondary
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = cardColors.tertiary;
            e.target.style.color = textColors.primary;
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = cardColors.secondary;
            e.target.style.color = textColors.secondary;
          }}
        >
          Login
        </Link>
      )}
      {onRegister && (
        <Link
          to="/register"
          className="px-3 h-9 inline-flex items-center rounded-lg text-sm transition-all duration-200 shadow-sm"
          style={{
            backgroundColor: textColors.primary,
            color: textColors.white
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#424242';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = textColors.primary;
          }}
        >
          Sign Up
        </Link>
      )}
      
      {/* Admin Console Link */}
      {userRole === 'admin' && (
        <Link
          to="/admin"
          className="px-3 h-9 inline-flex items-center rounded-lg text-sm border transition-all duration-200 shadow-sm"
          style={{
            borderColor: borderColors.primary,
            backgroundColor: '#6366f1',
            color: 'white'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#4f46e5';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#6366f1';
          }}
        >
          Admin
        </Link>
      )}
      
      {/* Logout Button */}
      <button
        onClick={() => {
          // Add logout logic here
          console.log('Logout clicked');
        }}
        className="px-3 h-9 inline-flex items-center rounded-lg text-sm transition-all duration-200 shadow-sm bg-red-600 text-white hover:bg-red-700 border-2 border-red-500 font-semibold"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
