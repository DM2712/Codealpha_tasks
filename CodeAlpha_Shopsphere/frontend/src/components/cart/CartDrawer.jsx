import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { CartItem } from './CartItem';

export const CartDrawer = () => {
  const navigate = useNavigate();
  const { cartItems, itemCount, subtotal, isCartOpen, closeCart } = useCart();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface-container-lowest shadow-elevated flex flex-col animate-slide-in-right">
          
          {/* Header */}
          <div className="p-5 border-b border-outline-variant/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-on-background">Your Shopping Bag</h2>
              <span className="bg-primary-fixed text-on-primary-fixed text-xs font-extrabold px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-xl text-secondary hover:text-on-surface hover:bg-surface-container-low transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center text-outline">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-background">Your bag is empty</h3>
                  <p className="text-xs text-secondary mt-1">
                    Looks like you haven't added anything to your cart yet.
                  </p>
                </div>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/products');
                  }}
                  className="px-6 py-2.5 bg-primary-container text-on-primary text-xs font-bold rounded-xl hover:bg-primary transition-all"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <CartItem key={item.id} item={item} isDrawer={true} />
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-outline-variant/30 bg-surface-container-low space-y-4">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-semibold text-secondary">Subtotal</span>
                <span className="text-xl font-black text-on-background">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-secondary">
                Shipping, taxes, and promotional discounts calculated at checkout.
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/cart');
                  }}
                  className="py-3 px-4 bg-surface-container-highest text-on-surface text-xs font-bold rounded-xl hover:bg-slate-300 transition-all text-center"
                >
                  View Full Cart
                </button>
                <button
                  onClick={() => {
                    closeCart();
                    navigate('/checkout');
                  }}
                  className="py-3 px-4 bg-primary-container text-on-primary text-xs font-bold rounded-xl hover:bg-primary transition-all text-center flex items-center justify-center gap-1 shadow-md"
                >
                  Checkout <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
