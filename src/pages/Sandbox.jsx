import React from 'react';
import RentalCard from '../components/RentalCard';

const Sandbox = () => {
  return (
    <div className="min-h-screen bg-[#f6f7f9] text-neutral px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-2xl font-semibold tracking-tight">Sandbox</h1>
        <p className="mt-1 text-neutral/70">Preview of RentalCard grid items.</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <RentalCard
              key={i}
              name={`Product ${i + 1}`}
              priceText={`₹${(i + 1) * 10}.00/day`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sandbox;


