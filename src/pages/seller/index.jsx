// Seller entry - composes sections
import React, { useEffect, useState } from 'react';
import SellerNavbar from './SellerNavbar';
import DashboardSection from './DashboardSection';
import ReportingSection from './ReportingSection';
import OrdersSection from './OrdersSection';
import ProductsSection from './ProductsSection';
import InventorySection from './InventorySection';
// Removed Transfers per request
import SettingsSection from './SettingsSection';
import { getMe } from '../../services/user';
import { listOrders, patchOrderStatus, createOrder } from '../../services/rentals';

export default function Seller() {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [me, setMe] = useState(null);

  useEffect(() => {
    (async () => { try { const m = await getMe(); setMe(m); } catch {} })();
    if (tab === 'orders') void loadOrders();
  }, [tab]);

  async function loadOrders(params = {}) {
    try { setLoading(true); setError(''); const data = await listOrders(params); setOrders(data); }
    catch { setError('Failed to load orders'); }
    finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <SellerNavbar active={tab} onChange={setTab} />
      <div className="max-w-7xl mx-auto px-4 py-6">
        {tab === 'dashboard' && (<DashboardSection />)}
        {tab === 'orders' && (
          <OrdersSection
            loading={loading}
            error={error}
            orders={orders}
            onFilter={(filters)=>loadOrders(filters)}
            onPatch={(id,s)=>patchOrderStatus(id,s).then(()=>loadOrders())}
            onCreate={async (payload)=>{ await createOrder(payload); await loadOrders(); }}
          />
        )}
        {tab === 'products' && <ProductsSection me={me} />}
        {tab === 'inventory' && <InventorySection />}
        {false && <div />}
        {tab === 'reporting' && (<ReportingSection />)}
        {tab === 'settings' && (<SettingsSection />)}
      </div>
    </div>
  );
}


