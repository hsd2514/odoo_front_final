// TransfersSection.jsx - schedules and handover QR
import React, { useState } from 'react';
import { createSchedule, createHandoverQR, verifyHandoverQR } from '../../services/admin';
import { checkAvailability } from '../../services/utility';

export default function TransfersSection() {
  const [rentalId, setRentalId] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [qr, setQr] = useState(null);
  const [msg, setMsg] = useState('');
  const [availability, setAvailability] = useState(null);
  const [availParams, setAvailParams] = useState({ product_id: '', from_ts: '', to_ts: '' });
  const [handoverType, setHandoverType] = useState('pickup');
  const [verifyToken, setVerifyToken] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  async function createPickup() {
    setMsg('');
    try { await createSchedule({ rental_id: Number(rentalId), type: 'pickup', scheduled_for: scheduledFor }); setMsg('Pickup scheduled'); } catch { setMsg('Failed'); }
  }
  async function createReturn() {
    setMsg('');
    try { await createSchedule({ rental_id: Number(rentalId), type: 'return', scheduled_for: scheduledFor }); setMsg('Return scheduled'); } catch { setMsg('Failed'); }
  }
  async function issueQR() {
    setMsg('');
    try { const res = await createHandoverQR({ rental_id: Number(rentalId), type: handoverType }); setQr(res); setMsg('QR issued'); } catch { setMsg('Failed'); }
  }
  async function verifyQR() {
    setMsg('');
    try {
      const token = (verifyToken || qr?.qr_token || qr?.token || '').trim();
      if (!token) throw new Error();
      const res = await verifyHandoverQR({ qr_token: token });
      setMsg(`QR verified${res?.order_status ? `, order marked ${res.order_status}` : ''}`);
    } catch { setMsg('Verify failed'); }
  }
  async function onCheckAvailability() {
    setMsg('');
    try { const res = await checkAvailability({ product_id: Number(availParams.product_id), from_ts: availParams.from_ts, to_ts: availParams.to_ts }); setAvailability(res); setMsg(res.available ? 'Available' : (res.reason || 'Unavailable')); } catch { setMsg('Check failed'); }
  }

  return (
    <div className="p-4 bg-white rounded-xl border shadow-[0_1px_6px_rgba(0,0,0,0.06)] space-y-3">
      {/* Quick actions (minimal) */}
      <div className="flex gap-2 flex-wrap items-center">
        <input className="rounded-xl border bg-[#F1F5F9] px-3 h-10 text-[#111827]" placeholder="rental_id" value={rentalId} onChange={e=>setRentalId(e.target.value)} />
        <button className="px-3 h-10 inline-flex items-center rounded-xl text-sm font-medium bg-[#2563EB] text-white hover:opacity-95 shadow-sm" onClick={()=>{ setHandoverType('pickup'); issueQR(); }}>Issue Pickup QR</button>
        <input className="rounded-xl border bg-[#F1F5F9] px-3 h-10 text-[#111827]" placeholder="paste qr token to verify" value={verifyToken} onChange={(e)=>setVerifyToken(e.target.value)} />
        <button className="px-3 h-10 inline-flex items-center rounded-xl text-sm font-medium border border-neutral-300 bg-white text-[#0F172A] hover:bg-neutral-50" onClick={verifyQR}>Verify QR</button>
        <button className="ml-auto px-3 h-10 inline-flex items-center rounded-xl text-sm font-medium border border-neutral-300 bg-white text-[#0F172A] hover:bg-neutral-50" onClick={()=>setShowAdvanced(s=>!s)}>{showAdvanced?'Hide':'More'} options</button>
      </div>
      {/* Advanced controls */}
      {showAdvanced && (
        <>
          <div className="flex gap-2 flex-wrap items-end">
            <input className="rounded-xl border bg-[#F1F5F9] px-3 h-10 text-[#111827]" type="datetime-local" value={scheduledFor} onChange={e=>setScheduledFor(e.target.value)} />
            <button className="px-3 h-10 inline-flex items-center rounded-xl text-sm font-medium bg-[#2563EB] text-white hover:opacity-95 shadow-sm" onClick={createPickup}>Schedule Pickup</button>
            <button className="px-3 h-10 inline-flex items-center rounded-xl text-sm font-medium border border-neutral-300 bg-white text-[#0F172A] hover:bg-neutral-50" onClick={createReturn}>Schedule Return</button>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <select className="rounded-xl border bg-[#F1F5F9] px-3 h-10 text-[#111827]" value={handoverType} onChange={(e)=>setHandoverType(e.target.value)}>
              <option value="pickup">Pickup</option>
              <option value="return">Return</option>
            </select>
            <button className="px-3 h-10 inline-flex items-center rounded-xl text-sm font-medium bg-[#2563EB] text-white hover:opacity-95 shadow-sm" onClick={issueQR}>Issue QR</button>
          </div>
        </>
      )}
      {qr && (
        <div className="p-3 border rounded-xl inline-flex flex-col items-center gap-2 w-fit">
          <div className="text-sm font-medium text-[#0F172A]">QR Token</div>
          <div className="text-xs text-[#475569] break-all max-w-[320px]">{qr.qr_token || qr.token}</div>
          {(qr.qr_token || qr.token) && (
            <img
              alt="QR"
              className="w-40 h-40 border rounded"
              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qr.qr_token || qr.token)}`}
              onError={(e)=>{ e.currentTarget.style.display='none'; }}
            />
          )}
          <button className="px-3 h-9 inline-flex items-center rounded-xl text-sm border border-neutral-200 bg-white hover:bg-neutral-50" onClick={()=>{ navigator.clipboard?.writeText(String(qr.qr_token || qr.token)); window.dispatchEvent(new CustomEvent('toast',{detail:{type:'info',message:'Token copied'}})); }}>Copy Token</button>
        </div>
      )}
      {showAdvanced && (
      <div className="flex flex-wrap items-end gap-2">
        <input className="rounded-xl border bg-[#F1F5F9] px-3 h-10 text-[#111827]" placeholder="product_id" value={availParams.product_id} onChange={e=>setAvailParams({...availParams,product_id:e.target.value})} />
        <input className="rounded-xl border bg-[#F1F5F9] px-3 h-10 text-[#111827]" type="datetime-local" value={availParams.from_ts} onChange={e=>setAvailParams({...availParams,from_ts:e.target.value})} />
        <input className="rounded-xl border bg-[#F1F5F9] px-3 h-10 text-[#111827]" type="datetime-local" value={availParams.to_ts} onChange={e=>setAvailParams({...availParams,to_ts:e.target.value})} />
        <button className="px-3 h-10 inline-flex items-center rounded-xl text-sm font-medium border border-neutral-300 bg-white text-[#0F172A] hover:bg-neutral-50" onClick={onCheckAvailability}>Check Availability</button>
        {availability && (
          <span className={`px-3 h-7 inline-flex items-center rounded-full text-[11px] border ${availability.available?'bg-[#F1F8E9] text-green-700 border-green-200':'bg-red-50 text-red-700 border-red-200'}`}>{availability.available?'Available':'Unavailable'}</span>
        )}
      </div>
      )}
      {msg && <div className="text-sm text-gray-700">{msg}</div>}
    </div>
  );
}


