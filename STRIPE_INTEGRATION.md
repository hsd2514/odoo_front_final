# Stripe Payment Integration

This document outlines the complete Stripe payment integration implemented in the application.

## Overview

The application now includes a complete Stripe payment system with two payment flows:
1. **Stripe Elements** - Embedded card form for seamless checkout
2. **Stripe Checkout** - Hosted checkout page for maximum security

## API Endpoints

All payment endpoints are prefixed with `/payments/stripe` and require authentication.

### Base Configuration
- **GET** `/payments/stripe/config` - Get Stripe publishable key and configuration

### Elements Flow (Embedded)
- **POST** `/payments/stripe/payment-intent` - Create payment intent
- **POST** `/payments/stripe/confirm-payment` - Confirm payment (optional)

### Checkout Flow (Hosted)
- **POST** `/payments/stripe/checkout-session` - Create checkout session

### Status & Management
- **GET** `/payments/stripe/payment-status/{id}` - Check payment status
- **GET** `/payments/stripe/customer` - Get customer info and saved methods
- **POST** `/payments/stripe/refund` - Process refunds (admin only)

## Components

### 1. PaymentMethodSelector
Main component that allows users to choose between payment methods.

**Props:**
- `rentalId` - ID of the rental to pay for
- `amount` - Payment amount in rupees
- `onSuccess` - Callback for successful payment
- `onError` - Callback for payment errors
- `onLoading` - Callback for loading state changes

### 2. StripeElements
Embedded card form using Stripe Elements.

**Features:**
- Real-time card validation
- Secure card input
- Automatic payment processing
- Error handling and display

### 3. StripeCheckout
Hosted checkout redirect component.

**Features:**
- Redirects to Stripe's secure checkout page
- Handles success/cancel redirects
- Automatic session creation

## Pages

### PaymentSuccess
Displays after successful payment with:
- Payment confirmation
- Payment details
- Next steps information
- Navigation options

### PaymentCancel
Displays after cancelled payment with:
- Cancellation message
- Help information
- Return to cart option

## Installation

To use the Stripe integration, you'll need to install the required dependencies:

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

## Environment Variables

Ensure your backend is configured with:
- `STRIPE_SECRET_KEY` - Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET` - Webhook endpoint secret

## Usage Example

```jsx
import PaymentMethodSelector from './components/PaymentMethodSelector';

function CheckoutPage() {
  const handlePaymentSuccess = (paymentIntent) => {
    console.log('Payment successful:', paymentIntent);
    // Redirect to success page or update order status
  };

  const handlePaymentError = (error) => {
    console.error('Payment failed:', error);
    // Show error message to user
  };

  return (
    <PaymentMethodSelector
      rentalId={123}
      amount={99.99}
      onSuccess={handlePaymentSuccess}
      onError={handlePaymentError}
    />
  );
}
```

## Security Features

- **PCI Compliance** - Card data never touches your servers
- **Encryption** - All data transmitted over HTTPS
- **Authentication** - All endpoints require valid JWT tokens
- **Validation** - Server-side validation of all payment data

## Error Handling

The system handles various error scenarios:
- Network failures
- Invalid card details
- Insufficient funds
- Authentication errors
- Backend validation failures

## Testing

Use Stripe's test card numbers:
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

## Webhook Integration

For production, implement webhook endpoints to handle:
- Payment success/failure notifications
- Subscription updates
- Refund processing
- Dispute handling

## Currency & Amounts

- **Frontend**: Amounts displayed in INR (₹)
- **Backend**: Amounts stored in paise (smallest unit)
- **Conversion**: Use `paiseToRupees()` and `rupeesToPaise()` helpers

## Support

For Stripe-related issues:
1. Check Stripe Dashboard for payment status
2. Review server logs for backend errors
3. Verify API keys and configuration
4. Contact Stripe support for account issues

## Future Enhancements

- Saved payment methods
- Subscription billing
- Multiple currency support
- Advanced fraud detection
- Payment analytics dashboard
