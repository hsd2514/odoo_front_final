// ProductDetail.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductGallery from '../components/ProductGallery';
import QuantityStepper from '../components/QuantityStepper';
import CouponBox from '../components/CouponBox';
import PriceUnitBadge from '../components/PriceUnitBadge';
import { getProduct } from '../services/catalog';
import { durationUnits } from '../utils/duration';
import DateRangePicker from '../components/DateRangePicker';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, priceMultiplier, priceList, setPriceList, addToCart, wishlist, toggleWishlist } = useShop();

  const product = useMemo(() => products.find((p) => String(p?.id ?? p?.product_id ?? p?.uuid ?? p?.pk ?? p?.slug) === String(id)), [products, id]);
  const [loadedProduct, setLoadedProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [coupon, setCoupon] = useState('');

  const notFound = !product && !loadedProduct;

  const pObj = loadedProduct || product || {};
  const resolvedProductId = pObj?.id ?? pObj?.product_id ?? pObj?.uuid ?? pObj?.pk ?? pObj?.slug ?? id;
  const unitPrice = Number(pObj?.price ?? pObj?.unit_price ?? pObj?.base_price ?? 0);
  const pricingUnit = pObj?.pricing_unit || 'day';
  const displayPrice = unitPrice * priceMultiplier;
  const perUnitPrice = Math.max(1, Math.round(displayPrice / 2));

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i += 1) addToCart(resolvedProductId, {
      unitPrice,
      pricingUnit,
      title: pObj?.name || pObj?.title || 'Product',
      startDate: fromDate || undefined,
      endDate: toDate || undefined,
    });
  };

  const isWished = wishlist.has(resolvedProductId);

  useEffect(() => {
    let mounted = true;
    if (!product && id) {
      getProduct(id).then((data) => { if (mounted) setLoadedProduct(data); }).catch(() => {});
    }
    return () => { mounted = false; };
  }, [id, product]);

  const units = durationUnits(pricingUnit, fromDate ? new Date(fromDate) : undefined, toDate ? new Date(toDate) : undefined) || 1;
  const previewTotal = qty * displayPrice * (fromDate && toDate ? units : 1);

  return (
    <div className="min-h-screen bg-[#f6f7f9] text-neutral-900">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {notFound ? (
          <div className="max-w-5xl mx-auto px-4 py-10">
            <div className="rounded-xl bg-white border border-neutral/200 shadow-sm p-6">Product not found. <button className="underline" onClick={() => navigate(-1)}>Go back</button></div>
          </div>
        ) : (
        <>
        {/* Breadcrumb + price list */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-neutral-600">
            <Link to="/home" className="px-3 h-9 inline-flex items-center rounded-lg border border-neutral/30 bg-white shadow-sm mr-2">All Products</Link>
            <span className="text-neutral-500">/</span>
            <span className="ml-2">{pObj?.name || pObj?.title || 'Product'}</span>
          </div>
          <select
            className="w-44 h-10 px-3 rounded-lg border border-neutral/30 bg-white shadow-sm text-sm"
            value={priceList}
            onChange={(e) => setPriceList(e.target.value)}
          >
            <option value="standard">Price List</option>
            <option value="premium">Premium (+20%)</option>
            <option value="wholesale">Wholesale (-10%)</option>
          </select>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left: image + wishlist + description */}
          <div className="col-span-5">
            <ProductGallery productId={resolvedProductId} drmProtected={pObj?.drm_protected} />
            <button
              className={`mt-4 w-full h-10 rounded-full border ${isWished?'border-red-300 text-red-600 bg-red-50':'border-neutral/30 bg-white text-neutral-700'} shadow-sm`}
              onClick={() => toggleWishlist(resolvedProductId)}
            >
              Add to wish list
            </button>
            <div className="mt-6 rounded-xl bg-white border border-neutral/200 shadow-sm p-4">
              <div className="font-medium mb-2">Product descriptions</div>
              <p className="text-sm text-neutral-600 leading-relaxed">
                This is a sample description for the product. Replace with real content during backend integration.
              </p>
              <button className="mt-2 text-sm text-neutral-700 underline">Read More</button>
            </div>
          </div>

          {/* Right: details */}
          <div className="col-span-7">
            <div className="rounded-2xl bg-white border border-neutral/200 shadow-sm p-6 space-y-6">
              <div>
                <div className="text-2xl font-semibold">{pObj?.name || pObj?.title || 'Product'}</div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="text-2xl font-semibold">₹ {displayPrice.toLocaleString()}</div>
                  <div className="text-neutral-500">( ₹{perUnitPrice.toLocaleString()} <PriceUnitBadge unit={pricingUnit} /> )</div>
                </div>
              </div>

              {/* Dates */}
              <div className="space-y-2">
                <div className="text-neutral-700">From / To</div>
                <DateRangePicker
                  start={fromDate}
                  end={toDate}
                  onChange={({ start, end }) => {
                    setFromDate(start ? start.toISOString().slice(0, 10) : '');
                    setToDate(end ? end.toISOString().slice(0, 10) : '');
                  }}
                />
              </div>

              {/* Qty + add to cart */}
              <div className="flex items-center gap-3">
                <QuantityStepper value={qty} onChange={setQty} />
                <button className="px-4 h-10 inline-flex items-center rounded-lg text-sm bg-black text-white hover:bg-neutral-800 shadow" onClick={handleAddToCart}>♡ Add to Cart</button>
              </div>

              <CouponBox value={coupon} onChange={setCoupon} onApply={()=>{}} />
              <div className="pt-2 text-neutral-600 text-sm">Preview total: ₹ {previewTotal.toLocaleString()}</div>

              {/* Terms */}
              <div>
                <div className="font-medium mb-1">Terms & condition</div>
                <ul className="text-sm text-neutral-600 list-disc ml-5 space-y-1">
                  <li>Sample term one.</li>
                  <li>Sample term two.</li>
                </ul>
              </div>

              {/* Share */}
              <div className="text-sm text-neutral-600">Share: <button className="underline">Copy link</button></div>
            </div>
          </div>
        </div>
        </>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;


