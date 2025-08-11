// Toast.jsx - minimal global toast listener
import React, { useEffect, useState } from 'react';

const Toast = () => {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    const onToast = (e) => {
      setMsg({ type: e.detail?.type || 'info', message: e.detail?.message || '' });
      setTimeout(() => setMsg(null), 3000);
    };
    window.addEventListener('toast', onToast);
    return () => window.removeEventListener('toast', onToast);
  }, []);

  if (!msg) return null;
  const isError = msg.type === 'error';
  return (
    <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-lg shadow ${isError ? 'bg-red-600 text-white' : 'bg-black text-white'}`}>
      {msg.message}
    </div>
  );
};

export default Toast;


