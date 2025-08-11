// PriceUnitBadge.jsx
import React from 'react';

const PriceUnitBadge = ({ unit }) => {
  if (!unit) return null;
  return (
    <span className="px-2 py-0.5 rounded-md text-xs bg-[#e6f5ff] text-[#0a84ff]">/ {unit}</span>
  );
};

export default PriceUnitBadge;


