// ThankYou.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getPaymentStatus } from '../services/payments';
import { useShop } from '../context/ShopContext';

const ThankYou = () => {
  const location = useLocation();
  const { cartItems, products, appliedPromo } = useShop();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    // Try to get payment details from URL params or session storage
    const urlParams = new URLSearchParams(location.search);
    const sessionId = urlParams.get('session_id');
    const paymentIntentId = urlParams.get('payment_intent') || sessionStorage.getItem('stripe_payment_intent_id');
    const rentalId = urlParams.get('rental_id');

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
      // Generate invoice with default data if no payment intent
      generateInvoiceData(rentalId, paymentIntentId, 0);
    }
  }, [location]);

  const fetchPaymentStatus = async (paymentIntentId) => {
    try {
      const status = await getPaymentStatus(paymentIntentId);
      setPaymentDetails(status);
      // Generate invoice data after payment details are loaded
      generateInvoiceData(null, paymentIntentId, status?.amount || 0);
    } catch (error) {
      console.error('Failed to fetch payment status:', error);
      // Generate invoice with default data if payment status fails
      generateInvoiceData(null, paymentIntentId, 0);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoiceData = (rentalId, paymentIntentId, amount = 0) => {
    // Get cart items from sessionStorage (since cart is cleared after payment)
    const storedCartItems = sessionStorage.getItem('cart_items');
    const storedAppliedPromo = sessionStorage.getItem('applied_promo');
    
    console.log('ThankYou - storedCartItems:', storedCartItems);
    console.log('ThankYou - storedAppliedPromo:', storedAppliedPromo);
    
    let invoiceCartItems = [];
    let invoiceAppliedPromo = null;
    
    if (storedCartItems) {
      try {
        invoiceCartItems = JSON.parse(storedCartItems);
        console.log('ThankYou - parsed invoiceCartItems:', invoiceCartItems);
      } catch (e) {
        console.error('Failed to parse stored cart items:', e);
      }
    }
    
    if (storedAppliedPromo) {
      try {
        invoiceAppliedPromo = JSON.parse(storedAppliedPromo);
        console.log('ThankYou - parsed invoiceAppliedPromo:', invoiceAppliedPromo);
      } catch (e) {
        console.error('Failed to parse stored applied promo:', e);
      }
    }
    
    // Generate invoice items from stored cart data
    const invoiceItems = invoiceCartItems.map(item => {
      const product = products.find(p => String(p?.id ?? p?.product_id ?? p?.uuid ?? p?.pk ?? p?.slug) === String(item.productId));
      const productName = product?.name || item.title || `Product ${item.productId}`;
      const unitPrice = item.unitPrice || product?.price || 0;
      const total = unitPrice * item.qty;
      
      return {
        description: productName,
        quantity: item.qty,
        unitPrice: unitPrice,
        total: total,
        rentalPeriod: item.startDate && item.endDate ? `${item.startDate} to ${item.endDate}` : null
      };
    });

    // Calculate totals
    const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
    const tax = 0; // No tax for now
    let total = subtotal + tax;

    // Apply promotion discount if available
    let discount = 0;
    let discountDescription = '';
    if (invoiceAppliedPromo && invoiceAppliedPromo.valid) {
      if (invoiceAppliedPromo.discount_type === 'percentage') {
        discount = total * (invoiceAppliedPromo.discount_value / 100);
        discountDescription = `${invoiceAppliedPromo.code} - ${invoiceAppliedPromo.discount_value}% off`;
      } else if (invoiceAppliedPromo.discount_type === 'fixed') {
        discount = invoiceAppliedPromo.discount_value;
        discountDescription = `${invoiceAppliedPromo.code} - ₹${invoiceAppliedPromo.discount_value} off`;
      }
      total = Math.max(0, total - discount);
    }

    // Use provided amount if available, otherwise use calculated total
    let finalAmount = amount > 0 ? (amount / 100) : total; // Convert cents to rupees if needed

    console.log('ThankYou - Invoice calculation:', {
      subtotal,
      tax,
      discount,
      discountDescription,
      total,
      finalAmount,
      amount,
      invoiceItems: invoiceItems.length
    });

    // Get customer info from session storage or use defaults
    const customerName = sessionStorage.getItem('customer_name') || 'Customer Name';
    const customerEmail = sessionStorage.getItem('customer_email') || 'customer@example.com';
    const customerAddress = sessionStorage.getItem('customer_address') || 'Customer Address';

    const invoice = {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(), // 30 days from now
      customer: {
        name: customerName,
        email: customerEmail,
        address: customerAddress
      },
      items: invoiceItems,
      subtotal: subtotal,
      tax: tax,
      discount: discount,
      discountDescription: discountDescription,
      total: finalAmount,
      paymentStatus: 'Paid',
      paymentMethod: 'Stripe',
      transactionId: paymentIntentId || 'N/A'
    };
    
    console.log('ThankYou - Final invoice:', invoice);
    setInvoiceData(invoice);
  };

  const downloadInvoice = async () => {
    setDownloading(true);
    try {
      // Create invoice HTML
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Invoice ${invoiceData.invoiceNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .invoice-header { text-align: center; margin-bottom: 30px; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .customer-info, .invoice-info { flex: 1; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #f8f9fa; }
            .total-row { font-weight: bold; }
            .footer { margin-top: 40px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="invoice-header">
            <h1>INVOICE</h1>
            <h2>Odoo Rental System</h2>
          </div>
          
          <div class="invoice-details">
            <div class="customer-info">
              <h3>Bill To:</h3>
              <p>${invoiceData.customer.name}<br>
              ${invoiceData.customer.email}<br>
              ${invoiceData.customer.address}</p>
            </div>
            <div class="invoice-info">
              <h3>Invoice Details:</h3>
              <p><strong>Invoice #:</strong> ${invoiceData.invoiceNumber}<br>
              <strong>Date:</strong> ${invoiceData.date}<br>
              <strong>Due Date:</strong> ${invoiceData.dueDate}<br>
              <strong>Status:</strong> ${invoiceData.paymentStatus}</p>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Rental Period</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${invoiceData.items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td>${item.quantity}</td>
                  <td>₹${item.unitPrice.toFixed(2)}</td>
                  <td>${item.rentalPeriod || 'N/A'}</td>
                  <td>₹${item.total.toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="4">Subtotal:</td>
                <td>₹${invoiceData.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colspan="4">Tax:</td>
                <td>₹${invoiceData.tax.toFixed(2)}</td>
              </tr>
              ${invoiceData.discount > 0 ? `
                <tr class="discount-row" style="color: #059669;">
                  <td colspan="4">Discount (${invoiceData.discountDescription}):</td>
                  <td>-₹${invoiceData.discount.toFixed(2)}</td>
                </tr>
              ` : ''}
              <tr class="total-row">
                <td colspan="4">Total:</td>
                <td>₹${invoiceData.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div class="footer">
            <p><strong>Payment Method:</strong> ${invoiceData.paymentMethod}</p>
            <p><strong>Transaction ID:</strong> ${invoiceData.transactionId}</p>
            <p>Thank you for your business!</p>
          </div>
        </body>
        </html>
      `;

      // Create blob and download
      const blob = new Blob([invoiceHTML], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceData.invoiceNumber}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download invoice:', error);
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Processing your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
            <p className="text-lg text-gray-600">
              Your payment was successful and your order has been created.
            </p>
          </div>

          {/* Payment Details */}
          {(paymentDetails || invoiceData) && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Payment Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-medium">
                    ₹{paymentDetails?.amount ? (paymentDetails.amount / 100).toFixed(2) : invoiceData?.total?.toFixed(2) || '0.00'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600 capitalize">
                    {paymentDetails?.status || 'Completed'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment ID:</span>
                  <span className="font-medium font-mono text-xs">
                    {paymentDetails?.payment_intent_id || invoiceData?.transactionId || 'N/A'}
                  </span>
                </div>
                {paymentDetails?.rental_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rental ID:</span>
                    <span className="font-medium">#{paymentDetails.rental_id}</span>
                  </div>
                )}
                {invoiceData?.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Promotion Applied:</span>
                    <span className="font-medium text-green-600">
                      {invoiceData.discountDescription}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Summary */}
          {invoiceData && invoiceData.items && invoiceData.items.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                {invoiceData.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{item.description}</div>
                      <div className="text-sm text-gray-600">
                        Qty: {item.quantity} × ₹{item.unitPrice.toFixed(2)}
                        {item.rentalPeriod && (
                          <span className="ml-2">• {item.rentalPeriod}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">₹{item.total.toFixed(2)}</div>
                    </div>
                  </div>
                ))}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">₹{invoiceData.subtotal.toFixed(2)}</span>
                  </div>
                  {invoiceData.discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Discount ({invoiceData.discountDescription}):</span>
                      <span className="font-medium">-₹{invoiceData.discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-lg font-semibold mt-2">
                    <span>Total:</span>
                    <span>₹{invoiceData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Invoice Section */}
          {invoiceData && (
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-blue-900">Invoice</h3>
                <button
                  onClick={downloadInvoice}
                  disabled={downloading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70"
                >
                  {downloading ? 'Downloading...' : 'Download Invoice'}
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-blue-700 font-medium">Invoice #:</span>
                  <p className="text-blue-900">{invoiceData.invoiceNumber}</p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Date:</span>
                  <p className="text-blue-900">{invoiceData.date}</p>
                </div>
                <div>
                  <span className="text-blue-700 font-medium">Total:</span>
                  <p className="text-blue-900 font-semibold">₹{invoiceData.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-green-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-green-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• You'll receive a confirmation email shortly</li>
              <li>• Your rental details are available in your account</li>
              <li>• Our team will contact you about pickup/delivery</li>
              <li>• Download your invoice for your records</li>
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
              to="/profile"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              View My Profile
            </Link>
            {invoiceData && (
              <button
                onClick={downloadInvoice}
                disabled={downloading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-70"
              >
                {downloading ? 'Downloading...' : 'Download Invoice'}
              </button>
            )}
          </div>

          {/* Support Info */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
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

export default ThankYou;


