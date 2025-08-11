// Seller.jsx - seller workspace with tabs and guarded actions
import React, { useEffect, useMemo, useState } from 'react';
import { listOrders, getOrder, patchOrderStatus } from '../services/rentals';
import { createInvoice, recordPayment } from '../services/billing';
import { listCategories, listCatalogProducts } from '../services/catalog';
import { listInventoryItems, updateInventoryStatus, createSchedule, updateSchedule, createHandoverQR, verifyHandoverQR, createInventoryItem, getRoles, assignRole, createProduct, updateProduct, uploadProductAsset, uploadProductAssetFile } from '../services/admin';
import { getSummary } from '../services/reporting';
import { checkAvailability } from '../services/utility';
import { getMe } from '../services/user';
import { listPromotions, createPromotion } from '../services/engagement';

export default function Seller() {
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [me, setMe] = useState(null);

  useEffect(() => {
    (async () => {
      try { const m = await getMe(); setMe(m); } catch {}
    })();
    if (tab === 'orders') void loadOrders();
  }, [tab]);

  async function loadOrders(params = {}) {
    try {
      setLoading(true); setError('');
      const data = await listOrders(params);
      setOrders(data);
    } catch (e) {
      setError('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="border-b bg-white/90 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-2 overflow-x-auto">
          {['dashboard','orders','products','inventory','transfers','reporting','settings'].map(t => (
            <button key={t} className={`px-3 py-1.5 rounded-full border transition-colors ${tab===t?'bg-black text-white border-black':'bg-white text-gray-800 hover:bg-gray-50 border-gray-200'}`} onClick={()=>setTab(t)}>
              {t.charAt(0).toUpperCase()+t.slice(1)}
            </button>
          ))}
          <div className="ml-auto hidden md:flex items-center gap-1 text-sm text-gray-500">
            <span>1/80</span>
            <button className="ml-2 px-2 py-1 border rounded">{`<`}</button>
            <button className="ml-1 px-2 py-1 border rounded">{`>`}`</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {tab === 'dashboard' && (<DashboardSection />)}

        {tab === 'orders' && (
          <OrdersSection
            loading={loading}
            error={error}
            orders={orders}
            onFilter={(s)=>loadOrders({status:s})}
            onPatch={(id,s)=>patchOrderStatus(id,s).then(()=>loadOrders())}
          />
        )}

        {tab === 'products' && <ProductsSection />}
        {tab === 'inventory' && <InventorySection />}
        {tab === 'transfers' && <TransfersSection />}
        {tab === 'reporting' && (
          <DashboardSection />
        )}
        {tab === 'settings' && (
          <SettingsSection />
        )}
      </div>
    </div>
  );
}

function DashboardSection() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true); setError('');
        const res = await getSummary({});
        if (mounted) setData(res);
      } catch (e) {
        if (mounted) setError('Failed to load summary');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-4">Loading…</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;
  const kpi = data?.kpi || { rentals: 0, revenue: 0 };
  const topProducts = data?.top_products || [];
  const topCategories = data?.top_categories || [];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      <div className="p-4 bg-white rounded border">
        <div className="text-sm text-gray-500">Total Rentals</div>
        <div className="text-2xl font-semibold">{kpi.rentals}</div>
      </div>
      <div className="p-4 bg-white rounded border">
        <div className="text-sm text-gray-500">Revenue</div>
        <div className="text-2xl font-semibold">₹{Number(kpi.revenue).toFixed(2)}</div>
      </div>
      <div className="p-4 bg-white rounded border">
        <div className="text-sm font-medium mb-2">Top Products</div>
        <ul className="text-sm text-gray-700 space-y-1">
          {topProducts.slice(0,5).map((p, i) => (
            <li key={i} className="flex justify-between"><span>{p.title}</span><span>{p.ordered}</span></li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ProductsSection() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', category_id: '', base_price: '', pricing_unit: 'day', active: true, image_url: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const units = ['hour','day','week','month'];
  async function load() {
    const [cats, prods] = await Promise.all([listCategories(), listCatalogProducts({ active: true })]);
    setCategories(cats); setItems(prods);
  }
  useEffect(() => { load(); }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([listCategories(), listCatalogProducts({ active: true })]);
        if (mounted) { setCategories(cats); setItems(prods); }
      } finally { if (mounted) setLoading(false); }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-4">Loading…</div>;
  return (
    <div className="p-4 bg-white rounded-xl border shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-full bg-purple-600 text-white" onClick={async()=>{
            const payload = {
              title: form.title,
              category_id: Number(form.category_id)||null,
              base_price: Number(form.base_price)||0,
              pricing_unit: form.pricing_unit,
              active: !!form.active
            };
            try { const res = await createProduct(payload); setSelectedProduct(res); await load(); } catch {}
          }}>Create</button>
          <button className="px-3 py-1.5 rounded-full border" onClick={async()=>{
            if (!selectedProduct) return;
            try { await createInventoryItem({ product_id: selectedProduct.product_id || selectedProduct.id, sku: `SKU-${Date.now()}`, serial: `SN-${Date.now()}`, qty: 1, status: 'available' }); await load(); } catch {}
          }}>Update stock</button>
        </div>
        <div className="text-sm text-gray-500">{items.length}/80
          <button className="ml-2 px-2 py-1 border rounded">{`<`}</button>
          <button className="ml-1 px-2 py-1 border rounded">{`>`}</button>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="font-medium mb-2">General Product info</div>
          <div className="space-y-3">
            <input className="w-full border rounded px-3 py-2" placeholder="Product title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
            <select className="w-full border rounded px-3 py-2" value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})}>
              <option value="">Select category</option>
              {categories.map(c=>(<option key={c.category_id} value={c.category_id}>{c.name}</option>))}
            </select>
            <div className="flex gap-3">
              <input className="w-1/2 border rounded px-3 py-2" type="number" placeholder="Base price" value={form.base_price} onChange={e=>setForm({...form,base_price:e.target.value})} />
              <select className="w-1/2 border rounded px-3 py-2" value={form.pricing_unit} onChange={e=>setForm({...form,pricing_unit:e.target.value})}>
                {units.map(u=> (<option key={u} value={u}>{u}</option>))}
              </select>
            </div>
            <div className="flex gap-3">
              <input className="w-full border rounded px-3 py-2" placeholder="Image URL (optional)" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} />
              <input className="w-full border rounded px-3 py-2" type="file" accept="image/*" onChange={async (e)=>{
                if (!selectedProduct) { window.dispatchEvent(new CustomEvent('toast',{detail:{type:'error',message:'Select or create a product first'}})); return; }
                const file = e.target.files?.[0]; if (!file) return;
                try { await uploadProductAssetFile(selectedProduct.product_id || selectedProduct.id, file); await load(); window.dispatchEvent(new CustomEvent('toast',{detail:{type:'info',message:'Image uploaded'}})); } catch {}
              }} />
            </div>
            <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})} /> Active</label>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 rounded-full border" onClick={async()=>{
                if (!selectedProduct && form.image_url) {
                  window.dispatchEvent(new CustomEvent('toast',{detail:{type:'error',message:'Create product first, then add image URL'}}));
                  return;
                }
                if (selectedProduct && form.image_url) {
                  try { await uploadProductAsset(selectedProduct.product_id || selectedProduct.id, { asset_type:'image', uri: form.image_url }); setForm({...form, image_url:''}); await load(); window.dispatchEvent(new CustomEvent('toast',{detail:{type:'info',message:'Image added'}})); } catch {}
                }
              }}>Add Image URL</button>
              <button className="px-3 py-1.5 rounded-full border" onClick={async()=>{
                if (!selectedProduct) return;
                try { await updateProduct(selectedProduct.product_id || selectedProduct.id, {
                  title: form.title || selectedProduct.title,
                  category_id: Number(form.category_id)||selectedProduct.category_id,
                  base_price: Number(form.base_price||selectedProduct.base_price)||0,
                  pricing_unit: form.pricing_unit || selectedProduct.pricing_unit,
                  active: !!form.active
                }); window.dispatchEvent(new CustomEvent('toast',{detail:{type:'info',message:'Product updated'}})); await load(); } catch {}
              }}>Save Changes</button>
            </div>
          </div>
        </div>
        <div>
          <div className="font-medium mb-2">Rental Pricing</div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-gray-500">Rental Period</div>
            <div className="text-gray-500">Pricelist</div>
            <div className="text-gray-500">Price</div>
            {units.map(u => (
              <>
                <div className="border rounded px-2 py-1 bg-gray-50">{u}</div>
                <div className="border rounded px-2 py-1 bg-gray-50">standard</div>
                <div className="border rounded px-2 py-1">₹{form.base_price||0}</div>
              </>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6">
        <div className="font-medium mb-2">Catalog</div>
        <div className="overflow-auto border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-50"><tr><th className="text-left p-2">Product</th><th className="p-2">Price</th><th className="p-2">Unit</th><th className="p-2"></th></tr></thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.product_id || p.id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{p.title || p.name}</td>
                  <td className="p-2">₹{Number(p.base_price || p.price || 0).toFixed(2)}</td>
                  <td className="p-2">{p.pricing_unit}</td>
                  <td className="p-2 text-right"><button className="px-2 py-1 border rounded" onClick={()=>setSelectedProduct(p)}>Select</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InventorySection() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('');

  async function load() {
    try { setLoading(true); setError('');
      const res = await listInventoryItems({ status: filter || undefined });
      setItems(res);
    } catch { setError('Failed to load inventory'); } finally { setLoading(false); }
  }

  useEffect(() => { load(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  return (
    <div className="p-4 bg-white rounded border">
      <div className="flex items-center gap-2 mb-3">
        <select className="border rounded px-2 py-1" value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="rented">Rented</option>
        </select>
        <button className="px-2 py-1 rounded border" onClick={load}>Refresh</button>
      </div>
      {loading ? 'Loading…' : error ? <div className="text-red-600">{error}</div> : (
        <table className="w-full text-sm">
          <thead><tr><th className="text-left p-2">Item</th><th className="p-2">SKU</th><th className="p-2">Status</th><th className="p-2">Actions</th></tr></thead>
          <tbody>
            {items.map((it)=> (
              <tr key={it.item_id} className="border-t">
                <td className="p-2">#{it.item_id}</td>
                <td className="p-2">{it.sku}</td>
                <td className="p-2">{it.status}</td>
                <td className="p-2">
                  <button className="px-2 py-1 border rounded mr-2" onClick={()=>updateInventoryStatus(it.item_id,'available').then(load)}>Avail</button>
                  <button className="px-2 py-1 border rounded mr-2" onClick={()=>updateInventoryStatus(it.item_id,'reserved').then(load)}>Reserve</button>
                  <button className="px-2 py-1 border rounded" onClick={()=>updateInventoryStatus(it.item_id,'rented').then(load)}>Rent</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function TransfersSection() {
  const [rentalId, setRentalId] = useState('');
  const [scheduledFor, setScheduledFor] = useState('');
  const [qr, setQr] = useState(null);
  const [msg, setMsg] = useState('');
  const [availability, setAvailability] = useState(null);
  const [availParams, setAvailParams] = useState({ product_id: '', from_ts: '', to_ts: '' });

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
    try { const res = await createHandoverQR({ rental_id: Number(rentalId), type: 'handover' }); setQr(res); setMsg('QR issued'); } catch { setMsg('Failed'); }
  }
  async function verifyQR() {
    setMsg('');
    try { const token = qr?.token || qr?.qr_token || ''; if (!token) throw new Error(); await verifyHandoverQR({ qr_token: token }); setMsg('QR verified'); } catch { setMsg('Verify failed'); }
  }
  async function onCheckAvailability() {
    setMsg('');
    try { const res = await checkAvailability({ product_id: Number(availParams.product_id), from_ts: availParams.from_ts, to_ts: availParams.to_ts }); setAvailability(res); setMsg(res.available ? 'Available' : (res.reason || 'Unavailable')); } catch { setMsg('Check failed'); }
  }

  return (
    <div className="p-4 bg-white rounded-xl border shadow-sm space-y-3">
      <div className="flex gap-2">
        <input className="border rounded px-2 py-1" placeholder="rental_id" value={rentalId} onChange={e=>setRentalId(e.target.value)} />
        <input className="border rounded px-2 py-1" type="datetime-local" value={scheduledFor} onChange={e=>setScheduledFor(e.target.value)} />
        <button className="px-2 py-1 border rounded" onClick={createPickup}>Schedule Pickup</button>
        <button className="px-2 py-1 border rounded" onClick={createReturn}>Schedule Return</button>
      </div>
      <div className="flex gap-2">
        <button className="px-2 py-1 border rounded" onClick={issueQR}>Issue QR</button>
        <button className="px-2 py-1 border rounded" onClick={verifyQR} disabled={!qr}>Verify QR</button>
      </div>
      <div className="flex flex-wrap items-end gap-2">
        <input className="border rounded px-2 py-1" placeholder="product_id" value={availParams.product_id} onChange={e=>setAvailParams({...availParams,product_id:e.target.value})} />
        <input className="border rounded px-2 py-1" type="datetime-local" value={availParams.from_ts} onChange={e=>setAvailParams({...availParams,from_ts:e.target.value})} />
        <input className="border rounded px-2 py-1" type="datetime-local" value={availParams.to_ts} onChange={e=>setAvailParams({...availParams,to_ts:e.target.value})} />
        <button className="px-2 py-1 border rounded" onClick={onCheckAvailability}>Check Availability</button>
        {availability && (
          <span className={`px-2 py-1 rounded-full text-xs ${availability.available?'bg-green-50 text-green-700 border border-green-200':'bg-red-50 text-red-700 border border-red-200'}`}>{availability.available?'Available':'Unavailable'}</span>
        )}
      </div>
      {msg && <div className="text-sm text-gray-700">{msg}</div>}
    </div>
  );
}

function OrdersSection({ loading, error, orders, onFilter, onPatch }) {
  const filters = [
    { label: 'All', value: '' },
    { label: 'Quotation', value: 'quotation' },
    { label: 'Reserved', value: 'reserved' },
    { label: 'Pickedup', value: 'active' },
    { label: 'Returned', value: 'returned' },
    { label: 'Completed', value: 'completed' }
  ];
  return (
    <div className="bg-white rounded-xl border shadow-sm">
      <div className="flex items-center gap-2 p-3 border-b sticky top-14 bg-white/90 backdrop-blur rounded-t-xl">
        <button className="px-3 py-1.5 rounded-full bg-purple-600 text-white shadow-sm hover:opacity-95" onClick={()=>window.dispatchEvent(new CustomEvent('toast',{detail:{type:'info', message:'Use checkout to create customer orders; seller order creation coming next.'}}))}>Create</button>
        <div className="ml-2 flex items-center gap-2 text-xs text-gray-600">
          <span className="tracking-wide">RENTAL STATUS</span>
          {filters.map(f => (
            <button key={f.label} className="px-3 py-1 rounded-full border text-gray-700 hover:bg-gray-50" onClick={()=>onFilter(f.value)}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto hidden md:flex items-center gap-1 text-sm text-gray-500">
          <button className="px-2 py-1 border rounded">Cart</button>
          <button className="px-2 py-1 border rounded">List</button>
        </div>
      </div>
      <div className="p-4">
        {loading ? 'Loading…' : error ? <div className="text-red-600">{error}</div> : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {orders.items.map((o) => (
              <div key={o.rental_id} className="rounded-2xl border border-gray-200 p-4 shadow-sm bg-white hover:shadow-md transition">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium truncate">Customer {String(o.customer_id)}</div>
                  <div className={`px-2.5 py-0.5 rounded-full text-xs border ${o.status==='reserved'?'bg-green-50 text-green-700 border-green-200': o.status==='completed' ? 'bg-gray-50 text-gray-700 border-gray-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>{o.status}</div>
                </div>
                <div className="text-2xl font-semibold mt-2">₹ {Number(o.total_amount||0).toFixed(0)}</div>
                <div className="text-xs text-gray-500 mt-1">R{String(o.rental_id).padStart(4,'0')} • {new Date(o.start_ts || Date.now()).toLocaleDateString()}</div>
                <div className="flex items-center gap-2 mt-3">
                  <button className="px-3 py-1.5 rounded-full border hover:bg-gray-50" onClick={()=>onPatch(o.rental_id,'active')}>Mark Ready</button>
                  <button className="px-3 py-1.5 rounded-full border hover:bg-gray-50" onClick={()=>onPatch(o.rental_id,'completed')}>Mark Done</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsSection() {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({ code: '', discount_type: 'percentage', discount_value: 10 });
  useEffect(() => { (async()=>{ try { const p = await listPromotions(); setPromos(p);} catch{} })(); }, []);
  async function onCreatePromo() {
    try { await createPromotion(form); const p = await listPromotions(); setPromos(p); window.dispatchEvent(new CustomEvent('toast',{detail:{type:'info',message:'Promotion created'}})); } catch {}
  }
  return (
    <div className="p-4 bg-white rounded-xl border shadow-sm">
      <div className="font-medium mb-2">Promotions</div>
      <div className="flex flex-wrap gap-2 mb-3">
        <input className="border rounded px-2 py-1" placeholder="CODE" value={form.code} onChange={e=>setForm({...form,code:e.target.value})} />
        <select className="border rounded px-2 py-1" value={form.discount_type} onChange={e=>setForm({...form,discount_type:e.target.value})}>
          <option value="percentage">percentage</option>
          <option value="fixed">fixed</option>
        </select>
        <input className="border rounded px-2 py-1" type="number" placeholder="value" value={form.discount_value} onChange={e=>setForm({...form,discount_value:Number(e.target.value)})} />
        <button className="px-3 py-1.5 rounded-full border" onClick={onCreatePromo}>Add Offer</button>
      </div>
      <div className="overflow-auto border rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-50"><tr><th className="p-2 text-left">Code</th><th className="p-2">Type</th><th className="p-2">Value</th></tr></thead>
          <tbody>{promos.map((p,i)=>(<tr key={i} className="border-t"><td className="p-2">{p.code}</td><td className="p-2">{p.discount_type || p.type}</td><td className="p-2">{p.value || p.discount_value}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}


