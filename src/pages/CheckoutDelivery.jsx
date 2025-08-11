// CheckoutDelivery.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { getValidationError } from '../utils/validation';

const Field = ({ label, children, error }) => (
  <label className="block text-sm mb-3">
    <span className="block mb-1 text-neutral-700">{label}</span>
    {children}
    {error && (
      <div className="text-xs text-red-600 mt-1 flex items-center gap-1">
        <span className="w-1 h-1 bg-red-500 rounded-full"></span>
        {error}
      </div>
    )}
  </label>
);

const Input = ({ error, ...props }) => (
  <input 
    {...props} 
    className={`w-full h-10 px-3 rounded-lg border bg-white shadow-sm transition-colors ${
      error 
        ? 'border-red-300 focus:border-red-400 focus:ring-red-100' 
        : 'border-neutral/300 focus:border-neutral-400 focus:ring-neutral-100'
    } focus:outline-none focus:ring-2 ${props.className||''}`} 
  />
);

const CheckoutDelivery = () => {
  const navigate = useNavigate();
  const { getCartSummary } = useShop();
  const [same, setSame] = useState(true);
  const [delivery, setDelivery] = useState({ name:'', phone:'', address1:'', address2:'', city:'', postal:'' });
  const [invoice, setInvoice] = useState({ name:'', phone:'', address1:'', address2:'', city:'', postal:'' });
  const [errors, setErrors] = useState({});

  const handleDeliveryChange = (field, value) => {
    setDelivery(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleInvoiceChange = (field, value) => {
    setInvoice(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const err = {};
    
    // Required field validation
    ['name','phone','address1','city','postal'].forEach(k => { 
      if(!delivery[k]) err[k] = 'Required'; 
    });
    
    // Phone number validation
    if (delivery.phone) {
      const phoneError = getValidationError('Phone Number', delivery.phone, 'phone');
      if (phoneError) err.phone = phoneError;
    }
    
    // Postal code validation
    if (delivery.postal) {
      const postalError = getValidationError('Postal Code', delivery.postal, 'postal');
      if (postalError) err.postal = postalError;
    }
    
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleContinue = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    navigate('/checkout/payment');
  };

  const summary = getCartSummary();

  // Ensure summary values exist and provide fallbacks
  const safeSummary = {
    subtotal: summary?.subtotal || 0,
    tax: summary?.tax || 0,
    total: summary?.total || 0
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-3 gap-6">
      <form className="md:col-span-2" onSubmit={handleContinue}>
        <div className="rounded-xl border border-neutral/200 bg-white shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"' }}>Delivery Address</h2>
          <Field label="Full Name" error={errors.name}>
            <Input 
              value={delivery.name} 
              onChange={e => handleDeliveryChange('name', e.target.value)} 
            />
          </Field>
          <Field label="Phone" error={errors.phone}>
            <Input 
              value={delivery.phone} 
              onChange={e => handleDeliveryChange('phone', e.target.value)} 
            />
          </Field>
          <Field label="Address 1" error={errors.address1}>
            <Input 
              value={delivery.address1} 
              onChange={e => handleDeliveryChange('address1', e.target.value)} 
            />
          </Field>
          <Field label="Address 2">
            <Input 
              value={delivery.address2} 
              onChange={e => handleDeliveryChange('address2', e.target.value)} 
            />
          </Field>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="City" error={errors.city}>
              <Input 
                value={delivery.city} 
                onChange={e => handleDeliveryChange('city', e.target.value)} 
              />
            </Field>
            <Field label="Postal Code" error={errors.postal}>
              <Input 
                value={delivery.postal} 
                onChange={e => handleDeliveryChange('postal', e.target.value)} 
              />
            </Field>
          </div>
        </div>

        <div className="rounded-xl border border-neutral/200 bg-white shadow-sm p-4 mt-6">
          <div className="flex items-center gap-2 mb-4">
            <input type="checkbox" checked={same} onChange={e=>setSame(e.target.checked)} />
            <span className="text-sm">Invoice address same as delivery</span>
          </div>
          {!same && (
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Full Name">
                <Input 
                  value={invoice.name} 
                  onChange={e => handleInvoiceChange('name', e.target.value)} 
                />
              </Field>
              <Field label="Phone">
                <Input 
                  value={invoice.phone} 
                  onChange={e => handleInvoiceChange('phone', e.target.value)} 
                />
              </Field>
              <Field label="Address 1">
                <Input 
                  value={invoice.address1} 
                  onChange={e => handleInvoiceChange('address1', e.target.value)} 
                />
              </Field>
              <Field label="Address 2">
                <Input 
                  value={invoice.address2} 
                  onChange={e => handleInvoiceChange('address2', e.target.value)} 
                />
              </Field>
              <Field label="City">
                <Input 
                  value={invoice.city} 
                  onChange={e => handleInvoiceChange('city', e.target.value)} 
                />
              </Field>
              <Field label="Postal Code">
                <Input 
                  value={invoice.postal} 
                  onChange={e => handleInvoiceChange('postal', e.target.value)} 
                />
              </Field>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6">
          <button type="button" className="px-4 h-10 rounded-lg border border-neutral/300 bg-white hover:bg-neutral-50 transition-colors" onClick={()=>navigate('/cart')}>Back to cart</button>
          <button type="submit" className="px-4 h-10 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors">Continue</button>
        </div>
      </form>
      
      <div className="space-y-4">
        <div className="rounded-xl border border-neutral/200 bg-white shadow-sm p-4">
          <h3 className="font-semibold mb-3" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"' }}>Order Summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>₹{safeSummary.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax:</span>
              <span>₹{safeSummary.tax.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 font-semibold">
              <div className="flex justify-between">
                <span>Total:</span>
                <span>₹{safeSummary.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutDelivery;


