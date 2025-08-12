// HandoverVerify.jsx - user-facing QR verification via link
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyHandoverQR } from '../services/admin';

function useQuery() {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
}

export default function HandoverVerify() {
  const query = useQuery();
  const navigate = useNavigate();
  const [state, setState] = useState({ loading: true, ok: false, message: '' });

  useEffect(() => {
    (async () => {
      const token = (query.get('token') || '').trim();
      if (!token) { setState({ loading: false, ok: false, message: 'Missing token' }); return; }
      try {
        const res = await verifyHandoverQR({ qr_token: token });
        const msg = res?.order_status ? `Order marked ${res.order_status}` : 'Verified';
        setState({ loading: false, ok: true, message: msg });
      } catch (e) {
        const detail = e?.response?.data?.detail || 'Verification failed';
        setState({ loading: false, ok: false, message: detail });
      }
    })();
  }, [query]);

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <div className="text-2xl font-semibold mb-2">Handover Verification</div>
      {state.loading ? (
        <div className="text-[#1F2937]">Verifying…</div>
      ) : state.ok ? (
        <>
          <div className="text-green-700 font-medium">Success</div>
          <div className="text-sm text-[#475569] mt-1">{state.message}</div>
          <button className="mt-4 px-4 h-10 inline-flex items-center rounded-xl text-sm font-medium bg-[#2563EB] text-white hover:opacity-95" onClick={()=>navigate('/home')}>Go to Home</button>
        </>
      ) : (
        <>
          <div className="text-red-700 font-medium">Failed</div>
          <div className="text-sm text-[#475569] mt-1">{state.message}</div>
          <button className="mt-4 px-4 h-10 inline-flex items-center rounded-xl text-sm font-medium border border-neutral-300 bg-white text-[#0F172A] hover:bg-neutral-50" onClick={()=>navigate('/home')}>Go to Home</button>
        </>
      )}
    </div>
  );
}


