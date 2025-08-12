// DashboardSection.jsx - KPIs and top lists
import React, { useEffect, useState } from 'react';
import { getSummary } from '../../services/reporting';

export default function DashboardSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [range, setRange] = useState({ from: '', to: '' });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true); setError('');
        const res = await getSummary({ from: range.from || undefined, to: range.to || undefined });
        if (mounted) setData(res);
      } catch (e) {
        if (mounted) setError('Failed to load summary');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [range.from, range.to]);

  if (loading) return <div className="p-4 text-[#1F2937]">Loading…</div>;
  if (error) return <div className="p-4 text-[#B91C1C]">{error}</div>;
  const kpi = data?.kpi || { rentals: 0, revenue: 0 };
  const topProducts = data?.top_products || [];

  return (
    <div className="space-y-4">
      <div className="p-3 bg-white rounded border flex flex-wrap items-end gap-2 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
        <div className="text-sm font-medium mr-2">Date range</div>
        <input className="rounded-xl border bg-[#F1F5F9] px-3 h-10" type="datetime-local" value={range.from} onChange={e=>setRange({...range, from:e.target.value})} />
        <input className="rounded-xl border bg-[#F1F5F9] px-3 h-10" type="datetime-local" value={range.to} onChange={e=>setRange({...range, to:e.target.value})} />
        <button className="px-3 h-9 inline-flex items-center rounded-xl text-sm bg-[#111827] text-white hover:opacity-90">Apply</button>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-b from-white to-[#F8FAFC] rounded border">
          <div className="text-sm text-[#475569]">Total Rentals</div>
          <div className="text-2xl font-semibold text-[#0F172A]">{kpi.rentals}</div>
        </div>
        <div className="p-4 bg-gradient-to-b from-white to-[#F8FAFC] rounded border">
          <div className="text-sm text-[#475569]">Revenue</div>
          <div className="text-2xl font-semibold text-[#0F172A]">₹{Number(kpi.revenue).toFixed(2)}</div>
        </div>
        <div className="p-4 bg-gradient-to-b from-white to-[#F8FAFC] rounded border">
          <div className="text-sm font-medium mb-2 text-[#0F172A]">Top Products</div>
          <ul className="text-sm text-[#1F2937] space-y-1">
            {topProducts.slice(0,5).map((p, i) => (
              <li key={i} className="flex justify-between"><span>{p.title}</span><span>{p.ordered}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}


