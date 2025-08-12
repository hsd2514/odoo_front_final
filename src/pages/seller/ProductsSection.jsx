// ProductsSection.jsx - manage categories, products, assets
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { listCategories, listCatalogProducts, listProductAssets } from '../../services/catalog';
import { createInventoryItem, createProduct, updateProduct, uploadProductAsset, uploadProductAssetFile, deleteProductAsset } from '../../services/admin';

export default function ProductsSection({ me }) {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ title: '', category_id: '', base_price: '', pricing_unit: 'day', active: true, image_url: '' });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [assets, setAssets] = useState([]);
  const [saving, setSaving] = useState(false);
  const [pendingFile, setPendingFile] = useState(null);
  const [pendingFileName, setPendingFileName] = useState('');
  const fileInputRef = useRef(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const pagedItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page]);
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

  if (loading) return <div className="p-4 text-[#1F2937]">Loading…</div>;
  const canCreate = form.title && Number(form.base_price) > 0 && form.pricing_unit && (form.category_id || form.category_id === '');
  const canUpdateStock = !!selectedProduct;
  const canSave = !!selectedProduct;
  const canAddImageUrl = !!selectedProduct && !!form.image_url;

  return (
    <div className="p-4 bg-white rounded-xl border shadow-[0_1px_6px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button disabled={!canCreate || saving} className={`px-3 h-9 inline-flex items-center rounded-xl text-sm ${canCreate? 'bg-[#2563EB] text-white hover:opacity-95 shadow-sm':'bg-neutral-300 text-neutral-700'} ${saving?'opacity-70':''}`} onClick={async()=>{
            const payload = {
              title: form.title,
              seller_id: me?.user_id || me?.id || 1,
              category_id: form.category_id ? Number(form.category_id) : null,
              base_price: Number(form.base_price)||0,
              pricing_unit: form.pricing_unit,
              active: !!form.active
            };
            try { setSaving(true); const res = await createProduct(payload); setSelectedProduct(res); window.dispatchEvent(new CustomEvent('toast',{detail:{type:'info',message:'Product created'}})); await load(); try { const a = await listProductAssets(res.product_id || res.id); setAssets(a); } catch {} } catch (e) { window.dispatchEvent(new CustomEvent('toast',{detail:{type:'error',message:(e?.response?.data?.detail)||'Create failed'}})); } finally { setSaving(false); }
          }}>{saving ? 'Creating…' : 'Create'}</button>
          <button disabled={!canUpdateStock || saving} className="px-3 h-9 inline-flex items-center rounded-xl text-sm border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-50 text-[#111827]" onClick={async()=>{
            if (!selectedProduct) return;
            try { setSaving(true); await createInventoryItem({ product_id: selectedProduct.product_id || selectedProduct.id, sku: `SKU-${Date.now()}`, serial: `SN-${Date.now()}`, qty: 1, status: 'available' }); await load(); window.dispatchEvent(new CustomEvent('toast',{detail:{type:'info',message:'Stock item added'}})); } catch (e) { window.dispatchEvent(new CustomEvent('toast',{detail:{type:'error',message:(e?.response?.data?.detail)||'Stock update failed'}})); } finally { setSaving(false); }
          }}>{saving ? 'Updating…' : 'Update stock'}</button>
        </div>
        <div className="flex items-center gap-2 text-sm text-[#374151]">
          <span>{items.length} items</span>
          <span className="mx-1">•</span>
          <span>Page {page} of {totalPages}</span>
          <button className="ml-2 px-2 h-8 inline-flex items-center rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-50" onClick={()=>setPage((p)=>Math.max(1,p-1))} disabled={page<=1}>{`<`}</button>
          <button className="px-2 h-8 inline-flex items-center rounded-xl border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-50" onClick={()=>setPage((p)=>Math.min(totalPages,p+1))} disabled={page>=totalPages}>{`>`}</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <div className="mb-2 text-[#111827] font-semibold">General Product info</div>
          <div className="space-y-3">
            <input className="w-full rounded-xl border bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 focus:outline-none focus:ring-4 border-neutral/20 focus:ring-neutral/60  focus:border-neutral/40" placeholder="Product title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} />
            <select className="w-full rounded-xl border bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-3 h-12 text-sm text-neutral-900 focus:outline-none" value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})}>
              <option value="">Select category</option>
              {categories.map(c=>(<option key={c.category_id} value={c.category_id}>{c.name}</option>))}
            </select>
            <div className="flex gap-3">
              <input className="w-1/2 rounded-xl border bg-[#F1F5F9] focus:bg-white transition-colors duration-150 px-4 h-12 text-sm text-neutral-900 focus:outline-none" type="number" placeholder="Base price" value={form.base_price} onChange={e=>setForm({...form,base_price:e.target.value})} />
              <select className="w-1/2 rounded-xl border bg-[#f4f6fa] focus:bg-white transition-colors duration-150 px-3 h-12 text-sm text-neutral-900 focus:outline-none" value={form.pricing_unit} onChange={e=>setForm({...form,pricing_unit:e.target.value})}>
                {units.map(u=> (<option key={u} value={u}>{u}</option>))}
              </select>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <input className="w-full md:w-auto flex-1 rounded-xl border bg-[#F1F5F9] focus:bg-white transition-colors duration-150 px-4 h-12 text-sm placeholder:text-neutral/50 text-neutral-900 focus:outline-none" placeholder="Image URL (optional)" value={form.image_url} onChange={e=>setForm({...form,image_url:e.target.value})} />
              <input ref={fileInputRef} className="hidden" type="file" accept="image/*" onChange={(e)=>{
                const file = e.target.files?.[0];
                setPendingFile(file || null);
                setPendingFileName(file ? file.name : '');
              }} />
              <button className="px-3 h-12 inline-flex items-center rounded-xl text-sm border border-neutral-300 bg-white hover:bg-neutral-50 text-[#111827]" onClick={()=>{
                if (!selectedProduct) { window.dispatchEvent(new CustomEvent('toast',{detail:{type:'error',message:'Select or create a product first'}})); return; }
                fileInputRef.current?.click();
              }}>Choose File</button>
              <span className="text-sm text-[#374151] truncate max-w-[200px]">{pendingFileName || 'No file chosen'}</span>
              <button disabled={!pendingFile || !selectedProduct || saving} className="px-3 h-12 inline-flex items-center rounded-xl text-sm bg-[#2563EB] text-white hover:opacity-95 shadow-sm disabled:opacity-50" onClick={async()=>{
                if (!pendingFile || !selectedProduct) return;
                try { setSaving(true); await uploadProductAssetFile(selectedProduct.product_id || selectedProduct.id, pendingFile); const a = await listProductAssets(selectedProduct.product_id || selectedProduct.id); setAssets(a); await load(); setPendingFile(null); setPendingFileName(''); window.dispatchEvent(new CustomEvent('toast',{detail:{type:'info',message:'Image uploaded'}})); } catch (e) { window.dispatchEvent(new CustomEvent('toast',{detail:{type:'error',message:(e?.response?.data?.detail)||'Upload failed'}})); } finally { setSaving(false); }
              }}>{saving ? 'Uploading…' : 'Upload'}</button>
            </div>
            <label className="inline-flex items-center gap-2 text-sm text-neutral-900"><input type="checkbox" checked={form.active} onChange={e=>setForm({...form,active:e.target.checked})} /> Active</label>
            <div className="flex gap-2">
              <button disabled={!canAddImageUrl || saving} className="px-3 h-9 inline-flex items-center rounded-xl text-sm bg-[#2563EB] text-white hover:opacity-95 shadow-sm disabled:opacity-50" onClick={async()=>{
                if (!selectedProduct && form.image_url) {
                  window.dispatchEvent(new CustomEvent('toast',{detail:{type:'error',message:'Create product first, then add image URL'}}));
                  return;
                }
                if (selectedProduct && form.image_url) {
                  try { setSaving(true); await uploadProductAsset(selectedProduct.product_id || selectedProduct.id, { asset_type:'image', uri: form.image_url }); setForm({...form, image_url:''}); const a = await listProductAssets(selectedProduct.product_id || selectedProduct.id); setAssets(a); await load(); window.dispatchEvent(new CustomEvent('toast',{detail:{type:'info',message:'Image added'}})); } catch (e) { window.dispatchEvent(new CustomEvent('toast',{detail:{type:'error',message:(e?.response?.data?.detail)||'Add failed'}})); } finally { setSaving(false); }
                }
              }}>{saving ? 'Adding…' : 'Add Image URL'}</button>
              <button disabled={!canSave || saving} className="px-3 h-9 inline-flex items-center rounded-xl text-sm border border-neutral-300 bg-white hover:bg-neutral-50 disabled:opacity-50 text-[#111827]" onClick={async()=>{
                if (!selectedProduct) return;
                try { setSaving(true); await updateProduct(selectedProduct.product_id || selectedProduct.id, {
                  title: form.title || selectedProduct.title,
                  seller_id: me?.user_id || me?.id || selectedProduct.seller_id || 1,
                  category_id: form.category_id ? Number(form.category_id) : selectedProduct.category_id,
                  base_price: Number(form.base_price || selectedProduct.base_price) || 0,
                  pricing_unit: form.pricing_unit || selectedProduct.pricing_unit,
                  active: !!form.active
                }); window.dispatchEvent(new CustomEvent('toast',{detail:{type:'info',message:'Product updated'}})); await load(); } catch (e) { window.dispatchEvent(new CustomEvent('toast',{detail:{type:'error',message:(e?.response?.data?.detail)||'Update failed'}})); } finally { setSaving(false); }
              }}>{saving ? 'Saving…' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
        <div>
          <div className="mb-2 text-[#0F172A] font-semibold">Rental Pricing</div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-gray-500 font-light">Rental Period</div>
            <div className="text-gray-500 font-light">Pricelist</div>
            <div className="text-gray-500 font-light">Price</div>
            {units.map(u => (
              <>
                <div className="border border-neutral/200 rounded px-2 py-1 bg-neutral-50 font-light text-[#374151]">{u}</div>
                <div className="border border-neutral/200 rounded px-2 py-1 bg-neutral-50 font-light text-[#374151]">standard</div>
                <div className="border border-neutral/200 rounded px-2 py-1 font-medium text-[#111827]">₹{form.base_price||0}</div>
              </>
            ))}
          </div>
          {selectedProduct && (
            <div className="mt-4">
              <div className="font-medium mb-2 text-neutral">Assets</div>
              <div className="flex flex-wrap gap-3">
                {assets.map((a)=> (
                  <div key={a.asset_id || a.id} className="w-24">
                    <img alt="asset" className="w-24 h-24 object-cover rounded border" src={a.uri || a.url || a.image_url || ''} onError={(e)=>{e.currentTarget.src='https://via.placeholder.com/96x96?text=No+Img';}} />
                    <button className="mt-1 w-full px-2 h-8 inline-flex items-center justify-center rounded-xl border border-neutral/200 bg-white hover:bg-neutral-50 text-xs" onClick={async()=>{ try { await deleteProductAsset(selectedProduct.product_id || selectedProduct.id, a.asset_id || a.id); const next = await listProductAssets(selectedProduct.product_id || selectedProduct.id); setAssets(next); } catch {} }}>Delete</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-2 text-[#0F172A] font-semibold">Catalog</div>
        <div className="overflow-auto border rounded">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-[#6B7280] font-light"><tr><th className="text-left p-2 font-light">Product</th><th className="p-2 font-light">Price</th><th className="p-2 font-light">Unit</th><th className="p-2 font-light"></th></tr></thead>
            <tbody>
              {pagedItems.map((p) => (
                <tr key={p.product_id || p.id} className={`border-t hover:bg-gray-50 ${selectedProduct && ((selectedProduct.product_id||selectedProduct.id)===(p.product_id||p.id)) ? 'bg-[#F0F9FF]' : ''}`}>
                  <td className="p-2 text-[#111827] font-medium">{p.title || p.name}</td>
                  <td className="p-2 text-[#111827] font-light">₹{Number(p.base_price || p.price || 0).toFixed(2)}</td>
                  <td className="p-2 text-[#374151] font-light">{p.pricing_unit}</td>
                  <td className="p-2 text-right"><button className="px-3 h-9 inline-flex items-center rounded-xl text-sm border border-neutral-300 bg-white hover:bg-neutral-50 text-[#111827]" onClick={async()=>{
                    setSelectedProduct(p);
                    setForm({ title: p.title || p.name || '', category_id: p.category_id || '', base_price: String(p.base_price || p.price || ''), pricing_unit: p.pricing_unit || 'day', active: p.active !== false, image_url: '' });
                    try { const a = await listProductAssets(p.product_id || p.id); setAssets(a); } catch { setAssets([]); }
                  }}>Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


