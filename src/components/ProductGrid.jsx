// ProductGrid.jsx
// Professional grid layout for product cards

import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ 
  products, 
  onAddToCart, 
  onToggleWishlist, 
  wishlist = [], 
  priceMultiplier = 1,
  className = '' 
}) => {
  const getPrice = (product) => {
    try {
      const basePrice = Number(product?.price ?? product?.unit_price ?? product?.base_price ?? 0);
      return basePrice * priceMultiplier;
    } catch (error) {
      console.warn('Error calculating price for product:', product, error);
      return 0;
    }
  };

  const isWishlisted = (product) => {
    try {
      const productId = product?.id ?? product?.product_id ?? product?.uuid ?? product?.pk ?? product?.slug;
      
      // Handle both Set and Array types for wishlist
      if (wishlist instanceof Set) {
        return wishlist.has(productId);
      } else if (Array.isArray(wishlist)) {
        return wishlist.some(item => {
          const itemId = item?.id ?? item?.product_id ?? item?.uuid ?? item?.pk ?? item?.slug;
          return String(itemId) === String(productId);
        });
      }
      
      return false;
    } catch (error) {
      console.warn('Error checking wishlist status for product:', product, error);
      return false;
    }
  };

  // If no products, show a message
  if (!products || products.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-gray-500 text-lg mb-2">No products found</div>
        <div className="text-gray-400 text-sm">
          {products === null ? 'Loading products...' : 'Try adjusting your search or filters'}
        </div>
      </div>
    );
  }

  try {
    return (
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 ${className}`}>
        {products.map((product, index) => {
          try {
            const productId = product?.id ?? product?.product_id ?? product?.uuid ?? product?.pk ?? product?.slug;
            const price = getPrice(product);
            
            return (
              <ProductCard
                key={productId || index}
                product={product}
                price={price}
                onAddToCart={onAddToCart}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={isWishlisted(product)}
              />
            );
          } catch (error) {
            console.error('Error rendering product card:', product, error);
            return (
              <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <div className="text-red-600 text-sm">Error loading product</div>
              </div>
            );
          }
        })}
      </div>
    );
  } catch (error) {
    console.error('Error in ProductGrid:', error);
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-red-600 text-lg mb-2">An error occurred while loading products</div>
        <div className="text-gray-400 text-sm">Please try refreshing the page</div>
      </div>
    );
  }
};

export default ProductGrid;
