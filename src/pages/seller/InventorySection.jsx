// InventorySection.jsx - list and update inventory items
import React, { useEffect, useMemo, useState } from 'react';
import { getProduct } from '../../services/catalog';
import { listInventoryItems, updateInventoryStatus } from '../../services/admin';

export default function InventorySection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filteredItems = useMemo(() => items, [items]);
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page]);

  const [productTitleById, setProductTitleById] = useState({});
  useEffect(() => {
    // Fetch product titles for visible rows
    (async () => {
      const uniqueIds = Array.from(new Set((pagedItems || []).map((it) => it.product_id).filter(Boolean)));
      const missing = uniqueIds.filter((id) => !(id in productTitleById));
      if (missing.length === 0) return;
      const updates = {};
      for (const id of missing) {
        try { const p = await getProduct(id); updates[id] = p?.title || `Product #${id}`; } catch { updates[id] = `Product #${id}`; }
      }
      setProductTitleById((prev) => ({ ...prev, ...updates }));
    })();
  }, [pagedItems, productTitleById]);

  async function load() {
    try { setLoading(true); setError('');
      const res = await listInventoryItems({ status: filter || undefined });
      setItems(res);
    } catch { setError('Failed to load inventory'); } finally { setLoading(false); }
  }

  useEffect(() => { load(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const chips = [
    { label: 'All', value: '' },
    { label: 'Available', value: 'available' },
    { label: 'Reserved', value: 'reserved' },
    { label: 'Rented', value: 'rented' },
  ];

  return (
    <div className="p-4 bg-white rounded-xl border shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          {chips.map((c) => {
            const active = filter === c.value;
            return (
              <button
                key={c.label}
                className={`px-3 h-9 inline-flex items-center rounded-xl shadow-sm border transition-colors ${
                  active ? 'bg-[#F9DE66] text-black border-transparent' : 'bg-white text-[#111827] border-neutral-300 hover:bg-neutral-50'
                }`}
                onClick={() => setFilter(c.value)}
              >
                {c.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-sm text-[#374151]">
          <span>{filteredItems.length} items</span>
          <span className="mx-1">•</span>
          <span>Page {page} of {totalPages}</span>
          <button className="ml-2 px-2 h-8 inline-flex items-center rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-50" onClick={()=>setPage((p)=>Math.max(1,p-1))} disabled={page<=1}>{`<`}</button>
          <button className="px-2 h-8 inline-flex items-center rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-50" onClick={()=>setPage((p)=>Math.min(totalPages,p+1))} disabled={page>=totalPages}>{`>`}</button>
          <button className="px-3 h-9 inline-flex items-center rounded-xl text-sm border border-neutral-300 bg-white hover:bg-neutral-50" onClick={load}>Refresh</button>
        </div>
      </div>

      {loading ? <div className="text-[#1F2937]">Loading…</div> : error ? <div className="text-[#B91C1C]">{error}</div> : (
        <div className="overflow-auto border rounded">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] sticky top-0 z-10 text-[#475569]">
              <tr>
                <th className="text-left p-2 font-medium min-w-[100px]">Item</th>
                <th className="text-left p-2 font-medium min-w-[200px]">Product</th>
                <th className="p-2 font-medium min-w-[160px]">SKU</th>
                <th className="p-2 font-medium min-w-[120px]">Status</th>
                <th className="p-2 font-medium min-w-[220px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pagedItems.map((it, idx)=> {
                const allowed = {
                  available: ['reserved'],
                  reserved: ['rented','available'],
                  rented: ['available'],
                };
                const canAvail = allowed[it.status]?.includes('available');
                const canReserve = allowed[it.status]?.includes('reserved');
                const canRent = allowed[it.status]?.includes('rented');
                const onUpdate = async (target) => {
                  try { await updateInventoryStatus(it.item_id, target); setPage(1); load(); }
                  catch (e) {
                    const msg = e?.response?.data?.detail || 'Transition not allowed';
                    window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message: msg } }));
                  }
                };
                return (
                  <tr key={it.item_id} className={`border-t ${idx % 2 === 1 ? 'bg-[#FAFBFC]' : 'bg-white'}`}>
                    <td className="p-2 text-[#111827] font-medium">#{it.item_id}</td>
                    <td className="p-2 text-[#111827]">{productTitleById[it.product_id] || `Product #${it.product_id || '—'}`}</td>
                    <td className="p-2 text-[#111827]">{it.sku}</td>
                    <td className="p-2">
                      <span className={`px-2.5 h-6 inline-flex items-center rounded-full text-[11px] border ${it.status==='available' ? 'bg-[#E7F6EE] text-[#0F5132] border-[#CBECD9]' : it.status==='reserved' ? 'bg-[#FFF2CC] text-[#78350F] border-[#FFE699]' : 'bg-[#DBEAFE] text-[#1E3A8A] border-[#BFDBFE]'}`}>{it.status}</span>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        <button disabled={!canAvail} className={`px-3 h-8 inline-flex items-center rounded-xl text-xs border ${canAvail ? 'border-neutral-300 bg-white hover:bg-neutral-50' : 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed'}`} onClick={()=>onUpdate('available')}>Avail</button>
                        <button disabled={!canReserve} className={`px-3 h-8 inline-flex items-center rounded-xl text-xs ${canReserve ? 'bg-[#F59E0B] text-white hover:opacity-95' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`} onClick={()=>onUpdate('reserved')}>Reserve</button>
                        <button disabled={!canRent} className={`px-3 h-8 inline-flex items-center rounded-xl text-xs ${canRent ? 'bg-[#2563EB] text-white hover:opacity-95 shadow-sm' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`} onClick={()=>onUpdate('rented')}>Rent</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}


