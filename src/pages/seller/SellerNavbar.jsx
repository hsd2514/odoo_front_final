// SellerNavbar.jsx - top tab navigation for Seller console
import React from 'react';

export default function SellerNavbar({ active, onChange }) {
  const tabs = ['dashboard', 'orders', 'products', 'inventory', 'reporting', 'settings'];
  return (
    <div className="sticky top-0 z-20 bg-[#F5F6FA]/95 backdrop-blur border-b">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-2 overflow-x-auto">
        {tabs.map((t) => {
          const isActive = active === t;
          return (
            <button
              key={t}
              className={`px-3 h-9 inline-flex items-center rounded-xl text-sm shadow-sm select-none cursor-pointer border transition-all duration-200 font-medium ${
                isActive
                  ? 'bg-[#F9DE66] text-black border-transparent shadow-md'
                  : 'bg-white hover:bg-neutral-50 text-neutral-900 border-neutral-300 hover:border-neutral-400'
              }`}
              onClick={() => onChange(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          );
        })}
        <div className="ml-auto hidden md:flex items-center gap-1 text-sm text-neutral-500">
          <span>Seller Console</span>
        </div>
      </div>
    </div>
  );
}


