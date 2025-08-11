import React from 'react';
import Spline from '@splinetool/react-spline';
import Slideshow from '../components/Slideshow';
import imgFurniture from '../assets/furniture.png';
import imgMaybach from '../assets/maybach.png';
import imgOnly from '../assets/Only.png';
import imgShoe from '../assets/shoe.png';

const Sandbox = () => {
  return (
    <div className="min-h-screen bg-[#f6f7f9] text-neutral">
      {/* Full-screen Spline hero */}
      <section className="relative h-screen w-full">
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/eMRb5nQ2pqJ9mMRN/scene.splinecode" />
        </div>
        {/* Overlay actions at ~25% from left edge */}
        <div className="absolute top-[80%] left-[11%] z-10 flex items-center gap-3 -translate-y-1/2">
          <a href="/home" className="px-4 h-11 inline-flex items-center rounded-xl text-sm bg-black text-white hover:bg-neutral-800 transition shadow">
            Sign in
          </a>
          <a href="/about" className="px-4 h-11 inline-flex items-center rounded-xl text-sm border border-white/70 bg-white/90 hover:bg-white text-neutral-900 transition shadow">
            Sign up
          </a>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-2xl font-semibold tracking-tight"></h1>
          <p className="mt-1 text-neutral/70"></p>
          {/* Slideshow below Spline */}
          <div className="mt-6">
            <Slideshow
              images={[imgFurniture, imgMaybach, imgOnly, imgShoe]}
              intervalMs={4000}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sandbox;


