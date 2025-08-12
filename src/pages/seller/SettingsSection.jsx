// SettingsSection.jsx - promotions (and later roles)
import React, { useEffect, useState } from 'react';
import { listPromotions, createPromotion } from '../../services/engagement';

export default function SettingsSection() {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({ code: '', discount_type: 'percentage', discount_value: 10 });
  useEffect(() => { (async()=>{ try { const p = await listPromotions(); setPromos(p);} catch{} })(); }, []);
  async function onCreatePromo() {
    try { await createPromotion(form); const p = await listPromotions(); setPromos(p); window.dispatchEvent(new CustomEvent('toast',{detail:{type:'info',message:'Promotion created'}})); } catch {}
  }
  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-xl border shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
        <div className="mb-3 text-[#0F172A] font-semibold">Promotions</div>
        <div className="grid md:grid-cols-4 gap-3 items-end">
          <label className="text-xs text-[#0F172A]">
            <div className="mb-1">Code</div>
            <input className="w-full rounded-xl border bg-[#F1F5F9] px-3 h-10" placeholder="SUMMER10" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} />
          </label>
          <label className="text-xs text-[#0F172A]">
            <div className="mb-1">Type</div>
            <select className="w-full rounded-xl border bg-[#F1F5F9] px-3 h-10" value={form.discount_type} onChange={e=>setForm({...form,discount_type:e.target.value})}>
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed</option>
            </select>
          </label>
          <label className="text-xs text-[#0F172A]">
            <div className="mb-1">Value</div>
            <input className="w-full rounded-xl border bg-[#F1F5F9] px-3 h-10" type="number" placeholder="10" value={form.discount_value} onChange={e=>setForm({...form,discount_value:Number(e.target.value)})} />
          </label>
          <button className="px-4 h-10 inline-flex items-center justify-center rounded-xl text-sm font-medium bg-[#2563EB] text-white hover:opacity-95 shadow-sm" onClick={onCreatePromo}>Add Promotion</button>
        </div>
        <div className="overflow-auto border rounded mt-4">
          <table className="w-full text-sm">
            <thead className="bg-[#F8FAFC] text-[#475569]"><tr><th className="p-2 text-left">Code</th><th className="p-2">Type</th><th className="p-2">Value</th></tr></thead>
            <tbody>{promos.map((p,i)=>(<tr key={i} className="border-t"><td className="p-2 font-medium text-[#0F172A]">{p.code}</td><td className="p-2 text-[#111827]">{p.discount_type || p.type}</td><td className="p-2 text-[#111827]">{p.value || p.discount_value}</td></tr>))}</tbody>
          </table>
        </div>
      </div>

      <div className="p-4 bg-white rounded-xl border shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
        <div className="mb-2 text-[#0F172A] font-semibold">Preferences</div>
        <div className="grid md:grid-cols-3 gap-3">
          <label className="text-xs text-[#0F172A]">
            <div className="mb-1">Currency</div>
            <select className="w-full rounded-xl border bg-[#F1F5F9] px-3 h-10" defaultValue="INR">
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </label>
          <label className="text-xs text-[#0F172A]">
            <div className="mb-1">Timezone</div>
            <select className="w-full rounded-xl border bg-[#F1F5F9] px-3 h-10" defaultValue="Asia/Kolkata">
              <option>Asia/Kolkata</option>
              <option>UTC</option>
              <option>America/New_York</option>
            </select>
          </label>
          <div className="flex items-center gap-2">
            <input id="emails" type="checkbox" className="checkbox checkbox-sm rounded-[4px] [--chkbg:#111] [--chkfg:white]" defaultChecked />
            <label htmlFor="emails" className="text-sm text-[#0F172A]">Email notifications</label>
          </div>
        </div>
      </div>
    </div>
  );
}


