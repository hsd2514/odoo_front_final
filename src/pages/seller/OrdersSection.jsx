// OrdersSection.jsx - list and create rental orders
import React, { useState } from 'react';
import { createHandoverQR, verifyHandoverQR } from '../../services/admin';

export default function OrdersSection({ loading, error, orders, onFilter, onPatch, onCreate }) {
  const filters = [
    { label: 'All', value: '' },
    { label: 'Quotation', value: 'quotation' },
    { label: 'Reserved', value: 'reserved' },
    { label: 'Pickedup', value: 'active' },
    { label: 'Returned', value: 'returned' },
    { label: 'Completed', value: 'completed' }
  ];
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ customer_id: '', seller_id: '', start_ts: '', end_ts: '' });
  const [selStatus, setSelStatus] = useState('');
  const [selInvoice, setSelInvoice] = useState('');
  const [query, setQuery] = useState('');
  const [qr, setQr] = useState({ visible: false, rentalId: null, token: '' });
  const [verifying, setVerifying] = useState(false);
  const fmtDate = (v) => { try { return new Date(v).toLocaleDateString(); } catch { return ''; } };
  const spanLabel = (start, end) => {
    try {
      const ms = (new Date(end) - new Date(start));
      if (!isFinite(ms) || ms <= 0) return '';
      const hours = Math.ceil(ms / 36e5);
      return hours < 24 ? `${hours}h` : `${Math.ceil(hours/24)}d`;
    } catch { return ''; }
  };

  return (
    <div className="bg-white rounded-xl border shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
      <div className="flex items-center gap-2 p-3 border-b sticky top-14 bg-white/90 backdrop-blur rounded-t-xl">
        <button className="px-3 h-9 inline-flex items-center rounded-xl text-sm bg-[#00AFB9] text-white hover:opacity-90 shadow-sm" onClick={() => setShowCreate(true)}>Create</button>
        <div className="ml-2 flex items-center gap-2 text-sm font-medium flex-wrap">
          <span className="text-[#374151]">RENTAL STATUS</span>
          {filters.map((f) => {
            const active = selStatus === f.value;
            return (
              <button
                key={f.label}
                className={`px-3 h-8 inline-flex items-center rounded-xl shadow-sm border transition-colors ${
                  active
                    ? 'bg-[#F9DE66] text-black border-transparent'
                    : 'bg-white text-[#111827] border-neutral-300 hover:bg-neutral-50'
                }`}
                onClick={() => { setSelStatus(f.value); onFilter({ status: f.value, invoice_status: selInvoice || undefined, q: query || undefined }); }}
              >
                {f.label}
              </button>
            );
          })}
          <span className="ml-4 text-[#374151]">INVOICE STATUS</span>
          {['', 'unpaid', 'paid', 'overdue'].map((iv) => {
            const active = selInvoice === iv;
            return (
              <button
                key={iv || 'all'}
                className={`px-3 h-8 inline-flex items-center rounded-xl shadow-sm border transition-colors ${
                  active
                    ? 'bg-[#F9DE66] text-black border-transparent'
                    : 'bg-white text-[#111827] border-neutral-300 hover:bg-neutral-50'
                }`}
                onClick={() => { setSelInvoice(iv); onFilter({ status: selStatus || undefined, invoice_status: iv || undefined, q: query || undefined }); }}
              >
                {iv || 'All'}
              </button>
            );
          })}
          <input
            className="ml-4 rounded-xl border bg-white px-3 h-9 text-sm text-[#111827]"
            placeholder="Search Order ID"
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            onKeyDown={(e)=>{ if (e.key==='Enter') onFilter({ status: selStatus||undefined, invoice_status: selInvoice||undefined, q: query||undefined }); }}
          />
          <button className="px-3 h-9 inline-flex items-center rounded-xl text-sm border border-neutral-300 bg-white hover:bg-neutral-50" onClick={()=> onFilter({ status: selStatus||undefined, invoice_status: selInvoice||undefined, q: query||undefined })}>Refresh</button>
          <button className="px-3 h-9 inline-flex items-center rounded-xl text-sm bg-[#2563EB] text-white hover:opacity-95" onClick={()=>{ setSelStatus(''); setSelInvoice(''); setQuery(''); onFilter({}); }}>Clear</button>
        </div>
        <div className="ml-auto hidden md:flex items-center gap-1 text-sm text-neutral-500">
          <button className="px-2 h-8 inline-flex items-center rounded-xl border border-neutral/200 bg-white hover:bg-neutral-50">Cart</button>
          <button className="px-2 h-8 inline-flex items-center rounded-xl border border-neutral/200 bg-white hover:bg-neutral-50">List</button>
        </div>
      </div>
      <div className="p-4 bg-gradient-to-b from-white to-[#FAFBFC]">
        {loading ? (
          <div className="text-sm text-[#1F2937]">Loading…</div>
        ) : error ? <div className="text-red-600">{error}</div> : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {orders.items.map((o) => (
              <div key={o.rental_id} className="rounded-2xl border border-neutral/200 p-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)] bg-white hover:shadow-md transition">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-semibold text-[#0F172A] truncate" title={`Customer #${String(o.customer_id)}`}>Customer #{String(o.customer_id)}</div>
                  <span className={`px-2.5 h-6 inline-flex items-center rounded-full text-[11px] border ${o.status==='reserved'?'bg-[#E7F6EE] text-[#0F5132] border-[#CBECD9]': o.status==='completed' ? 'bg-[#EEF2F7] text-[#334155] border-[#E2E8F0]' : 'bg-[#FFF2CC] text-[#78350F] border-[#FFE699]'}`}>{o.status}</span>
                </div>
                <div className="text-2xl font-semibold mt-2 text-[#1F2937]">₹ {Number(o.total_amount||0).toFixed(0)}</div>
                <div className="text-xs text-[#475569] mt-1 flex flex-wrap gap-x-2 gap-y-1">
                  <button
                    className="underline text-[#0F172A]"
                    title="Click to issue pickup QR"
                    onClick={async ()=>{
                      try {
                        const res = await createHandoverQR({ rental_id: o.rental_id, type: 'pickup' });
                        setQr({ visible: true, rentalId: o.rental_id, token: res?.qr_token || res?.token || '' });
                        window.dispatchEvent(new CustomEvent('toast',{detail:{type:'info',message:'Pickup QR issued'}}));
                      } catch {
                        window.dispatchEvent(new CustomEvent('toast',{detail:{type:'error',message:'Failed to issue QR'}}));
                      }
                    }}
                  >Order: R{String(o.rental_id).padStart(4,'0')}</button>
                  <span className="opacity-60">•</span>
                  <span>Seller #{String(o.seller_id ?? '—')}</span>
                  <span className="opacity-60">•</span>
                  <span>{fmtDate(o.start_ts)} → {fmtDate(o.end_ts)} ({spanLabel(o.start_ts, o.end_ts)})</span>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="px-3 h-9 inline-flex items-center rounded-xl text-sm border border-neutral/300 bg-white hover:bg-neutral-50 text-[#111827]" onClick={()=>onPatch(o.rental_id,'active')}>Mark Ready</button>
                  <button className="px-3 h-9 inline-flex items-center rounded-xl text-sm bg-[#2563EB] text-white hover:opacity-95 shadow-sm" onClick={()=>onPatch(o.rental_id,'completed')}>Mark Done</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {qr.visible && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4" onClick={()=>setQr({ visible:false, rentalId:null, token:'' })}>
          <div className="bg-white rounded-xl border shadow-lg w-full max-w-sm p-4" onClick={(e)=>e.stopPropagation()}>
            <div className="text-lg font-semibold mb-2">Pickup QR for R{String(qr.rentalId).padStart(4,'0')}</div>
            <div className="text-xs text-[#475569] break-all mb-2">{qr.token || '—'}</div>
            {(qr.token) && (
              <img
                alt="QR"
                className="w-40 h-40 border rounded mx-auto"
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qr.token)}`}
                onError={(e)=>{ e.currentTarget.style.display='none'; }}
              />
            )}
            <div className="mt-3 flex items-center gap-2 justify-end">
              <button className="px-3 h-9 inline-flex items-center rounded-xl text-sm border border-neutral-200 bg-white hover:bg-neutral-50" onClick={()=>{ navigator.clipboard?.writeText(String(qr.token)); window.dispatchEvent(new CustomEvent('toast',{detail:{type:'info',message:'Token copied'}})); }}>Copy</button>
              <button className="px-3 h-9 inline-flex items-center rounded-xl text-sm bg-[#2563EB] text-white hover:opacity-95" disabled={!qr.token || verifying} onClick={async ()=>{
                try { setVerifying(true); await verifyHandoverQR({ qr_token: qr.token }); window.dispatchEvent(new CustomEvent('toast',{detail:{type:'info',message:'QR verified, order marked active'}})); setQr({ visible:false, rentalId:null, token:'' }); }
                catch { window.dispatchEvent(new CustomEvent('toast',{detail:{type:'error',message:'Verify failed'}})); }
                finally { setVerifying(false); }
              }}>{verifying?'Verifying…':'Verify'}</button>
            </div>
          </div>
        </div>
      )}
      {showCreate && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4" onClick={()=>setShowCreate(false)}>
          <div className="bg-white rounded-xl border shadow-lg w-full max-w-md p-4" onClick={e=>e.stopPropagation()}>
            <div className="text-lg font-semibold mb-2">Create Rental Order</div>
            <div className="space-y-2">
              <input className="w-full rounded-xl border bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 border-neutral/20 focus:ring-neutral/10 focus:border-neutral/40" placeholder="Customer ID" value={form.customer_id} onChange={e=>setForm({...form,customer_id:e.target.value})} />
              <input className="w-full rounded-xl border bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 border-neutral/20 focus:ring-neutral/10 focus:border-neutral/40" placeholder="Seller ID" value={form.seller_id} onChange={e=>setForm({...form,seller_id:e.target.value})} />
              <input className="w-full rounded-xl border bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 border-neutral/20 focus:ring-neutral/10 focus:border-neutral/40" type="datetime-local" value={form.start_ts} onChange={e=>setForm({...form,start_ts:e.target.value})} />
              <input className="w-full rounded-xl border bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 border-neutral/20 focus:ring-neutral/10 focus:border-neutral/40" type="datetime-local" value={form.end_ts} onChange={e=>setForm({...form,end_ts:e.target.value})} />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 h-9 inline-flex items-center rounded-xl text-sm border border-neutral/200 bg-white hover:bg-neutral-50" onClick={()=>setShowCreate(false)}>Cancel</button>
              <button className="px-3 h-9 inline-flex items-center rounded-xl text-sm bg-[#00AFB9] text-white hover:opacity-90 shadow-sm" onClick={async()=>{
                try { await onCreate({ customer_id:Number(form.customer_id), seller_id:Number(form.seller_id), start_ts:form.start_ts, end_ts:form.end_ts }); setShowCreate(false); window.dispatchEvent(new CustomEvent('toast',{detail:{type:'info',message:'Order created'}})); } catch { window.dispatchEvent(new CustomEvent('toast',{detail:{type:'error',message:'Failed to create'}})); }
              }}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


