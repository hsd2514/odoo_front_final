// ReportingSection.jsx - detailed reporting with charts and insights
import React, { useEffect, useMemo, useState } from 'react';
import { getSummary } from '../../services/reporting';
import { listOrders } from '../../services/rentals';

function BarChart({ data = [], labelKey = 'label', valueKey = 'value', maxValue }) {
  const max = maxValue ?? Math.max(1, ...data.map((d) => Number(d[valueKey] || 0)));
  return (
    <div className="space-y-2">
      {data.map((d, idx) => {
        const val = Number(d[valueKey] || 0);
        const pct = Math.max(2, Math.round((val / max) * 100));
        return (
          <div key={idx} className="w-full">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="truncate mr-2 text-[#374151]">{d[labelKey]}</span>
              <span className="text-[#111827] font-medium">{val}</span>
            </div>
            <div className="h-2 w-full bg-[#EEF2F7] rounded">
              <div className="h-2 rounded bg-[#2563EB]" style={{ width: `${pct}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Card({ title, value, subtitle, tone = 'neutral' }) {
  const tones = {
    neutral: 'from-white to-[#F8FAFC] border',
    blue: 'from-white to-[#EFF6FF] border',
    green: 'from-white to-[#F0FDF4] border',
    amber: 'from-white to-[#FFFBEB] border',
  };
  return (
    <div className={`p-4 rounded bg-gradient-to-b ${tones[tone] || tones.neutral}`}>
      <div className="text-sm text-[#475569]">{title}</div>
      <div className="text-2xl font-semibold text-[#0F172A]">{value}</div>
      {subtitle && <div className="text-xs text-[#64748B] mt-1">{subtitle}</div>}
    </div>
  );
}

function DownloadButton({ filename = 'report.csv', rows = [], label = 'Export CSV' }) {
  function toCsv(data) {
    if (!Array.isArray(data) || data.length === 0) return '';
    const headers = Object.keys(data[0]);
    const escape = (v) => (`${v ?? ''}`).replace(/"/g, '""');
    const csv = [headers.join(',')]
      .concat(data.map((r) => headers.map((h) => `"${escape(r[h])}"`).join(',')))
      .join('\n');
    return csv;
  }
  const onDownload = () => {
    try {
      const csv = toCsv(rows);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
    } catch {}
  };
  return (
    <button
      className="px-4 h-10 inline-flex items-center rounded-xl text-sm font-medium text-[#0F172A] border border-neutral-400 bg-white hover:bg-[#2563EB] hover:text-white hover:border-[#2563EB] shadow-sm"
      onClick={onDownload}
    >
      {label}
    </button>
  );
}

export default function ReportingSection() {
  const [range, setRange] = useState({ from: '', to: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);
  const [statusCounts, setStatusCounts] = useState({});

  async function refreshSummary() {
    setLoading(true); setError('');
    try {
      const res = await getSummary({ from: range.from || undefined, to: range.to || undefined });
      setData(res);
    } catch (e) {
      setError('Failed to load summary');
    } finally {
      setLoading(false);
    }
  }

  async function refreshStatuses() {
    const statuses = ['quotation','reserved','active','returned','completed'];
    const results = {};
    await Promise.all(statuses.map(async (s) => {
      try { const resp = await listOrders({ status: s, page: 1, limit: 1 }); results[s] = Number(resp?.total || 0); }
      catch { results[s] = 0; }
    }));
    setStatusCounts(results);
  }

  useEffect(() => { refreshSummary(); refreshStatuses(); /* eslint-disable react-hooks/exhaustive-deps */ }, [range.from, range.to]);

  const kpi = data?.kpi || { rentals: 0, revenue: 0 };
  const topProducts = Array.isArray(data?.top_products) ? data.top_products.map((p) => ({ label: p.title, value: Number(p.ordered||0) })) : [];
  const topCategories = Array.isArray(data?.top_categories) ? data.top_categories.map((c) => ({ label: c.name, value: Number(c.ordered||0) })) : [];

  const statusList = useMemo(() => {
    return [
      { label: 'Quotation', key: 'quotation', color: '#CBD5E1' },
      { label: 'Reserved', key: 'reserved', color: '#F59E0B' },
      { label: 'Picked up', key: 'active', color: '#2563EB' },
      { label: 'Returned', key: 'returned', color: '#22C55E' },
      { label: 'Completed', key: 'completed', color: '#64748B' },
    ].map((s) => ({ ...s, value: Number(statusCounts[s.key] || 0) }));
  }, [statusCounts]);

  return (
    <div className="space-y-6">
      <div className="p-3 bg-white rounded border flex flex-wrap items-end gap-3 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
        <div className="text-sm font-semibold mr-2 text-[#0F172A]">Date range</div>
        <label className="text-xs text-[#0F172A]">
          <div className="mb-1">From</div>
          <input className="rounded-xl border bg-[#F1F5F9] px-3 h-10 text-[#111827] placeholder:text-[#6B7280]" type="datetime-local" value={range.from} onChange={e=>setRange({...range, from:e.target.value})} />
        </label>
        <label className="text-xs text-[#0F172A]">
          <div className="mb-1">To</div>
          <input className="rounded-xl border bg-[#F1F5F9] px-3 h-10 text-[#111827] placeholder:text-[#6B7280]" type="datetime-local" value={range.to} onChange={e=>setRange({...range, to:e.target.value})} />
        </label>
        <button className="px-4 h-10 inline-flex items-center rounded-xl text-sm font-medium bg-[#2563EB] text-white hover:opacity-95 shadow-sm" onClick={()=>{ refreshSummary(); refreshStatuses(); }}>Apply</button>
        <div className="ml-auto flex items-center gap-2">
          {(data?.top_products?.length > 0) && (
            <DownloadButton filename="top_products.csv" rows={data.top_products} label="Export Products CSV" />
          )}
          {(data?.top_categories?.length > 0) && (
            <DownloadButton filename="top_categories.csv" rows={data.top_categories} label="Export Categories CSV" />
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-[#1F2937]">Loading…</div>
      ) : error ? (
        <div className="text-[#B91C1C]">{error}</div>
      ) : (
        <>
          <div className="grid md:grid-cols-3 gap-4">
            <Card title="Total Rentals" value={kpi.rentals} tone="blue" />
            <Card title="Revenue" value={`₹${Number(kpi.revenue).toFixed(2)}`} tone="green" subtitle="Gross, for selected period" />
            <Card title="Avg. Order Value" value={`₹${(kpi.rentals ? (Number(kpi.revenue)/Number(kpi.rentals)) : 0).toFixed(2)}`} tone="amber" subtitle="Revenue / Rentals" />
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded-xl border shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
              <div className="mb-2 text-[#0F172A] font-semibold">Top Products</div>
              {topProducts.length === 0 ? <div className="text-sm text-[#64748B]">No data</div> : <BarChart data={topProducts} />}
            </div>
            <div className="p-4 bg-white rounded-xl border shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
              <div className="mb-2 text-[#0F172A] font-semibold">Top Categories</div>
              {topCategories.length === 0 ? <div className="text-sm text-[#64748B]">No data</div> : <BarChart data={topCategories} />}
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
            <div className="mb-3 text-[#0F172A] font-semibold">Orders by Status</div>
            <div className="space-y-2">
              {statusList.map((s) => {
                const total = statusList.reduce((sum, x) => sum + x.value, 0) || 1;
                const pct = Math.round((s.value / total) * 100);
                return (
                  <div key={s.key} className="w-full">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="truncate mr-2 text-[#374151]">{s.label}</span>
                      <span className="text-[#111827] font-medium">{s.value} ({pct}%)</span>
                    </div>
                    <div className="h-2 w-full bg-[#EEF2F7] rounded">
                      <div className="h-2 rounded" style={{ width: `${pct}%`, backgroundColor: s.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}


