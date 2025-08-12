// OrderSummary.jsx - shared order summary block
import React from 'react';

export default function OrderSummary({ summary, promo }) {
  // Debug logging
  console.log('OrderSummary - summary:', summary);
  console.log('OrderSummary - promo:', promo);
  console.log('OrderSummary - promo.valid:', promo?.valid);
  console.log('OrderSummary - promo.discount_type:', promo?.discount_type);
  console.log('OrderSummary - promo.discount_value:', promo?.discount_value);
  
  const subtotal = summary?.subtotal || 0;
  const delivery = summary?.delivery || summary?.shipping || 0;
  const taxes = summary?.taxes || summary?.tax || 0;
  const totalBase = summary?.total || subtotal + delivery + taxes;

  // Calculate discount based on promotion
  let discount = 0;
  if (promo && promo.valid) {
    if (promo.discount_type === 'percentage') {
      discount = totalBase * (promo.discount_value / 100);
    } else if (promo.discount_type === 'fixed') {
      discount = promo.discount_value;
    }
  }
  
  const total = Math.max(0, totalBase - discount);
  
  // Debug logging
  console.log('OrderSummary - calculated discount:', discount);
  console.log('OrderSummary - calculated total:', total);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Delivery</span>
          <span className="font-medium text-gray-900">₹{delivery.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Taxes</span>
          <span className="font-medium text-gray-900">₹{taxes.toFixed(2)}</span>
        </div>
        {promo && promo.valid && (
          <div className="flex items-center justify-between text-green-600 border-t border-gray-200 pt-3">
            <span>Promotion ({promo.code})</span>
            <span className="font-medium">
              {promo.discount_type === 'percentage'
                ? `-${promo.discount_value}%`
                : `-₹${promo.discount_value}`}
            </span>
          </div>
        )}
        <div className="border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between font-semibold text-lg">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}


