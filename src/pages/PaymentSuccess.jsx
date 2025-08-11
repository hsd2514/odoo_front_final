// PaymentSuccess.jsx
// Payment success page after Stripe checkout

import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getPaymentStatus } from '../services/payments';

const PaymentSuccess = () => {
  const location = useLocation();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get payment details from URL params or session storage
    const urlParams = new URLSearchParams(location.search);
    const sessionId = urlParams.get('session_id');
    const paymentIntentId = urlParams.get('payment_intent');

    if (sessionId || paymentIntentId) {
      // Store the session/payment info for potential use
      if (sessionId) {
        sessionStorage.setItem('stripe_session_id', sessionId);
      }
      if (paymentIntentId) {
        sessionStorage.setItem('stripe_payment_intent_id', paymentIntentId);
      }
    }

    // If we have a payment intent ID, try to get the status
    if (paymentIntentId) {
      fetchPaymentStatus(paymentIntentId);
    } else {
      setLoading(false);
    }
  }, [location]);

  const fetchPaymentStatus = async (paymentIntentId) => {
    try {
      const status = await getPaymentStatus(paymentIntentId);
      setPaymentDetails(status);
    } catch (error) {
      console.error('Failed to fetch payment status:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your payment. Your rental has been confirmed.
          </p>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">₹{(paymentDetails.amount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600 capitalize">{paymentDetails.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-medium font-mono text-xs">{paymentDetails.payment_intent_id}</span>
                </div>
                {paymentDetails.rental_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rental ID:</span>
                    <span className="font-medium">#{paymentDetails.rental_id}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Your rental details are available in your account</li>
              <li>• Our team will contact you about pickup/delivery</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/home"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              to="/account/rentals"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View My Rentals
            </Link>
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                support@example.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
