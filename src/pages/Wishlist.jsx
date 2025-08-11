// Wishlist.jsx
import React from 'react';
import { useShop } from '../context/ShopContext';

const Wishlist = () => {
  const { wishlist, products, toggleWishlist, addToCart, priceMultiplier } = useShop();
  const wished = products.filter((p) => wishlist.has(p.id)).map((p) => ({ ...p, displayPrice: p.price * priceMultiplier }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Wishlist</h1>
      {wished.length === 0 ? (
        <div className="text-neutral-500">No items in wishlist.</div>
      ) : (
        <div className="space-y-3">
          {wished.map((p) => (
            <div key={p.id} className="rounded-xl border border-neutral/200 bg-white shadow-sm p-4 flex items-center gap-4">
              <div className="w-16 h-16 rounded-md bg-neutral/100 grid place-items-center text-neutral/400 text-xl">🧱</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{p.name}</div>
                <div className="text-neutral-700">₹{p.displayPrice.toFixed(2)}</div>
              </div>
              <button className="px-3 h-9 rounded-lg border border-neutral/300" onClick={() => toggleWishlist(p.id)}>Remove</button>
              <button className="px-3 h-9 rounded-lg bg-black text-white" onClick={() => addToCart(p.id)}>Add to Cart</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;


