// Profile.jsx - user profile showing orders
import React, { useEffect, useRef, useState } from 'react';
import { getMe } from '../services/user';
import { listOrders } from '../services/rentals';
import { verifyHandoverQR } from '../services/admin';

export default function Profile() {
  const [me, setMe] = useState(null);
  const [orders, setOrders] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('customer'); // customer | seller
  const [scanner, setScanner] = useState({ open: false, processing: false, message: '' });
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const detectorRef = useRef(null);

  useEffect(() => { (async () => { try { const u = await getMe(); setMe(u); } catch {} })(); }, []);
  useEffect(() => { (async () => {
    if (!me) return;
    try {
      setLoading(true); setError('');
      const params = tab === 'customer' ? { customer_id: me.user_id } : { seller_id: me.user_id };
      const data = await listOrders({ ...params, page: 1, limit: 50 });
      setOrders(data);
    } catch { setError('Failed to load orders'); }
    finally { setLoading(false); }
  })(); }, [me, tab]);

  async function startScanner() {
    try {
      setScanner({ open: true, processing: true, message: 'Starting camera…' });
      // Prefer back camera
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      if ('BarcodeDetector' in window) {
        // @ts-ignore
        detectorRef.current = new window.BarcodeDetector({ formats: ['qr_code'] });
        loopDetect();
      } else {
        // Fallback: jsQR via CDN
        setScanner({ open: true, processing: true, message: 'Loading scanner…' });
        await loadJsQR();
        loopDetectJsQR();
      }
    } catch (e) {
      setScanner({ open: true, processing: false, message: 'Camera permission denied. Paste token instead.' });
    }
  }

  async function loopDetect() {
    if (!detectorRef.current || !videoRef.current) { setScanner((s)=>({ ...s, processing: false })); return; }
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const tick = async () => {
      if (!detectorRef.current || !videoRef.current) return;
      try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        // @ts-ignore
        const codes = await detectorRef.current.detect(canvas);
        if (codes && codes.length > 0) {
          const raw = String(codes[0]?.rawValue || '').trim();
          await onTokenScanned(raw);
          return;
        }
      } catch {}
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function stopScanner() {
    try { if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop()); } catch {}
    streamRef.current = null; detectorRef.current = null;
    setScanner({ open: false, processing: false, message: '' });
  }

  function loadJsQR() {
    return new Promise((resolve, reject) => {
      if (window.jsQR) return resolve();
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load jsQR'));
      document.head.appendChild(s);
    });
  }

  function loopDetectJsQR() {
    const video = videoRef.current;
    if (!video) { setScanner((s)=>({ ...s, processing: false })); return; }
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const tick = async () => {
      if (!videoRef.current) return;
      try {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (imageData && window.jsQR) {
          const code = window.jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            await onTokenScanned(String(code.data));
            return;
          }
        }
      } catch {}
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    setScanner((s)=>({ ...s, processing: false, message: '' }));
  }

  function extractToken(input) {
    try {
      // If full URL with token param
      if (/^https?:\/\//i.test(input)) {
        const url = new URL(input);
        const param = url.searchParams.get('token');
        return (param || '').trim();
      }
      return input.trim();
    } catch { return input.trim(); }
  }

  async function onTokenScanned(input) {
    const token = extractToken(input);
    if (!token) { setScanner((s)=>({ ...s, processing: false, message: 'Invalid token' })); return; }
    try {
      setScanner((s)=>({ ...s, processing: true, message: 'Verifying…' }));
      const res = await verifyHandoverQR({ qr_token: token });
      const msg = res?.order_status ? `Order marked ${res.order_status}` : 'Verified';
      window.dispatchEvent(new CustomEvent('toast',{detail:{type:'info',message: msg}}));
      stopScanner();
      // Refresh orders
      if (me) {
        const params = tab === 'customer' ? { customer_id: me.user_id } : { seller_id: me.user_id };
        const data = await listOrders({ ...params, page: 1, limit: 50 });
        setOrders(data);
      }
    } catch (e) {
      const detail = e?.response?.data?.detail || 'Verification failed';
      setScanner((s)=>({ ...s, processing: false, message: detail }));
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xl font-semibold text-[#0F172A]">My Profile</div>
          <div className="text-sm text-[#64748B]">{me?.email}</div>
        </div>
        <div className="flex items-center gap-2">
          <button className={`px-3 h-9 inline-flex items-center rounded-xl text-sm ${tab==='customer'?'bg-[#2563EB] text-white':'border border-neutral-300 bg-white text-[#111827]'}`} onClick={()=>setTab('customer')}>My Purchases</button>
          <button className={`px-3 h-9 inline-flex items-center rounded-xl text-sm ${tab==='seller'?'bg-[#2563EB] text-white':'border border-neutral-300 bg-white text-[#111827]'}`} onClick={()=>setTab('seller')}>My Sales</button>
        </div>
      </div>

      {loading ? (
        <div className="text-[#1F2937]">Loading…</div>
      ) : error ? (
        <div className="text-[#B91C1C]">{error}</div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {orders.items.map((o) => (
            <button key={o.rental_id} className="text-left rounded-2xl border border-neutral/200 p-4 shadow-sm bg-white hover:shadow-md transition" onClick={startScanner}>
              <div className="flex items-center justify-between text-sm">
                <div className="font-medium truncate">Order R{String(o.rental_id).padStart(4,'0')}</div>
                <span className={`px-2.5 h-6 inline-flex items-center rounded-full text-[11px] border ${o.status==='reserved'?'bg-[#F59E0B] text-white border-transparent': o.status==='completed' ? 'bg-[#22C55E] text-white border-transparent' : 'bg-[#CBD5E1] text-[#111827] border-transparent'}`}>{o.status}</span>
              </div>
              <div className="text-2xl font-semibold mt-2 text-[#1F2937]">₹ {Number(o.total_amount||0).toFixed(0)}</div>
              <div className="text-xs text-[#475569] mt-1">{new Date(o.start_ts).toLocaleDateString()} → {new Date(o.end_ts).toLocaleDateString()}</div>
              {tab==='seller' && (<div className="text-xs text-[#64748B] mt-1">Customer #{o.customer_id}</div>)}
              {tab==='customer' && (<div className="text-xs text-[#64748B] mt-1">Seller #{o.seller_id}</div>)}
            </button>
          ))}
          {orders.items.length === 0 && (
            <div className="text-sm text-[#64748B]">No orders found.</div>
          )}
        </div>
      )}
      {scanner.open && (
        <div className="fixed inset-0 bg-black/30 grid place-items-center p-4" onClick={stopScanner}>
          <div className="bg-white rounded-xl border shadow-lg w-full max-w-sm p-4" onClick={(e)=>e.stopPropagation()}>
            <div className="text-lg font-semibold mb-2">Scan QR</div>
            <video ref={videoRef} className="w-full rounded border bg-black/10" playsInline muted />
            <div className="text-xs text-[#475569] mt-2">{scanner.message}</div>
            <div className="mt-3 flex items-center gap-2 justify-end">
              <button className="px-3 h-9 inline-flex items-center rounded-xl text-sm border border-neutral-200 bg-white hover:bg-neutral-50" onClick={stopScanner}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


