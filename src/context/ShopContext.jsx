// ShopContext.jsx
import React, { useContext, useMemo, useState } from 'react';
import ShopContext from './contextBase';


const initialWishlist = new Set();

export default function ShopProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart_items');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }); // {productId, qty, startDate?, endDate?, unitPrice?, pricingUnit?, title?}
  const [wishlist, setWishlist] = useState(initialWishlist);
  const [priceList, setPriceList] = useState('standard'); // standard | premium | wholesale
  const [selectedCategory, setSelectedCategory] = useState('');
  const [products, setProducts] = useState([]);
  const [cartCoupon, setCartCoupon] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(() => {
    try {
      const raw = localStorage.getItem('applied_promo');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  
  // Debug logging for promotion state changes
  React.useEffect(() => {
    console.log('ShopContext - appliedPromo changed:', appliedPromo);
  }, [appliedPromo]);
  
  // Persist promotion to localStorage
  React.useEffect(() => {
    try { 
      if (appliedPromo) {
        localStorage.setItem('applied_promo', JSON.stringify(appliedPromo));
      } else {
        localStorage.removeItem('applied_promo');
      }
    } catch {
      // ignore persistence errors
    }
  }, [appliedPromo]);

  const priceMultiplier = useMemo(() => {
    switch (priceList) {
      case 'premium':
        return 1.2;
      case 'wholesale':
        return 0.9;
      default:
        return 1.0;
    }
  }, [priceList]);

  const addToCart = (productId, options = {}) => {
    const { qty = 1, startDate, endDate, unitPrice, pricingUnit, title, coupon } = options;
    setCartItems((prev) => {
      const matchIndex = prev.findIndex(
        (it) => it.productId === productId && it.startDate === startDate && it.endDate === endDate && (it.pricingUnit || '') === (pricingUnit || '')
      );
      if (matchIndex >= 0) {
        const next = [...prev];
        next[matchIndex] = { ...next[matchIndex], qty: next[matchIndex].qty + qty };
        return next;
      }
      return [...prev, { productId, qty, startDate, endDate, unitPrice, pricingUnit, title, coupon }];
    });
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'info', message: 'Item added to cart' } }));
    }
  };

  const updateCartQty = (productId, startDate, endDate, delta) => {
    setCartItems((prev) => {
      const next = prev
        .map((it) => (
          it.productId === productId && it.startDate === startDate && it.endDate === endDate
            ? { ...it, qty: Math.max(0, it.qty + delta) }
            : it
        ))
        .filter((it) => it.qty > 0);
      return next;
    });
  };

  const removeFromCart = (productId, startDate, endDate) => {
    setCartItems((prev) => prev.filter((it) => !(it.productId === productId && it.startDate === startDate && it.endDate === endDate)));
  };

  const updateCartDates = (productId, oldStart, oldEnd, newStart, newEnd) => {
    setCartItems((prev) => prev.map((it) => (
      it.productId === productId && it.startDate === oldStart && it.endDate === oldEnd
        ? { ...it, startDate: newStart, endDate: newEnd }
        : it
    )));
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  };

  const cartCount = useMemo(() => cartItems.reduce((sum, it) => sum + it.qty, 0), [cartItems]);

  // Persist cart to localStorage
  React.useEffect(() => {
    try { localStorage.setItem('cart_items', JSON.stringify(cartItems)); } catch {
      // ignore persistence errors
    }
  }, [cartItems]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const value = {
    products,
    setProducts,
    priceList,
    setPriceList,
    priceMultiplier,
    cartItems,
    cartCount,
    addToCart,
    updateCartQty,
    removeFromCart,
    updateCartDates,
    wishlist,
    toggleWishlist,
    categories,
    selectedCategory,
    setSelectedCategory,
    cartCoupon,
    setCartCoupon,
    appliedPromo,
    setAppliedPromo,
    clearCart: () => {
      setCartItems([]);
      setAppliedPromo(null);
    },
    // compute totals based on current products and cart
    getCartSummary: () => {
      const subtotal = cartItems.reduce((sum, it) => {
        const p = products.find((x) => String(x?.id ?? x?.product_id ?? x?.uuid ?? x?.pk ?? x?.slug) === String(it.productId)) || {};
        const unit = Number(it?.unitPrice ?? p?.price ?? p?.unit_price ?? p?.base_price ?? 0) * priceMultiplier;
        const pricingUnit = it?.pricingUnit || p?.pricing_unit || 'day';
        const fromTs = it.startDate ? new Date(it.startDate) : undefined;
        const toTs = it.endDate ? new Date(it.endDate) : undefined;
        let d = 1;
        if (fromTs && toTs) {
          // inline minimal duration calc to avoid async import
          const hour = 1000 * 60 * 60;
          const day = hour * 24;
          const week = day * 7;
          const month = day * 30;
          const diff = Math.max(0, toTs.getTime() - fromTs.getTime());
          const u = (pricingUnit || 'day').toLowerCase();
          if (u.startsWith('hour')) d = Math.ceil(diff / hour);
          else if (u.startsWith('week')) d = Math.ceil(diff / week);
          else if (u.startsWith('month')) d = Math.ceil(diff / month);
          else d = Math.ceil(diff / day);
        }
        return sum + unit * d * it.qty;
      }, 0);
      const delivery = 0;
      const taxes = 0;
      const total = subtotal + delivery + taxes;
      return { subtotal, delivery, taxes, total };
    },
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useShop = () => useContext(ShopContext);


