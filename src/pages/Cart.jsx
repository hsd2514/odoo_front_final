// Cart.jsx
import React, { useMemo, useState } from 'react';
import { useShop } from '../context/ShopContext';
import DateRangePicker from '../components/DateRangePicker';
import CouponBox from '../components/CouponBox';
import LoyaltyDisplay from '../components/LoyaltyDisplay';
import OrderSummary from '../components/OrderSummary';
import PromotionDebug from '../components/PromotionDebug';
import { pricingColors } from '../utils/colors';
import { validateDateRange } from '../utils/datetime';

const Cart = () => {
  const {
    cartItems,
    products,
    updateCartQty,
    removeFromCart,
    updateCartDates,
    priceMultiplier,
    cartCoupon,
    setCartCoupon,
    appliedPromo,
    setAppliedPromo,
    getCartSummary,
  } = useShop();

  const rows = useMemo(() => {
    return cartItems.map((it) => {
      // Try multiple ways to find the product
      const product = products.find((p) => {
        const productId =
          p?.id ?? p?.product_id ?? p?.uuid ?? p?.pk ?? p?.slug;
        const cartProductId = it?.productId ?? it?.id;
        return String(productId) === String(cartProductId);
      });

      // If no product found, create a fallback product object with better naming
      const fallbackProduct =
        product || {
          id: it.productId,
          name: it.title || `Product ${it.productId}`,
          price: it.unitPrice || 0,
          pricing_unit: it.pricingUnit || 'day',
        };

      const unit = (fallbackProduct?.price || it?.unitPrice || 0) * priceMultiplier;
      return {
        ...it,
        product: fallbackProduct,
        unit,
        total: unit * it.qty,
      };
    });
  }, [cartItems, products, priceMultiplier]);

  // totals are shown via getCartSummary()
  const [editing, setEditing] = useState(null); // key: productId|start|end
  const [dateErrors, setDateErrors] = useState({});

  const handlePromotionApply = (promotion) => {
    console.log('Cart - handlePromotionApply called with:', promotion);
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

  // Validate all cart items have valid dates before checkout
  const validateCartDates = () => {
    const errors = {};
    let hasErrors = false;

    cartItems.forEach((item) => {
      if (!item.startDate || !item.endDate) {
        errors[item.productId] = 'Please select both start and end dates';
        hasErrors = true;
        return;
      }

      const validation = validateDateRange(item.startDate, item.endDate);
      if (!validation.valid) {
        errors[item.productId] = validation.error;
        hasErrors = true;
      }
    });

    setDateErrors(errors);
    return !hasErrors;
  };

  const handleCheckout = () => {
    if (!validateCartDates()) {
      // Show error message
      alert('Please fix the date errors before proceeding to checkout');
      return;
    }

    // All dates are valid, proceed to checkout
    window.location.href = '/checkout/delivery';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Cart</h1>
          <p className="text-gray-600">
            Review your selected items and proceed to checkout
          </p>
        </div>

        {rows.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any items yet.
            </p>
            <a
              href="/home"
              className="inline-flex items-center px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105"
              style={{ backgroundColor: pricingColors.primary }}
            >
              Start Shopping
            </a>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {rows.map((r, idx) => (
                <div
                  key={`${r.productId}|${r.startDate || ''}|${r.endDate || ''}|${idx}`}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl">📦</span>
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg mb-1">
                        {r.product?.name || r.title || `Product ${r.productId}`}
                      </h3>
                      <div className="text-gray-600 mb-3">
                        ₹{r.unit.toFixed(2)}{' '}
                        {r.product?.pricing_unit
                          ? `/ ${r.product?.pricing_unit}`
                          : r.pricingUnit
                          ? `/ ${r.pricingUnit}`
                          : ''}
                      </div>

                      {/* Date Selection */}
                      <div className="mb-4">
                        {editing === r.productId ? (
                          <DateRangePicker
                            start={r.startDate}
                            end={r.endDate}
                            onChange={({ start, end }) => {
                              const ns = start ? start.toISOString().slice(0, 10) : '';
                              const ne = end ? end.toISOString().slice(0, 10) : '';
                              updateCartDates(r.productId, r.startDate, r.endDate, ns, ne);

                              // Clear error when dates are updated
                              if (dateErrors[r.productId]) {
                                setDateErrors((prev) => ({
                                  ...prev,
                                  [r.productId]: '',
                                }));
                              }
                            }}
                          />
                        ) : (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-medium">Rental Period:</span>
                              {r.startDate && r.endDate ? (
                                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                  {r.startDate} → {r.endDate}
                                </span>
                              ) : r.startDate ? (
                                <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">
                                  From {r.startDate}
                                </span>
                              ) : (
                                <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full">
                                  No dates selected
                                </span>
                              )}
                            </div>

                            {/* Date Error Display */}
                            {dateErrors[r.productId] && (
                              <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                                ⚠️ {dateErrors[r.productId]}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                            onClick={() =>
                              updateCartQty(r.productId, r.startDate, r.endDate, -1)
                            }
                          >
                            -
                          </button>
                          <span className="w-12 text-center font-medium text-gray-900">
                            {r.qty}
                          </span>
                          <button
                            className="w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center"
                            onClick={() =>
                              updateCartQty(r.productId, r.startDate, r.endDate, 1)
                            }
                          >
                            +
                          </button>
                        </div>

                        <div className="text-lg font-semibold text-gray-900">
                          ₹{r.total.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                        onClick={() =>
                          setEditing(editing === r.productId ? null : r.productId)
                        }
                      >
                        {editing === r.productId ? 'Save Dates' : 'Edit Dates'}
                      </button>
                      <button
                        className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-medium"
                        onClick={() =>
                          removeFromCart(r.productId, r.startDate, r.endDate)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

                         {/* Sidebar - Loyalty, Promotions & Checkout */}
             <div className="space-y-6">
               {/* Debug Info */}
               <PromotionDebug />
               
               {/* Loyalty Display */}
               <LoyaltyDisplay userId={1} />

                             {/* Enhanced Coupon Box */}
               <CouponBox
                 value={cartCoupon}
                 onChange={setCartCoupon}
                 onApply={handlePromotionApply}
                 cartTotal={getCartSummary().total}
                 appliedPromo={appliedPromo}
               />

              {/* Order Summary */}
              <OrderSummary summary={getCartSummary()} promo={appliedPromo} />

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-medium transition-all duration-200 hover:scale-105 shadow-sm bg-red-600 hover:bg-red-700"
              >
                Proceed to Checkout
              </button>

              {/* Continue Shopping */}
              <div className="mt-4 text-center">
                <a
                  href="/home"
                  className="text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Continue Shopping
                </a>
              </div>

              {/* Security Info */}
              <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-blue-600 text-xs">🔒</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">
                      Secure Checkout
                    </h4>
                    <p className="text-xs text-blue-700">
                      Your payment information is encrypted and secure. We never
                      store your card details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
