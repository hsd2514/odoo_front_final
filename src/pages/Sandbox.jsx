import React from 'react';
import RentalCard from '../components/RentalCard';
import Spline from '@splinetool/react-spline';

const Sandbox = () => {
  return (
    <div className="min-h-screen bg-[#f6f7f9] text-neutral">
      {/* Full-screen Spline hero */}
      <section className="relative h-screen w-full">
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/eMRb5nQ2pqJ9mMRN/scene.splinecode" />
        </div>
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-6 text-center">
          <h2 className="text-[2.4rem] md:text-[3rem] leading-tight font-serif font-semibold tracking-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">
            
          </h2>
        </div>
      </section>

      <section className="px-6 py-10">
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
      </section>
    </div>
  );
};

export default Sandbox;


