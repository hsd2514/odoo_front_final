import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getMe } from '../../services/user';

export default function AuthGuard({ children }) {
  const [state, setState] = useState({ loading: true, ok: false });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        await getMe();
        if (mounted) setState({ loading: false, ok: true });
      } catch {
        if (mounted) setState({ loading: false, ok: false });
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (state.loading) return null;
  if (!state.ok) return <Navigate to="/auth/login" replace />;
  return children;
}


