// Navbar.jsx
// Simple navigation bar component

import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="navbar">
    <Link to="/">Home</Link>
    <Link to="/login">Login</Link>
    <Link to="/about">About</Link>
  </nav>
);

export default Navbar;
