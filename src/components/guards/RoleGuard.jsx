import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getMe } from '../../services/user';

export default function RoleGuard({ roles = [], children }) {
  const [state, setState] = useState({ loading: true, ok: false });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const me = await getMe();
        const userRoles = (me?.roles || []).map(String);
        const need = roles.map(String);
        const allowed = need.length === 0 || need.some((r) => userRoles.includes(r));
        if (mounted) setState({ loading: false, ok: allowed });
      } catch {
        if (mounted) setState({ loading: false, ok: false });
      }
    })();
    return () => { mounted = false; };
  }, [roles]);

  if (state.loading) return null;
  if (!state.ok) return <Navigate to="/auth/login" replace />;
  return children;
}


