// StripeElements.jsx
// Secure card input component using Stripe Elements

import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripeConfig, createPaymentIntent, confirmPayment } from '../services/payments';

// Stripe Elements styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

// Card form component
const CheckoutForm = ({ rentalId, amount, onSuccess, onError, onLoading }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState('');
  const [globalError, setGlobalError] = useState(null);

  useEffect(() => {
    if (rentalId && amount) {
      initializePayment();
    }
  }, [rentalId, amount]);

  const initializePayment = async () => {
    try {
      setLoading(true);
      onLoading?.(true);
      
      const paymentIntent = await createPaymentIntent(rentalId);
      setClientSecret(paymentIntent.client_secret);
      
      setLoading(false);
      onLoading?.(false);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to initialize payment');
      setLoading(false);
      onLoading?.(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);
    setError(null);
    onLoading?.(true);

    try {
      // Confirm the payment with Stripe
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        onError?.(stripeError.message);
      } else if (paymentIntent.status === 'succeeded') {
        // Optionally confirm with backend
        try {
          await confirmPayment(paymentIntent.id);
        } catch (confirmError) {
          console.warn('Backend confirmation failed:', confirmError);
          // Payment succeeded on Stripe side, so we can still proceed
        }
        
        onSuccess?.(paymentIntent);
      }
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      onError?.(err.message);
    } finally {
      setLoading(false);
      onLoading?.(false);
    }
  };

  if (loading && !clientSecret) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Initializing payment...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Card Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Details
        </label>
        <div className="border border-gray-300 rounded-lg p-3 bg-white">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${
          loading || !stripe
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Processing...' : `Pay ₹${amount}`}
      </button>

      {/* Security Notice */}
      <div className="text-center text-xs text-gray-500">
        🔒 Your payment information is secure and encrypted
      </div>
    </form>
  );
};

// Main Stripe Elements wrapper
const StripeElements = ({ rentalId, amount, onSuccess, onError, onLoading }) => {
  const [stripePromise, setStripePromise] = useState(null);
  const [config, setConfig] = useState(null);

  useEffect(() => {
    const initializeStripe = async () => {
      try {
        const stripeConfig = await getStripeConfig();
        setConfig(stripeConfig);
        
        const stripe = await loadStripe(stripeConfig.publishable_key);
        setStripePromise(stripe);
      } catch (error) {
        console.error('Failed to load Stripe:', error);
        setGlobalError('Failed to load payment system');
      }
    };

    initializeStripe();
  }, []);

  if (!stripePromise || !config) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading payment system...</p>
        {globalError && <p className="mt-2 text-red-600 text-sm">{globalError}</p>}
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        rentalId={rentalId}
        amount={amount}
        onSuccess={onSuccess}
        onError={onError}
        onLoading={onLoading}
      />
    </Elements>
  );
};

export default StripeElements;
