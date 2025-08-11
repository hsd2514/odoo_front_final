// ProductListItem.jsx
// Professional list item design for products

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFirstAssetUrl } from '../services/catalog';
import { apiBaseURL } from '../services/http';
import { pricingColors, textColors } from '../utils/colors';
import PriceDisplay from './PriceDisplay';

const ProductListItem = ({ product, onAddToCart, onToggleWishlist, isWishlisted, price }) => {
  const productId = product?.id ?? product?.product_id ?? product?.uuid ?? product?.pk ?? product?.slug;
  const [thumb, setThumb] = useState(product.thumbnail || product.image_url || '');

  useEffect(() => {
    let mounted = true;
    if (!thumb && productId) {
      getFirstAssetUrl(productId).then((url) => { if (mounted && url) setThumb(url); }).catch(() => {}); 
    }
    return () => { mounted = false; };
  }, [productId, thumb]);
  
  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
      {/* Product Image */}
      <Link to={`/product/${productId}`} className="relative">
        <div 
          className="w-20 h-20 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 text-xl overflow-hidden"
          style={{ 
            backgroundImage: thumb ? `url(${thumb.startsWith('http') ? thumb : apiBaseURL + thumb})` : undefined, 
            backgroundSize: 'cover', 
            backgroundPosition: 'center' 
          }}
        >
          {!thumb && '🖼'}
        </div>
        
        {/* Wishlist Button */}
        <button
          className={`absolute -top-2 -right-2 w-7 h-7 rounded-full border transition-colors ${
            isWishlisted 
              ? 'border-red-300 bg-red-50 text-red-500 hover:bg-red-100' 
              : 'border-gray-300 bg-white text-gray-400 hover:bg-gray-50 hover:text-gray-600'
          } shadow-sm`}
          title="Wishlist"
          onClick={() => onToggleWishlist?.(product)}
        >
          ♥
        </button>
      </Link>
      
      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
          {product.category || 'General'}
        </div>
        <Link to={`/product/${productId}`} className="block">
          <h3 className="font-semibold text-gray-900 truncate hover:text-gray-700 transition-colors">
            {product?.name || product?.title || product?.product_name || `Product ${productId}`}
          </h3>
        </Link>
      </div>
      
      {/* Price */}
      <div className="mr-4">
        <PriceDisplay 
          price={price}
          originalPrice={product.originalPrice}
          size="medium"
          showDiscount={true}
        />
      </div>
      
      {/* Action Button */}
      <button
        className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:scale-105"
        style={{ 
          backgroundColor: pricingColors.primary,
          color: textColors.primary,
          boxShadow: '0 1px 3px rgba(249, 222, 102, 0.3)'
        }}
        onClick={() => onAddToCart?.(product)}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductListItem;


