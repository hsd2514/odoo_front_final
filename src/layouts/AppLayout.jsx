// AppLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import ShopNavbar from '../components/ShopNavbar';

const Footer = () => (
  <footer className="mt-8 py-8 text-center text-xs text-neutral-500">© {new Date().getFullYear()} Odoo Rental. All rights reserved.</footer>
);

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <ShopNavbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;


