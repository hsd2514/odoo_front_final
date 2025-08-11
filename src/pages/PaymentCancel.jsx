// PaymentCancel.jsx
// Payment cancellation page after Stripe checkout

import React from 'react';
import { Link } from 'react-router-dom';

const PaymentCancel = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Cancel Icon */}
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          {/* Cancel Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Cancelled</h1>
          <p className="text-lg text-gray-600 mb-8">
            Your payment was cancelled. No charges were made to your account.
          </p>

          {/* What Happened */}
          <div className="bg-yellow-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-yellow-900 mb-2">What Happened?</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• You cancelled the payment process</li>
              <li>• No money was charged to your account</li>
              <li>• Your cart items are still available</li>
              <li>• You can try the payment again anytime</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/cart"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Return to Cart
            </Link>
            <Link
              to="/home"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-4">
              If you experienced any issues or have questions about the payment process:
            </p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>• Check that your card details are correct</p>
              <p>• Ensure you have sufficient funds</p>
              <p>• Try a different payment method</p>
              <p>• Contact our support team for assistance</p>
            </div>
            <div className="mt-4">
              <a 
                href="mailto:support@example.com" 
                className="text-blue-600 hover:underline text-sm"
              >
                support@example.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
