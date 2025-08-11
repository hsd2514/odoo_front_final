// QuantityStepper.jsx
import React from 'react';

const QuantityStepper = ({ value, onChange, min = 1, max = 999 }) => {
  const dec = () => onChange(Math.max(min, (value || 1) - 1));
  const inc = () => onChange(Math.min(max, (value || 1) + 1));
  return (
    <div className="inline-flex items-center">
      <button className="w-10 h-10 rounded-l-lg border border-neutral/300 bg-white" onClick={dec}>-</button>
      <div className="w-12 h-10 grid place-items-center border-t border-b border-neutral/300">{value}</div>
      <button className="w-10 h-10 rounded-r-lg border border-neutral/300 bg-white" onClick={inc}>+</button>
    </div>
  );
};

export default QuantityStepper;


