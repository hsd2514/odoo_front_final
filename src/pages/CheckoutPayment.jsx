// CheckoutPayment.jsx (mock)
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import http from '../services/http';
import { validateCardNumber, validateExpiry, validateCVV } from '../utils/validation';
import { earnLoyaltyPoints, createNotification } from '../services/engagement';
import CouponBox from '../components/CouponBox';
import { Input } from '../components/FormControls';


const CheckoutPayment = () => {
  const navigate = useNavigate();
  const { cartItems, getCartSummary, clearCart } = useShop();
  const [form, setForm] = useState({ name:'', number:'', expiry:'', cvv:'', save:false });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Cardholder name is required';
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
        break;
      case 'number':
        if (!value) error = 'Card number is required';
        else if (!validateCardNumber(value)) error = 'Please enter a valid card number';
        break;
      case 'expiry':
        if (!value) error = 'Expiry date is required';
        else if (!validateExpiry(value)) error = 'Please enter a valid expiry date (MM/YY)';
        break;
      case 'cvv':
        if (!value) error = 'CVV is required';
        else if (!validateCVV(value)) error = 'Please enter a valid CVV';
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const validateForm = () => {
    const errors = {};
    Object.keys(form).forEach(key => {
      if (key !== 'save') { // Skip checkbox validation
        const error = validateField(key, form[key]);
        if (error) errors[key] = error;
      }
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePromotionApply = (promotion) => {
    setAppliedPromo(promotion);
  };

  const calculateFinalTotal = () => {
    const summary = getCartSummary();
    let finalTotal = summary.total;
    
    if (appliedPromo) {
      if (appliedPromo.discount_type === 'percentage') {
        finalTotal = finalTotal * (1 - appliedPromo.discount_value / 100);
      } else if (appliedPromo.discount_type === 'fixed') {
        finalTotal = Math.max(0, finalTotal - appliedPromo.discount_value);
      }
    }
    
    return finalTotal;
  };

  const onPay = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Validate that all cart items have valid dates
    const itemsWithoutDates = cartItems.filter(item => !item.startDate || !item.endDate);
    if (itemsWithoutDates.length > 0) {
      window.dispatchEvent(new CustomEvent('toast', { 
        detail: { type: 'error', message: 'All cart items must have start and end dates' } 
      }));
      return;
    }
    
    // Validate that all date ranges are valid
    for (const item of cartItems) {
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);
      if (end <= start) {
        window.dispatchEvent(new CustomEvent('toast', { 
          detail: { type: 'error', message: `Invalid date range for item: ${item.title || item.productId}` } 
        }));
        return;
      }
    }
    
    setLoading(true);
    try {
      // 1) Create order - Convert dates to Unix timestamps
      const startDate = cartItems.find(i => i.startDate)?.startDate;
      const endDate = cartItems.find(i => i.endDate)?.endDate;
      
      if (!startDate || !endDate) {
        throw new Error('Start and end dates are required for all cart items');
      }
      
      // Convert to Unix timestamps (seconds since epoch)
      const startTs = Math.floor(new Date(startDate).getTime() / 1000);
      const endTs = Math.floor(new Date(endDate).getTime() / 1000);
      
      // Validate that end timestamp is after start timestamp
      if (endTs <= startTs) {
        throw new Error('End date must be after start date');
      }
      
      const orderRes = await http.post('/rentals/orders', { 
        customer_id: 1, 
        seller_id: 1, 
        start_ts: startTs, 
        end_ts: endTs 
      });
      const op = orderRes?.data || {};
      const orderId = op.id ?? op.order_id ?? op.rental_id ?? op.data?.id;
      if (!orderId) throw new Error('Order ID missing from response');

      // 2) Add items
      for (const it of cartItems) {
        const product_id = it.productId ?? it.product_id ?? it.id;
        if (!product_id) continue;
        await http.post(`/rentals/orders/${orderId}/items`, {
          product_id,
          qty: it.qty,
          unit_price: it.unitPrice,
        });
      }

      // 3) Create invoice
      const invRes = await http.post('/billing/invoices', { rental_id: orderId });
      const ip = invRes?.data || {};
      const invoiceId = ip.id ?? ip.invoice_id ?? ip.data?.id;

      // 4) Record payment
      const amount = calculateFinalTotal();
      await http.post('/billing/payments', { rental_id: orderId, invoice_id: invoiceId, amount });

      // 5) Engagement features after successful payment
      try {
        // Earn loyalty points
        await earnLoyaltyPoints(1, 10); // user_id: 1, points: 10
        
        // Create return reminder notification
        const returnDate = new Date(endTs * 1000); // Convert Unix timestamp back to Date
        returnDate.setDate(returnDate.getDate() + 1); // Reminder 1 day after return
        await createNotification(1, 'return_reminder', returnDate.toISOString());
      } catch (engagementError) {
        console.warn('Engagement features failed:', engagementError);
        // Don't fail the payment if engagement features fail
      }

      // Success
      clearCart();
      navigate('/thank-you');
    } catch (err) {
      let detail = err?.response?.data?.detail;
      if (Array.isArray(detail)) {
        detail = detail.map(d => d?.msg || d?.message || JSON.stringify(d)).join(', ');
      } else if (detail && typeof detail === 'object') {
        detail = detail?.message || JSON.stringify(detail);
      }
      const message = detail || err?.message || 'Payment failed';
      window.dispatchEvent(new CustomEvent('toast', { detail: { type: 'error', message: String(message) } }));
    } finally {
      setLoading(false);
    }
  };

  const summary = getCartSummary();
  const finalTotal = calculateFinalTotal();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
      <form className="md:col-span-2" onSubmit={onPay}>
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-6 text-neutral-900">Payment Information</h2>
          
          <div className="space-y-4">
            <label className="block">
              <span className="block mb-2 text-sm font-medium text-neutral-700">Cardholder Name</span>
              <Input 
                value={form.name} 
                onChange={handleChange}
                onBlur={handleBlur}
                name="name"
                placeholder="Enter cardholder name"
                error={fieldErrors.name}
              />
              {fieldErrors.name && (
                <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {fieldErrors.name}
                </div>
              )}
            </label>
            
            <label className="block">
              <span className="block mb-2 text-sm font-medium text-neutral-700">Card Number</span>
              <Input 
                value={form.number} 
                onChange={handleChange}
                onBlur={handleBlur}
                name="number"
                placeholder="4242 4242 4242 4242" 
                error={fieldErrors.number}
              />
              {fieldErrors.number && (
                <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                  <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                  {fieldErrors.number}
                </div>
              )}
            </label>
            
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="block mb-2 text-sm font-medium text-neutral-700">Expiry Date</span>
                <Input 
                  value={form.expiry} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="expiry"
                  placeholder="MM/YY" 
                  error={fieldErrors.expiry}
                />
                {fieldErrors.expiry && (
                  <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {fieldErrors.expiry}
                  </div>
                )}
              </label>
              
              <label className="block">
                <span className="block mb-2 text-sm font-medium text-neutral-700">CVV</span>
                <Input 
                  value={form.cvv} 
                  onChange={handleChange}
                  onBlur={handleBlur}
                  name="cvv"
                  placeholder="123"
                  error={fieldErrors.cvv}
                />
                {fieldErrors.cvv && (
                  <div className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                    {fieldErrors.cvv}
                  </div>
                )}
              </label>
            </div>
            
            <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
              <input 
                type="checkbox" 
                checked={form.save} 
                onChange={e=>setForm({...form,save:e.target.checked})}
                className="w-4 h-4 text-[#00AFB9] border-neutral-300 rounded focus:ring-[#00AFB9] focus:ring-2"
              />
              <span>Save card for future payments</span>
            </label>
          </div>
          
          <div className="mt-6 flex items-center gap-3">
            <button 
              type="button" 
              className="px-4 h-10 rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 transition-colors duration-200" 
              onClick={()=>navigate('/checkout/delivery')}
            >
              Back
            </button>
            <button 
              type="submit" 
              className="px-6 h-10 rounded-lg bg-[#00AFB9] text-white hover:opacity-90 transition-all duration-200 shadow-sm" 
              disabled={loading}
            >
              {loading ? 'Processing…' : 'Pay Now'}
            </button>
          </div>
        </div>
      </form>

      {/* Order Summary & Promotions */}
      <div className="space-y-4">
        {/* Promotions */}
        <CouponBox 
          value={couponCode}
          onChange={setCouponCode}
          onApply={handlePromotionApply}
          cartTotal={summary.total}
        />

        {/* Order Summary */}
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
          <h3 className="font-medium mb-3 text-neutral-900">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Subtotal</span>
              <span className="font-medium">₹{summary.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Delivery</span>
              <span className="font-medium">₹{summary.delivery.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-neutral-600">Taxes</span>
              <span className="font-medium">₹{summary.taxes.toFixed(2)}</span>
            </div>
            
            {/* Promotion Discount */}
            {appliedPromo && (
              <div className="flex items-center justify-between text-green-600">
                <span>Promotion ({appliedPromo.code})</span>
                <span className="font-medium">
                  {appliedPromo.discount_type === 'percentage' 
                    ? `-${appliedPromo.discount_value}%`
                    : `-₹${appliedPromo.discount_value}`
                  }
                </span>
              </div>
            )}
            
            <div className="border-t border-neutral/200 pt-2 mt-2">
              <div className="flex items-center justify-between font-semibold text-base">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm p-4">
          <h4 className="font-medium mb-2 text-neutral-900">Secure Payment</h4>
          <p className="text-xs text-neutral-600">Your payment information is encrypted and secure. We never store your card details.</p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPayment;


