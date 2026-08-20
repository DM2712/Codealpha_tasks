import React, { useState } from 'react';
import { Tag, Check, X, ShieldCheck, Truck, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const OrderSummary = ({ onCheckout, checkoutBtnText = 'Proceed to Checkout', isCheckoutPage = false, isSubmitting = false }) => {
  const { subtotal, discount, shippingFee, tax, total, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  const freeShippingThreshold = 50;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const res = applyCoupon(couponCode);
    if (res.success) {
      setCouponCode('');
    } else {
      setCouponError(res.message);
    }
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-3xl border border-outline-variant/30 shadow-soft space-y-5">
      <h3 className="text-lg font-bold text-on-background pb-3 border-b border-outline-variant/20">
        Order Summary
      </h3>

      {/* Free Shipping Progress Indicator */}
      {!isCheckoutPage && (
        <div className="p-3.5 bg-surface-container-low rounded-2xl space-y-2 border border-outline-variant/20">
          <div className="flex items-center gap-2 text-xs font-semibold text-on-surface">
            <Truck className="w-4 h-4 text-primary shrink-0" />
            {freeShippingRemaining === 0 ? (
              <span className="text-emerald-600 font-bold">🎉 You unlocked FREE Express Shipping!</span>
            ) : (
              <span>
                Add <strong className="text-primary font-bold">${freeShippingRemaining.toFixed(2)}</strong> more for FREE Shipping!
              </span>
            )}
          </div>
          <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary-container h-full rounded-full transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Pricing Breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-secondary">
          <span>Subtotal</span>
          <span className="font-semibold text-on-surface">${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600 font-semibold">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Discount ({appliedCoupon?.code})
            </span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-secondary">
          <span>Estimated Shipping</span>
          <span className="font-semibold text-on-surface">
            {shippingFee === 0 ? (
              <span className="text-emerald-600 font-bold">FREE</span>
            ) : (
              `$${shippingFee.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-secondary">
          <span>Estimated Sales Tax (8%)</span>
          <span className="font-semibold text-on-surface">${tax.toFixed(2)}</span>
        </div>

        <div className="border-t border-outline-variant/20 pt-3 flex justify-between items-baseline">
          <div>
            <span className="text-base font-extrabold text-on-background">Total</span>
            <p className="text-[11px] text-secondary">Including taxes and duties</p>
          </div>
          <span className="text-2xl font-black text-primary">${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Coupon Code Input */}
      {!isCheckoutPage && (
        <div className="pt-2 border-t border-outline-variant/20">
          {appliedCoupon ? (
            <div className="flex items-center justify-between p-2.5 bg-primary-fixed/40 border border-primary-fixed rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-primary" />
                <span className="font-bold text-on-primary-fixed">
                  {appliedCoupon.code} applied ({appliedCoupon.discountPercent}% off)
                </span>
              </div>
              <button
                onClick={removeCoupon}
                className="text-secondary hover:text-error transition-colors p-1"
                aria-label="Remove coupon"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                Promo Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. SHOPSPHERE10"
                  className="flex-1 px-3 py-2 text-xs uppercase bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary-container"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-surface-container-high text-on-surface text-xs font-bold rounded-xl hover:bg-primary-container hover:text-on-primary transition-all"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[11px] text-error font-medium">{couponError}</p>}
            </form>
          )}
        </div>
      )}

      {/* Checkout Button */}
      {onCheckout && (
        <button
          onClick={onCheckout}
          disabled={subtotal === 0 || isSubmitting}
          className="w-full py-3.5 px-6 bg-primary-container text-on-primary font-bold text-sm rounded-2xl hover:bg-primary active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              Processing Order...
            </span>
          ) : (
            <>
              <span>{checkoutBtnText}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      )}

      {/* Security Assurance */}
      <div className="flex items-center justify-center gap-2 text-xs text-secondary pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <span>Guaranteed 256-bit encrypted checkout</span>
      </div>
    </div>
  );
};
