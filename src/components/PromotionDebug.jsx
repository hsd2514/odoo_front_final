// PromotionDebug.jsx - Debug component to show promotion state
import React from 'react';
import { useShop } from '../context/ShopContext';

const PromotionDebug = () => {
  const { appliedPromo, getCartSummary } = useShop();
  const summary = getCartSummary();

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
      <h4 className="font-medium text-yellow-800 mb-2">Promotion Debug Info</h4>
      <div className="text-xs space-y-1">
        <div><strong>Applied Promo:</strong> {appliedPromo ? JSON.stringify(appliedPromo, null, 2) : 'None'}</div>
        <div><strong>Cart Summary:</strong> {JSON.stringify(summary, null, 2)}</div>
        <div><strong>Promo Valid:</strong> {appliedPromo?.valid ? 'Yes' : 'No'}</div>
        <div><strong>Discount Type:</strong> {appliedPromo?.discount_type || 'None'}</div>
        <div><strong>Discount Value:</strong> {appliedPromo?.discount_value || 'None'}</div>
      </div>
    </div>
  );
};

export default PromotionDebug;
