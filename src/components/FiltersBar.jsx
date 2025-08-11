// FiltersBar.jsx
import React from 'react';

const FiltersBar = ({ categories = [], value, onChange, onSearch }) => {
  const { categoryId, q, priceList } = value;
  return (
    <div className="flex items-center gap-3 pt-4">
      <div className="w-48">
        <select
          className="w-full h-10 px-3 rounded-lg border border-neutral/30 bg-white shadow-sm text-sm text-[#4B2E83]"
          value={categoryId}
          onChange={(e) => onChange({ ...value, categoryId: e.target.value })}
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id || c.value} value={c.id || c.value}>{c.name || c.label}</option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <input
          className="w-full h-10 rounded-lg bg-white border border-neutral/30 px-3 text-neutral-700 shadow-sm focus:border-[#3C3DBB] focus:ring-2 focus:ring-[#B2E6E4]"
          placeholder="Search…"
          value={q}
          onChange={(e) => onChange({ ...value, q: e.target.value })}
          onKeyDown={(e) => { if (e.key === 'Enter') onSearch?.(); }}
        />
      </div>

      <div className="w-48 ml-auto">
        <select
          className="w-full h-10 px-3 rounded-lg border border-neutral/30 bg-white shadow-sm text-sm text-[#4B2E83]"
          value={priceList}
          onChange={(e) => onChange({ ...value, priceList: e.target.value })}
        >
          <option value="standard">Price List</option>
          <option value="premium">Premium (+20%)</option>
          <option value="wholesale">Wholesale (-10%)</option>
        </select>
      </div>
    </div>
  );
};

export default FiltersBar;


