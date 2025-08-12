// CheckoutDelivery.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { getValidationError } from '../utils/validation';
import { Field, Input } from '../components/FormControls';
import OrderSummary from '../components/OrderSummary';

const CheckoutDelivery = () => {
  const navigate = useNavigate();
  const { getCartSummary, appliedPromo } = useShop();
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
    
    // Store customer information for invoice generation
    sessionStorage.setItem('customer_name', delivery.name);
    sessionStorage.setItem('customer_email', 'customer@example.com'); // This would come from user profile
    sessionStorage.setItem('customer_address', `${delivery.address1}${delivery.address2 ? ', ' + delivery.address2 : ''}, ${delivery.city} ${delivery.postal}`);
    
    navigate('/checkout/payment');
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
        <OrderSummary summary={getCartSummary()} promo={appliedPromo} />
      </div>
    </div>
  );
};

export default CheckoutDelivery;


