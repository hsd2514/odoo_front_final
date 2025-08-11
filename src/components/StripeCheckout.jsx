// StripeCheckout.jsx
// Hosted Stripe Checkout component

import React, { useState } from 'react';
import { createCheckoutSession } from '../services/payments';

const StripeCheckout = ({ rentalId, amount, onLoading, onError }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);
      onLoading?.(true);

      const session = await createCheckoutSession(rentalId, {
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`
      });

      // Redirect to Stripe Checkout
      window.location.href = session.checkout_url;
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      const errorMessage = error.response?.data?.detail || 'Failed to start checkout';
      onError?.(errorMessage);
      setLoading(false);
      onLoading?.(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {loading ? 'Preparing Checkout...' : `Checkout with Stripe - ₹${amount}`}
      </button>

      {/* Info */}
      <div className="text-center text-sm text-gray-600">
        <p>You'll be redirected to Stripe's secure checkout page</p>
        <p className="mt-1">🔒 Secure payment processing by Stripe</p>
      </div>
    </div>
  );
};

export default StripeCheckout;
