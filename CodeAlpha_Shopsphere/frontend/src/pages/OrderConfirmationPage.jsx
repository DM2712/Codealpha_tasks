import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  MapPin,
  Clock,
  ArrowRight,
  ShoppingBag,
  Printer,
  Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { orderService } from '../services/api';

export const OrderConfirmationPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [isLoading, setIsLoading] = useState(!order);

  useEffect(() => {
    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    if (!order && id) {
      const fetchOrder = async () => {
        try {
          setIsLoading(true);
          const res = await orderService.getOrderById(id);
          if (res.order) {
            setOrder(res.order);
          }
        } catch (e) {
          console.warn('Could not fetch order confirmation by ID:', e);
        } finally {
          setIsLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, order]);

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 pt-4">
      {/* 1. Success Hero Banner */}
      <div className="text-center p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-card space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600">
            Order Confirmed!
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-background tracking-tight">
            Thank You For Your Order
          </h1>
          <p className="text-xs sm:text-sm text-secondary">
            A confirmation receipt has been sent to your email address.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl text-xs font-bold text-on-surface border border-outline-variant/30">
          <span>Order ID:</span>
          <span className="font-mono text-primary">{id || order?.id || 'ORD-982341'}</span>
        </div>
      </div>

      {/* 2. Delivery Status Tracker */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-sm">
            <Truck className="w-4 h-4" />
            <span>Estimated Delivery</span>
          </div>
          <span className="text-xs font-bold text-on-surface flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-secondary" />
            {deliveryDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
        </div>

        {/* Progress Bar Timeline */}
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 -z-0"></div>
          <div className="absolute left-0 w-1/3 top-1/2 -translate-y-1/2 h-1 bg-primary-container -z-0"></div>

          <div className="relative z-10 flex flex-col items-center gap-1 bg-surface-container-lowest px-2">
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-xs font-bold shadow">
              ✓
            </div>
            <span className="text-[10px] font-bold text-on-background">Placed</span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-1 bg-surface-container-lowest px-2">
            <div className="w-8 h-8 rounded-full bg-primary-fixed text-primary flex items-center justify-center text-xs font-bold shadow">
              2
            </div>
            <span className="text-[10px] font-bold text-primary">Processing</span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-1 bg-surface-container-lowest px-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-secondary flex items-center justify-center text-xs font-bold">
              3
            </div>
            <span className="text-[10px] font-semibold text-secondary">Shipped</span>
          </div>

          <div className="relative z-10 flex flex-col items-center gap-1 bg-surface-container-lowest px-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-secondary flex items-center justify-center text-xs font-bold">
              4
            </div>
            <span className="text-[10px] font-semibold text-secondary">Delivered</span>
          </div>
        </div>
      </div>

      {/* 3. Shipping & Receipt Breakdown */}
      {order && (
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-outline-variant/20">
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-primary" /> Delivery Address
              </h3>
              <p className="text-xs font-bold text-on-background">
                {order.shipping_details?.fullName}
              </p>
              <p className="text-xs text-secondary">
                {order.shipping_details?.address}, {order.shipping_details?.city},{' '}
                {order.shipping_details?.state} {order.shipping_details?.postalCode}
              </p>
              <p className="text-xs text-secondary">{order.shipping_details?.email}</p>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">
                Payment Method
              </h3>
              <p className="text-xs font-bold text-on-background capitalize">
                {order.payment_method?.replace('_', ' ') || 'Credit Card'}
              </p>
              <p className="text-xs text-secondary">Status: Paid & Verified</p>
            </div>
          </div>

          {/* Ordered Line Items */}
          {order.items && order.items.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-secondary">
                Purchased Items ({order.items.length})
              </h3>
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b border-outline-variant/10 text-xs">
                    <div className="flex items-center gap-3">
                      {item.image_url && (
                        <img src={item.image_url} alt={item.product_name} className="w-10 h-10 object-contain rounded-lg bg-surface-container-low p-1" />
                      )}
                      <div>
                        <p className="font-bold text-on-background">{item.product_name}</p>
                        <p className="text-[11px] text-secondary">Qty: {item.quantity} × ${item.price}</p>
                      </div>
                    </div>
                    <span className="font-bold text-on-background">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Totals */}
          <div className="pt-2 space-y-1.5 text-xs text-secondary">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-bold text-on-background">${(order.subtotal || order.total_amount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-bold text-on-background">
                {order.shipping_fee ? `$${order.shipping_fee.toFixed(2)}` : 'FREE'}
              </span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-bold text-on-background">${order.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-outline-variant/20 text-base font-black text-on-background">
              <span>Grand Total</span>
              <span className="text-primary">${order.total_amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          to="/orders"
          className="w-full sm:w-auto px-6 py-3 bg-primary-container text-on-primary font-bold text-xs rounded-2xl hover:bg-primary transition-all text-center shadow-md flex items-center justify-center gap-2"
        >
          <Package className="w-4 h-4" /> View Order in My Orders
        </Link>
        <Link
          to="/products"
          className="w-full sm:w-auto px-6 py-3 bg-surface-container-lowest text-on-surface font-bold text-xs rounded-2xl border border-outline-variant/40 hover:bg-surface-container-low transition-all text-center flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </Link>
      </div>
    </div>
  );
};
