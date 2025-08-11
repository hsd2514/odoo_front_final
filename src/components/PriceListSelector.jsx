// PriceListSelector.jsx - shared price list selector
import React from 'react';

export default function PriceListSelector({ value, onChange }) {
  return (
    <select
      className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    >
      <option value="standard">Standard</option>
      <option value="premium">Premium (+20%)</option>
      <option value="wholesale">Wholesale (-10%)</option>
    </select>
  );
}


