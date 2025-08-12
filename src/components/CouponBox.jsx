// CouponBox.jsx
// Enhanced coupon component with promotions integration

import React, { useState, useEffect } from 'react';
import { getPromotions, applyPromotion } from '../services/engagement';
import { pricingColors, textColors } from '../utils/colors';

const CouponBox = ({ value, onChange, onApply, cartTotal = 0, className = '', appliedPromo = null }) => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    try {
      const availablePromos = await getPromotions();
      setPromotions(availablePromos);
    } catch (error) {
      console.error('Failed to load promotions:', error);
    }
  };

  const handleApplyPromotion = async () => {
    if (!value.trim()) {
      setError('Please enter a promotion code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('CouponBox - Applying promotion:', value.trim(), 'with cart total:', cartTotal);
      const result = await applyPromotion(value.trim(), cartTotal);
      console.log('CouponBox - Promotion result:', result);
      
      if (result) {
        onApply?.(result);
        setError('');
      } else {
        setError('Invalid promotion code');
      }
    } catch (error) {
      console.error('CouponBox - Promotion error:', error);
      setError('Failed to apply promotion');
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePromotion = () => {
    setValue('');
    onApply?.(null);
  };

  const setValue = (newValue) => {
    onChange?.(newValue);
    if (appliedPromo) {
      onApply?.(null);
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">Promotions & Coupons</h3>
        {promotions.length > 0 && (
          <span className="text-xs text-gray-500">
            {promotions.length} available
          </span>
        )}
      </div>

      {/* Available Promotions */}
      {promotions.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs text-gray-600 font-medium">Available Offers:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {promotions.slice(0, 4).map((promo) => (
              <div 
                key={promo.id || promo.code}
                className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-xs"
              >
                <div className="font-medium text-gray-900">{promo.code}</div>
                <div className="text-gray-600">{promo.description}</div>
                {promo.discount_type === 'percentage' && (
                  <div className="text-green-600 font-medium">
                    {promo.discount_value}% off
                  </div>
                )}
                {promo.discount_type === 'fixed' && (
                  <div className="text-green-600 font-medium">
                    ₹{promo.discount_value} off
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Coupon Input */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input 
            value={value} 
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter promotion code" 
            className="flex-1 h-10 px-3 rounded-lg border border-gray-300 bg-white text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
            disabled={loading}
          />
          {!appliedPromo ? (
            <button 
              onClick={handleApplyPromotion}
              disabled={loading || !value.trim()}
              className="px-4 h-10 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: pricingColors.primary,
                color: textColors.primary
              }}
            >
              {loading ? 'Applying...' : 'Apply'}
            </button>
          ) : (
            <button 
              onClick={handleRemovePromotion}
              className="px-4 h-10 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              Remove
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-xs text-red-600 flex items-center gap-1">
            <span className="w-1 h-1 bg-red-500 rounded-full"></span>
            {error}
          </div>
        )}

        {/* Applied Promotion */}
        {appliedPromo && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-green-800">
                  {appliedPromo.code} Applied!
                </div>
                <div className="text-sm text-green-600">
                  {appliedPromo.description}
                </div>
              </div>
              <div className="text-right">
                {appliedPromo.discount_type === 'percentage' && (
                  <div className="text-lg font-bold text-green-800">
                    -{appliedPromo.discount_value}%
                  </div>
                )}
                {appliedPromo.discount_type === 'fixed' && (
                  <div className="text-lg font-bold text-green-800">
                    -₹{appliedPromo.discount_value}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CouponBox;


