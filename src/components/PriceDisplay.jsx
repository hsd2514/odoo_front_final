// PriceDisplay.jsx
// Professional pricing display component with consistent styling

import React from 'react';
import { pricingColors } from '../utils/colors';

const PriceDisplay = ({ 
  price, 
  originalPrice, 
  currency = '₹', 
  size = 'medium', 
  showDiscount = true,
  className = '' 
}) => {
  // Ensure price values are valid numbers
  const safePrice = Number(price) || 0;
  const safeOriginalPrice = Number(originalPrice) || 0;
  
  const hasDiscount = safeOriginalPrice && safeOriginalPrice > safePrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((safeOriginalPrice - safePrice) / safeOriginalPrice) * 100) 
    : 0;

  const sizeClasses = {
    xs: 'text-xs',
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
    xlarge: 'text-xl'
  };

  const fontWeight = {
    xs: 'font-medium',
    small: 'font-medium',
    medium: 'font-semibold',
    large: 'font-semibold',
    xlarge: 'font-bold'
  };

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {/* Current Price */}
      <div 
        className={`${sizeClasses[size]} ${fontWeight[size]}`}
        style={{ color: pricingColors.primary }}
      >
        {currency} {safePrice.toLocaleString()}
      </div>

      {/* Original Price (if discounted) */}
      {hasDiscount && showDiscount && (
        <div 
          className={`${sizeClasses[size === 'xs' ? 'xs' : 'xs']} line-through opacity-60`}
          style={{ color: pricingColors.neutral }}
        >
          {currency} {safeOriginalPrice.toLocaleString()}
        </div>
      )}

      {/* Discount Badge */}
      {hasDiscount && showDiscount && (
        <div 
          className="text-xs px-1.5 py-0.5 rounded-sm font-medium"
          style={{ 
            backgroundColor: pricingColors.secondary + '15', 
            color: pricingColors.secondary,
            border: `1px solid ${pricingColors.secondary}30`
          }}
        >
          -{discountPercentage}%
        </div>
      )}
    </div>
  );
};

export default PriceDisplay;
