import React from 'react';
import interiorImg from '../assets/Interior.png';
import RentalCard from '../components/RentalCard';
import {
  ClockIcon,
  ShieldCheckIcon,
  TruckIcon,
  CreditCardIcon,
  SparklesIcon,
  PhoneIcon,
} from '@heroicons/react/24/outline';

const Stat = ({ value, label }) => (
  <div className="text-center">
    <div className="text-3xl font-semibold tracking-tight">{value}</div>
    <div className="text-xs text-neutral/60 mt-1">{label}</div>
  </div>
);

const Feature = ({ icon: Icon, title, text }) => (
  <div className="rounded-2xl border border-neutral/20 bg-white/95 p-5 shadow-sm">
    <div className="w-11 h-11 rounded-xl bg-neutral-900 text-white grid place-items-center shadow">
      <Icon className="w-5 h-5" />
    </div>
    <h3 className="mt-3 text-base font-semibold tracking-tight">{title}</h3>
    <p className="mt-1 text-sm text-neutral/70 leading-relaxed">{text}</p>
  </div>
);

const Testimonial = ({ quote, author }) => (
  <div className="rounded-2xl border border-neutral/20 bg-white/95 p-5 shadow-sm">
    <p className="text-sm leading-relaxed">“{quote}”</p>
    <div className="mt-3 text-xs text-neutral/60">— {author}</div>
  </div>
);

const Sandbox = () => {
  return (
    <div className="min-h-screen bg-[#f6f7f9] text-neutral">
      {/* Hero */}
      <section className="px-6 pt-12 pb-10">
        <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-[1.2fr_1fr] items-center">
          <div>
            <h1 className="text-[2.4rem] leading-tight font-serif font-semibold tracking-tight" style={{ color: '#00AFB9' }}>
              Rent smart. Create more. Move faster.
            </h1>
            <p className="mt-3 text-neutral/70 max-w-xl">
              Premium rental service for creators and businesses. Flexible durations, transparent
              pricing, and seamless pickup/return logistics.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a href="./sandbox" className="px-4 h-11 inline-flex items-center rounded-xl text-sm bg-black text-white hover:bg-neutral-800 transition shadow">
                Explore catalog
              </a>
              <a href="./contact" className="px-4 h-11 inline-flex items-center rounded-xl text-sm border border-neutral/30 bg-white hover:bg-neutral-50 transition shadow-sm">
                Contact
              </a>
            </div>
          </div>
          <div className="rounded-2xl border border-neutral/20 overflow-hidden bg-neutral-100">
              <img src={interiorImg} alt="Our rental studio" className="w-full h-full object-cover" />
            </div>
        </div>
        <div className="mx-auto max-w-6xl mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6">
          <Stat value="2k+" label="Active products" />
          <Stat value="98%" label="On-time returns" />
          <Stat value="25+" label="Cities served" />
          <Stat value="4.9/5" label="Customer rating" />
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="px-6 py-10">
        <div className="mx-auto max-w-6xl grid gap-10 md:grid-cols-[1.1fr_1fr] items-start">
          <div>
            <div className="text-xs font-medium tracking-wider text-neutral/60">ABOUT US</div>
            <h2 className="mt-2 text-[1.8rem] leading-tight font-serif font-semibold tracking-tight" style={{ color: '#00AFB9' }}>
              We make renting effortless
            </h2>
            <p className="mt-2 text-neutral/70 max-w-prose">
              From cameras to lighting and event gear, our platform helps you rent what you need,
              exactly when you need it. We handle availability, payment, pickup and returns—so you
              can focus on your work.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Feature icon={ClockIcon} title="Flexible durations" text="Rent by the hour, day, or week—pay only for what you use." />
              <Feature icon={CreditCardIcon} title="Transparent pricing" text="Clear rates and deposits, no hidden fees." />
              <Feature icon={TruckIcon} title="Hassle‑free logistics" text="Fast pickups and guided returns that fit your schedule." />
              <Feature icon={ShieldCheckIcon} title="Trusted & secure" text="Safe payments and vetted partners for peace of mind." />
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-neutral/20 bg-white/95 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 grid place-items-center rounded-xl bg-neutral-900 text-white"><SparklesIcon className="w-5" /></div>
                <div className="text-sm font-semibold">Testimonials</div>
              </div>
              <p className="mt-2 text-sm text-neutral/70 leading-relaxed">
                Premium gear, great service, and reliability—every time. If something isn’t right,
                our support team will make it right.
              </p>
              <a href="./contact" className="mt-3 inline-flex items-center gap-2 text-sm text-neutral-800 hover:text-black">
                <PhoneIcon className="w-4" /> Talk to us
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Testimonial quote="Booking and pickup were smooth. The equipment felt brand new!" author="Aarav, Filmmaker" />
              <Testimonial quote="Clear pricing and quick support. Will rent again." author="Meera, Event Lead" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sandbox;


