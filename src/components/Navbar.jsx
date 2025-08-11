// Navbar.jsx
// Minimal top-left auth nav with Login and Sign Up buttons

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const onLogin = location.pathname !== '/login';
  const onRegister = location.pathname !== '/register';

  return (
    <div className="flex items-center gap-2">
      {onLogin && (
        <Link
          to="/login"
          className="px-3 h-9 inline-flex items-center rounded-lg text-sm border border-neutral/30 bg-white/90 hover:bg-white transition shadow-sm"
        >
          Login
        </Link>
      )}
      {onRegister && (
        <Link
          to="/register"
          className="px-3 h-9 inline-flex items-center rounded-lg text-sm bg-black text-white hover:bg-neutral-800 transition shadow"
        >
          Sign Up
        </Link>
      )}
    </div>
  );
};

export default Navbar;
