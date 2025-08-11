// ProductCard.jsx
// Professional, compact product card design

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFirstAssetUrl } from '../services/catalog';
import { apiBaseURL } from '../services/http';
import { pricingColors, textColors, shadowColors } from '../utils/colors';
import PriceDisplay from './PriceDisplay';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, isWishlisted, price }) => {
  const productId = product?.id ?? product?.product_id ?? product?.uuid ?? product?.pk ?? product?.slug;
  if (!productId) {
    console.warn('Product missing id for card rendering', product);
  }
  const [thumb, setThumb] = useState(product.thumbnail || product.image_url || '');

  useEffect(() => {
    let mounted = true;
    if (!thumb && productId) {
      getFirstAssetUrl(productId).then((url) => {
        if (mounted && url) setThumb(url);
      }).catch(() => {});
    }
    return () => { mounted = false; };
  }, [productId, thumb]);
  
  return (
    <div className="group bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Link to={`/product/${productId}`} className="block w-full h-full">
          <div 
            className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 text-2xl transition-transform duration-300 group-hover:scale-105"
            style={{ 
              backgroundImage: thumb ? `url(${thumb.startsWith('http') ? thumb : apiBaseURL + thumb})` : undefined, 
              backgroundSize: 'cover', 
              backgroundPosition: 'center' 
            }}
          >
            {!thumb && '🖼'}
          </div>
        </Link>
        
        {/* Wishlist Button */}
        <button
          className={`absolute top-2 right-2 w-7 h-7 rounded-full border transition-all duration-200 flex items-center justify-center text-sm ${
            isWishlisted 
              ? 'border-red-300 bg-red-50 text-red-500 hover:bg-red-100' 
              : 'border-gray-200 bg-white/90 text-gray-400 hover:bg-white hover:text-gray-600 hover:border-gray-300'
          }`}
          title="Wishlist"
          onClick={() => onToggleWishlist?.(product)}
        >
          ♥
        </button>
        
        {/* Badge */}
        {product.badge && (
          <div className="absolute top-2 left-2">
            <span className={`px-2 py-1 rounded-md text-xs font-medium ${
              product.badge === 'best_seller' 
                ? 'bg-blue-50 text-blue-600 border border-blue-200' 
                : 'bg-red-50 text-red-600 border border-red-200'
            }`}>
              {product.badge === 'best_seller' ? 'Best-Seller' : 'Z Rated'}
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-3 space-y-2">
        {/* Product Title */}
        <Link to={`/product/${productId}`} className="block">
          <h3 className="font-medium text-sm text-gray-900 leading-tight line-clamp-2 hover:text-gray-700 transition-colors">
            {product?.name || product?.title || product?.product_name || `Product ${productId}`}
          </h3>
        </Link>
        
        {/* Pricing */}
        <div className="flex items-center justify-between">
          <PriceDisplay 
            price={price}
            originalPrice={product.originalPrice}
            size="medium"
            showDiscount={true}
          />
        </div>
        
        {/* Action Row */}
        <div className="flex items-center justify-between pt-1">
          <button
            className="px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-200 hover:scale-105 flex-1 mr-2"
            style={{ 
              backgroundColor: pricingColors.primary,
              color: textColors.primary,
              boxShadow: `0 1px 3px ${shadowColors.colored}`
            }}
            onClick={() => onAddToCart?.(product)}
          >
            Add to Cart
          </button>
          
          <span className="text-xs text-gray-500">16 Aug</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;


