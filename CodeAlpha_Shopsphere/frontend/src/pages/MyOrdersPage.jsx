import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  Calendar,
  Clock,
  ChevronRight,
  ShoppingBag,
  ExternalLink,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { orderService } from '../services/api';
import { useAppAuth } from '../context/AuthContext';

export const MyOrdersPage = () => {
  const { userId, isSignedIn } = useAppAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await orderService.getMyOrders();
      setOrders(res.orders || []);
    } catch (err) {
      console.error('Error fetching customer orders:', err);
      setError('Could not load order history. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const getStatusBadge = (status = 'processing') => {
    const s = status.toLowerCase();
    if (s === 'delivered') {
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    } else if (s === 'shipped') {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (s === 'cancelled') {
      return 'bg-rose-100 text-rose-800 border-rose-200';
    }
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-8 space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-slate-200 rounded"></div>
        <div className="h-32 bg-slate-200 rounded-3xl"></div>
        <div className="h-32 bg-slate-200 rounded-3xl"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-outline-variant/30">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-on-background tracking-tight">
            Order History
          </h1>
          <p className="text-xs sm:text-sm text-secondary mt-0.5">
            View and manage your recent purchases and shipments
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container-high text-on-surface transition-colors"
          title="Refresh orders"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {error && (
        <div className="p-4 bg-error-container/40 border border-error/30 text-error rounded-2xl text-xs flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchOrders} className="font-bold underline">Retry</button>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="py-20 text-center max-w-md mx-auto p-8 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-soft space-y-4">
          <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto text-outline">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-on-background">No orders found</h3>
          <p className="text-xs text-secondary">
            You haven't placed any orders yet. Discover our latest arrivals and start shopping!
          </p>
          <div className="pt-2">
            <Link
              to="/products"
              className="inline-block px-6 py-2.5 bg-primary-container text-on-primary font-bold text-xs rounded-xl hover:bg-primary transition-all shadow-sm"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const dateStr = new Date(order.created_at || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div
                key={order.id}
                className="p-5 sm:p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft hover:shadow-card transition-all space-y-4"
              >
                {/* Order Top Summary */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-on-background">
                        #{order.id}
                      </span>
                      <p className="text-[11px] text-secondary flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {dateStr}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status || 'Processing'}
                    </span>
                    <span className="text-base font-extrabold text-on-background">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(order.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-2 rounded-xl bg-surface-container-low"
                    >
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="w-12 h-12 object-contain rounded-lg bg-surface-container-lowest p-1"
                        />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-on-background truncate">
                          {item.product_name}
                        </p>
                        <p className="text-[11px] text-secondary">
                          Qty: {item.quantity} • ${parseFloat(item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & View Receipt */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 text-xs border-t border-outline-variant/10 text-secondary">
                  <span>
                    Ship to: <strong className="text-on-surface">{order.shipping_details?.fullName}</strong> ({order.shipping_details?.city}, {order.shipping_details?.country})
                  </span>

                  <Link
                    to={`/order-confirmation/${order.id}`}
                    state={{ order }}
                    className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                  >
                    View Receipt & Tracking <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
