import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { CartItem } from '../components/cart/CartItem';
import { OrderSummary } from '../components/cart/OrderSummary';

export const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, itemCount, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto p-8 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-card space-y-4 my-8">
        <div className="w-20 h-20 bg-surface-container-high rounded-full flex items-center justify-center mx-auto text-outline">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-on-background">Your bag is currently empty</h2>
        <p className="text-sm text-secondary">
          Explore our trending luxury collection and add your favorite items to your shopping cart.
        </p>
        <div className="pt-2">
          <Link
            to="/products"
            className="inline-block px-8 py-3 bg-primary-container text-on-primary font-bold text-sm rounded-2xl hover:bg-primary transition-all shadow-md"
          >
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-background tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs sm:text-sm text-secondary">
            You have <strong>{itemCount}</strong> items in your cart
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
          <button
            onClick={clearCart}
            className="inline-flex items-center gap-1 text-xs font-bold text-error hover:underline px-2 py-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Cart
          </button>
        </div>
      </div>

      {/* Grid: Items List + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-7 space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 sticky top-24">
          <OrderSummary
            onCheckout={() => navigate('/checkout')}
            checkoutBtnText="Proceed to Checkout"
          />
        </div>
      </div>
    </div>
  );
};
