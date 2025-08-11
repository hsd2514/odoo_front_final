// payments.js - Stripe Payment API integration
import http from './http';
import { PAYMENTS_STRIPE_BASE as PAYMENTS_BASE } from './endpoints';

// Get Stripe configuration (publishable key, currency, country)
export async function getStripeConfig() {
  try {
    const { data } = await http.get(`${PAYMENTS_BASE}/config`);
    return data;
  } catch (error) {
    console.error('Failed to get Stripe config:', error);
    throw error;
  }
}

// Create PaymentIntent for Elements flow
export async function createPaymentIntent(rentalId, options = {}) {
  try {
    const { data } = await http.post(`${PAYMENTS_BASE}/payment-intent`, {
      rental_id: rentalId,
      payment_method_id: options.paymentMethodId,
      save_payment_method: options.savePaymentMethod || false
    });
    return data;
  } catch (error) {
    console.error('Failed to create payment intent:', error);
    throw error;
  }
}

// Confirm payment via backend (optional)
export async function confirmPayment(paymentIntentId) {
  try {
    const { data } = await http.post(`${PAYMENTS_BASE}/confirm-payment`, {
      payment_intent_id: paymentIntentId
    });
    return data;
  } catch (error) {
    console.error('Failed to confirm payment:', error);
    throw error;
  }
}

// Create Checkout Session for hosted checkout
export async function createCheckoutSession(rentalId, options = {}) {
  try {
    const { data } = await http.post(`${PAYMENTS_BASE}/checkout-session`, {
      rental_id: rentalId,
      success_url: options.successUrl,
      cancel_url: options.cancelUrl
    });
    return data;
  } catch (error) {
    console.error('Failed to create checkout session:', error);
    throw error;
  }
}

// Check payment status
export async function getPaymentStatus(paymentIntentId) {
  try {
    const { data } = await http.get(`${PAYMENTS_BASE}/payment-status/${paymentIntentId}`);
    return data;
  } catch (error) {
    console.error('Failed to get payment status:', error);
    throw error;
  }
}

// Get customer information and saved payment methods
export async function getCustomerInfo() {
  try {
    const { data } = await http.get(`${PAYMENTS_BASE}/customer`);
    return data;
  } catch (error) {
    console.error('Failed to get customer info:', error);
    throw error;
  }
}

// Process refund (admin/staff only)
export async function processRefund(paymentIntentId, options = {}) {
  try {
    const { data } = await http.post(`${PAYMENTS_BASE}/refund`, {
      payment_intent_id: paymentIntentId,
      amount: options.amount,
      reason: options.reason
    });
    return data;
  } catch (error) {
    console.error('Failed to process refund:', error);
    throw error;
  }
}

// Helper function to convert paise to rupees
export function paiseToRupees(paise) {
  return (paise / 100).toFixed(2);
}

// Helper function to convert rupees to paise
export function rupeesToPaise(rupees) {
  return Math.round(rupees * 100);
}
