import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

/**
 * Slideshow
 * Lightweight, stylish carousel with autoplay, arrows, and dots. No external deps.
 */
const Slideshow = ({ images = [], intervalMs = 4000 }) => {
  const safeImages = useMemo(() => images.filter(Boolean), [images]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (safeImages.length <= 1) return undefined;
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % safeImages.length), intervalMs);
    return () => clearInterval(timerRef.current);
  }, [safeImages.length, intervalMs]);

  const go = (dir) => {
    setIndex((i) => {
      if (dir === 'prev') return (i - 1 + safeImages.length) % safeImages.length;
      return (i + 1) % safeImages.length;
    });
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = setInterval(() => setIndex((i) => (i + 1) % safeImages.length), intervalMs);
    }
  };

  if (safeImages.length === 0) return null;

  return (
    <div className="relative w-full rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-[0_4px_16px_-4px_rgba(0,0,0,0.06),0_2px_4px_-2px_rgba(0,0,0,0.05)]">
      <div className="relative bg-neutral-100" style={{ height: 'clamp(240px, 56vw, 520px)' }}>
        {safeImages.map((img, i) => (
          <img
            key={i}
            src={typeof img === 'string' ? img : img.src}
            alt={typeof img === 'string' ? `Slide ${i + 1}` : (img.alt || `Slide ${i + 1}`)}
            className={`absolute inset-0 w-full h-full object-contain p-2 transition-opacity duration-700 ${
              i === index ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />
        ))}
        {/* No overlay to avoid hiding image edges */}

        {/* Arrows */}
        {safeImages.length > 1 && (
          <>
            <button
              aria-label="Previous slide"
              onClick={() => go('prev')}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-full bg-white/80 hover:bg-white text-neutral-800 shadow"
            >
              <ChevronLeftIcon className="w-5" />
            </button>
            <button
              aria-label="Next slide"
              onClick={() => go('next')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 grid place-items-center rounded-full bg-white/80 hover:bg-white text-neutral-800 shadow"
            >
              <ChevronRightIcon className="w-5" />
            </button>
          </>
        )}

        {/* Dots */}
        {safeImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
            {safeImages.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition ${
                  i === index ? 'bg-white shadow ring-1 ring-black/10' : 'bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Slideshow;


