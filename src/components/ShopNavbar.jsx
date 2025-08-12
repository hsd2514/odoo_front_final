// ShopNavbar.jsx
// Top navigation for the shop (post-login)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { clearAuthToken } from '../services/api';

const Pill = ({ children }) => (
  <span className="px-4 h-9 inline-flex items-center rounded-full border border-neutral/30 bg-white/90 hover:bg-white text-sm shadow-sm select-none cursor-pointer">
    {children}
  </span>
);

const ShopNavbar = () => {
  const { cartCount, categories, selectedCategory, setSelectedCategory } = useShop();
  const navigate = useNavigate();
  return (
    <header className="w-full bg-[#FAFBFC] backdrop-blur supports-[backdrop-filter]:bg-[#FAFBFC]/95 border-b border-neutral/100 text-neutral-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between py-3 gap-3">
          <div className="flex items-center gap-2">
            <Link to="/home" className="px-4 h-9 inline-flex items-center rounded-xl bg-[#00AFB9] text-white hover:opacity-90 text-sm shadow-sm transition-all duration-200">Home</Link>
            <Link to="/home" className="px-4 h-9 inline-flex items-center rounded-xl bg-[#00AFB9] text-white hover:opacity-90 text-sm shadow-sm transition-all duration-200">Rental Shop</Link>
            <Link to="/wishlist" className="px-4 h-9 inline-flex items-center rounded-xl bg-[#00AFB9] text-white hover:opacity-90 text-sm shadow-sm transition-all duration-200">Wishlist</Link>
            <Link to="/cart" className="px-4 h-9 inline-flex items-center rounded-xl bg-[#00AFB9] text-white hover:opacity-90 text-sm shadow-sm transition-all duration-200 relative">
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-[#F9DE66] text-black text-[10px] inline-flex items-center justify-center font-medium">{cartCount}</span>
              )}
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/profile" className="h-9 px-3 inline-flex items-center gap-2 rounded-xl border border-neutral/200 bg-white shadow-sm text-sm">
              <span className="w-6 h-6 inline-flex items-center justify-center rounded-full bg-[#00AFB9] text-white text-xs font-medium">A</span>
              <span>Profile</span>
            </Link>
            <button onClick={() => { clearAuthToken(); navigate('/auth/login'); }} className="px-3 h-9 inline-flex items-center rounded-xl text-sm bg-[#00AFB9] text-white hover:opacity-90 shadow-sm transition-all duration-200">Logout</button>
          </div>
        </div>

        {/* Category pills row */}
        <div className="flex items-center gap-2 pb-3 overflow-x-auto">
          {(categories || []).filter(Boolean).map((cat, idx) => {
            const isObj = typeof cat === 'object' && cat !== null;
            const id = isObj ? (cat.id ?? cat.value ?? cat.slug ?? String(idx)) : String(cat);
            const name = isObj ? (cat.name ?? cat.label ?? cat.title ?? String(id)) : String(cat);
            return (
              <button
                key={id}
                className={`px-3 h-9 inline-flex items-center rounded-xl text-sm shadow-sm select-none cursor-pointer border transition-all duration-200 ${
                  selectedCategory === id 
                    ? 'bg-[#F9DE66] text-black border-transparent shadow-md' 
                    : 'bg-white hover:bg-neutral-50 border-neutral/200 hover:border-neutral/300'
                }`}
                onClick={() => setSelectedCategory(selectedCategory === id ? '' : id)}
              >
                {name}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default ShopNavbar;


