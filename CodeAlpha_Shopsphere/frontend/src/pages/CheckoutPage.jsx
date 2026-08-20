import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ShoppingBag,
  Building,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAppAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/api';
import { OrderSummary } from '../components/cart/OrderSummary';

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, subtotal, discount, shippingFee, tax, total, clearCart } = useCart();
  const { user, userId } = useAppAuth();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || 'Alex Morgan',
    email: user?.primaryEmailAddress?.emailAddress || 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    address: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    postalCode: '97477',
    country: 'United States',
    paymentMethod: 'credit_card',
    cardNumber: '•••• •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '•••'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto p-8 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 my-8">
        <ShoppingBag className="w-12 h-12 text-outline mx-auto mb-3" />
        <h2 className="text-xl font-bold text-on-background mb-2">Your Cart is Empty</h2>
        <p className="text-xs text-secondary mb-6">Add products to your cart before proceeding to checkout.</p>
        <Link
          to="/products"
          className="px-6 py-2.5 bg-primary-container text-on-primary font-bold text-xs rounded-xl inline-block"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setErrorMessage('');

    if (!formData.fullName || !formData.address || !formData.city || !formData.postalCode) {
      setErrorMessage('Please fill in all required shipping address fields.');
      showToast('Please complete required shipping fields', 'error');
      return;
    }

    try {
      setIsSubmitting(true);

      const orderPayload = {
        clerk_user_id: userId || 'guest_user',
        total_amount: total,
        subtotal,
        tax,
        shipping_fee: shippingFee,
        discount,
        payment_method: formData.paymentMethod,
        shipping_details: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        items: cartItems.map((item) => ({
          product_id: String(item.id),
          product_name: item.title,
          price: item.price,
          quantity: item.quantity,
          image_url: item.image
        }))
      };

      const response = await orderService.createOrder(orderPayload);

      if (response && response.success) {
        const createdOrder = response.order;
        clearCart();
        showToast('Order placed successfully!', 'success');
        navigate(`/order-confirmation/${createdOrder.id}`, { state: { order: createdOrder } });
      } else {
        throw new Error(response.message || 'Failed to process order');
      }
    } catch (err) {
      console.error('Order creation error:', err);
      setErrorMessage(err.message || 'Something went wrong while placing your order.');
      showToast('Order processing failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
        <div className="flex items-center gap-3">
          <Link
            to="/cart"
            className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-colors"
            aria-label="Back to cart"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-on-background tracking-tight">
              Express Checkout
            </h1>
            <p className="text-xs text-secondary flex items-center gap-1.5 mt-0.5">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              Secure 256-bit encrypted checkout
            </p>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-error-container/40 border border-error/30 text-error rounded-2xl text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Main Checkout Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Details (Left) */}
        <form onSubmit={handleFormSubmit} className="lg:col-span-7 space-y-6">
          
          {/* 1. Contact & Shipping Information */}
          <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft space-y-4">
            <div className="flex items-center gap-2 text-primary pb-2 border-b border-outline-variant/20">
              <MapPin className="w-5 h-5" />
              <h2 className="text-base font-bold text-on-background">Shipping Details</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1">
                  <User className="w-3.5 h-3.5" /> Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g. Alex Morgan"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary-container"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="alex@example.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary-container"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary-container"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  placeholder="Street name and house/apartment number"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary-container"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-secondary">City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="City"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary-container"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary">State *</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    required
                    placeholder="State/Province"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary-container"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary">ZIP / Postal *</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    placeholder="ZIP"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary-container"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. Payment Method */}
          <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft space-y-4">
            <div className="flex items-center gap-2 text-primary pb-2 border-b border-outline-variant/20">
              <CreditCard className="w-5 h-5" />
              <h2 className="text-base font-bold text-on-background">Payment Method</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'credit_card', label: 'Credit Card', icon: CreditCard },
                { id: 'apple_pay', label: 'Digital Wallet', icon: ShieldCheck },
                { id: 'cod', label: 'Cash on Delivery', icon: Truck }
              ].map((pm) => {
                const Icon = pm.icon;
                const isSelected = formData.paymentMethod === pm.id;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setFormData((p) => ({ ...p, paymentMethod: pm.id }))}
                    className={`p-3.5 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? 'border-primary-container bg-primary-fixed/30 text-primary font-bold'
                        : 'border-outline-variant/30 hover:border-outline-variant text-secondary'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs">{pm.label}</span>
                  </button>
                );
              })}
            </div>

            {formData.paymentMethod === 'credit_card' && (
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-secondary">Card Number</label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary-container"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary">Expiry</label>
                    <input
                      type="text"
                      name="cardExp"
                      value={formData.cardExp}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary-container"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-secondary">CVC / CVV</label>
                    <input
                      type="text"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary-container"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>

        {/* Order Summary & Confirm (Right) */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <OrderSummary
            onCheckout={handleFormSubmit}
            checkoutBtnText={`Place Order • $${total.toFixed(2)}`}
            isCheckoutPage={true}
            isSubmitting={isSubmitting}
          />

          {/* Cart Item Preview Mini-list */}
          <div className="p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-secondary">
              Items in Order ({cartItems.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-1">
                  <div className="flex items-center gap-2 truncate max-w-[220px]">
                    <img src={item.image} alt={item.title} className="w-7 h-7 object-contain rounded shrink-0 bg-surface-container-low" />
                    <span className="font-semibold text-on-surface truncate">{item.title}</span>
                    <span className="text-secondary font-bold">×{item.quantity}</span>
                  </div>
                  <span className="font-bold text-on-background">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
