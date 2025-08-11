// PaymentMethodSelector.jsx
// Component to select between different payment methods

import React, { useState } from 'react';
import StripeElements from './StripeElements';
import StripeCheckout from './StripeCheckout';

const PaymentMethodSelector = ({ rentalId, amount, onSuccess, onError, onLoading }) => {
  const [selectedMethod, setSelectedMethod] = useState('elements'); // 'elements' or 'checkout'

  const paymentMethods = [
    {
      id: 'elements',
      name: 'Card Payment',
      description: 'Enter your card details securely',
      icon: '💳',
      component: StripeElements
    },
    {
      id: 'checkout',
      name: 'Stripe Checkout',
      description: 'Redirect to Stripe\'s secure checkout page',
      icon: '🔒',
      component: StripeCheckout
    }
  ];

  const SelectedComponent = paymentMethods.find(m => m.id === selectedMethod)?.component;

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Payment Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{method.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{method.name}</h4>
                  <p className="text-sm text-gray-600">{method.description}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === method.id && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Payment Method */}
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-xl">
            {paymentMethods.find(m => m.id === selectedMethod)?.icon}
          </div>
          <h4 className="font-semibold text-gray-900">
            {paymentMethods.find(m => m.id === selectedMethod)?.name}
          </h4>
        </div>
        
        {SelectedComponent && (
          <SelectedComponent
            rentalId={rentalId}
            amount={amount}
            onSuccess={onSuccess}
            onError={onError}
            onLoading={onLoading}
          />
        )}
      </div>

      {/* Security Notice */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="text-blue-600 text-lg">🔒</div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Secure Payment Processing</h4>
            <p className="text-sm text-gray-600">
              All payments are processed securely through Stripe. Your card information is encrypted 
              and never stored on our servers. We use industry-standard SSL encryption to protect 
              your data during transmission.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodSelector;
