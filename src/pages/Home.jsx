// Home.jsx
import React, { useEffect, useMemo, useState } from 'react';
import ProductGrid from '../components/ProductGrid';
import ProductListItem from '../components/ProductListItem';
import PriceListSelector from '../components/PriceListSelector';
import { resolveProductId } from '../utils/product';
import { useShop } from '../context/ShopContext';
import { listCategories, listCatalogProducts } from '../services/catalog';

const Home = () => {
  const [view, setView] = useState('grid'); // 'grid' | 'list'
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('name_asc');
  const [, setCategories] = useState([]);
  const [, setLoading] = useState(false);
  const [, setError] = useState('');
  const { products, addToCart, wishlist, toggleWishlist, priceMultiplier, priceList, setPriceList, setProducts, selectedCategory } = useShop();

  const filtered = useMemo(() => {
    const q = (search || '').trim().toLowerCase();
    let out = (products || [])
      .map((p) => {
        const name = String(p?.name ?? p?.title ?? p?.product_name ?? '');
        const categoryStr = String(p?.category?.name ?? p?.category ?? '');
        const rawPrice = Number(p?.price ?? p?.unit_price ?? p?.base_price ?? 0);
        return { ...p, _name: name, _category: categoryStr, displayPrice: rawPrice * priceMultiplier };
      })
      .filter((p) => (q ? p._name.toLowerCase().includes(q) || p._category.toLowerCase().includes(q) : true));

    switch (sort) {
      case 'price_asc':
        out = out.sort((a, b) => (a.displayPrice || 0) - (b.displayPrice || 0));
        break;
      case 'price_desc':
        out = out.sort((a, b) => (b.displayPrice || 0) - (a.displayPrice || 0));
        break;
      default:
        out = out.sort((a, b) => (a._name || '').localeCompare(b._name || ''));
    }

    return out;
  }, [products, search, sort, priceMultiplier]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cats = await listCategories();
        if (mounted) setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories', err);
      }
    })();
    return () => { mounted = false; };
  }, [setProducts]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const items = await listCatalogProducts({ category_id: selectedCategory || undefined, q: search || undefined, active: true });
        if (mounted) setProducts(items);
      } catch (err) {
        console.error('Failed to load products:', err);
        if (mounted) {
          setError(err?.message || 'Failed to load products');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [selectedCategory, search, setProducts]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Discover our collection of quality products</p>
        </div>

        {/* Filters + toolbar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Price List Selector */}
            <div className="lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Price List</label>
              <PriceListSelector value={priceList} onChange={setPriceList} />
            </div>

            {/* Search Input */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                className="w-full h-10 rounded-lg bg-white border border-gray-300 px-3 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            {/* Sort Selector */}
            <div className="lg:w-48">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                className="w-full h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="name_asc">Name A-Z</option>
                <option value="price_asc">Price Low-High</option>
                <option value="price_desc">Price High-Low</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="lg:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">View</label>
              <div className="flex items-center gap-1">
                <button
                  className={`w-10 h-10 rounded-lg border transition-colors ${
                    view === 'grid' 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setView('grid')}
                  title="Grid view"
                >
                  ▦
                </button>
                <button
                  className={`w-10 h-10 rounded-lg border transition-colors ${
                    view === 'list' 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => setView('list')}
                  title="List view"
                >
                  ≣
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          {/* Products */}
          <main>
            {view === 'grid' ? (
              <ProductGrid
                products={filtered}
                onAddToCart={(product) => {
                  const productId = resolveProductId(product);
                  if (productId) {
                    addToCart(productId, {
                      title: product?.name || product?.title || product?.product_name,
                      unitPrice: product?.price || product?.unit_price || product?.base_price,
                      pricingUnit: product?.pricing_unit
                    });
                  }
                }}
                onToggleWishlist={(product) => {
                  const productId = product?.id ?? product?.product_id ?? product?.uuid ?? product?.pk ?? product?.slug;
                  if (productId) {
                    toggleWishlist(productId);
                  }
                }}
                wishlist={wishlist}
                priceMultiplier={priceMultiplier}
                className="mb-6"
              />
            ) : (
              <div className="space-y-3 mb-6">
                {filtered.map((p, idx) => {
                  const productId = resolveProductId(p);
                  return (
                    <ProductListItem
                      key={String(productId ?? idx)}
                      product={p}
                      price={p.displayPrice}
                      isWishlisted={wishlist.has(productId)}
                      onToggleWishlist={() => productId && toggleWishlist(productId)}
                      onAddToCart={() => productId && addToCart(productId, {
                        title: p?.name || p?.title || p?.product_name,
                        unitPrice: p?.price || p?.unit_price || p?.base_price,
                        pricingUnit: p?.pricing_unit
                      })}
                    />
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <button className="px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
                &lt;
              </button>
              {[1,2,3,4].map(n => (
                <button 
                  key={n} 
                  className={`w-10 h-10 rounded-lg border transition-colors ${
                    n === 1 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {n}
                </button>
              ))}
              <span className="px-3 py-2">… 10</span>
              <button className="px-3 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 transition-colors">
                &gt;
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;

