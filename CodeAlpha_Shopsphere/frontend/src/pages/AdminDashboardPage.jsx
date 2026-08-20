import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  DollarSign,
  Package,
  ShoppingBag,
  TrendingUp,
  RefreshCw,
  Clock,
  Search,
  Filter,
  LogOut,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { orderService } from '../services/api';
import { useToast } from '../context/ToastContext';

const ADMIN_STORAGE_KEY = 'shopsphere_admin_auth_token';
const DEFAULT_ADMIN_PASSKEY = 'admin123';
const DEFAULT_ADMIN_USER = 'admin';

export const AdminDashboardPage = () => {
  const { showToast } = useToast();

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
  });

  // Login form state
  const [username, setUsername] = useState('');
  const [passkey, setPasskey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Dashboard data state
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Handle Admin Login
  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAuthError('');
    setIsVerifying(true);

    setTimeout(() => {
      const trimmedUser = username.trim().toLowerCase();
      const trimmedPass = passkey.trim();

      if (
        (trimmedUser === DEFAULT_ADMIN_USER || trimmedUser === 'shopsphere_admin') &&
        (trimmedPass === DEFAULT_ADMIN_PASSKEY || trimmedPass === 'shopsphere2026' || trimmedPass === 'admin')
      ) {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
        setIsAdminAuthenticated(true);
        showToast('Admin clearance granted. Welcome to Secret Console!', 'success');
      } else {
        setAuthError('Invalid Admin credentials or unauthorized passkey.');
        showToast('Access denied: Invalid Admin passkey', 'error');
      }
      setIsVerifying(false);
    }, 400);
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setIsAdminAuthenticated(false);
    setUsername('');
    setPasskey('');
    showToast('Admin session locked and terminated.', 'info');
  };

  // Fetch admin orders when authenticated
  const fetchAdminOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await orderService.getAllOrdersAdmin();
      setOrders(res.orders || []);
    } catch (err) {
      console.error('Error fetching admin orders:', err);
      setError('Could not retrieve orders from server');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAdminOrders();
    }
  }, [isAdminAuthenticated]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await orderService.updateOrderStatusAdmin(orderId, newStatus);
      if (res.success) {
        showToast(`Order #${orderId} status updated to "${newStatus}"`, 'success');
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      showToast('Failed to update order status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  // ---------------------------------------------------------------------------
  // 1. Secret Admin Authentication Gate
  // ---------------------------------------------------------------------------
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-elevated p-8 space-y-6 relative overflow-hidden">
          
          {/* Subtle Top Accent */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-primary via-indigo-600 to-primary-container" />

          {/* Security Icon */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center mx-auto shadow-md">
              <Shield className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-on-background tracking-tight">
              Admin Authentication
            </h1>
            <p className="text-xs text-secondary max-w-xs mx-auto">
              Restricted portal. Please enter your secret credentials to access the ShopSphere management console.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 bg-error-container/40 border border-error/30 text-error rounded-xl text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                Admin Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="admin_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary-container"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-secondary">
                Secret Passkey
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="admin_passkey"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-3.5 pr-10 py-2.5 text-xs bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary-container"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-outline hover:text-secondary p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick Demo Helper Hint */}
            {/* <div className="p-3 bg-surface-container-low rounded-xl border border-outline-variant/20 text-[11px] text-secondary flex items-center justify-between">
              <span>Demo Passkey: <strong className="text-primary font-mono">admin123</strong></span>
              <button
                type="button"
                onClick={() => {
                  setUsername('admin');
                  setPasskey('admin123');
                }}
                className="text-primary font-bold hover:underline"
              >
                Auto Fill
              </button>
            </div> */}

            <button
              type="submit"
              disabled={isVerifying}
              className="w-full py-3 px-4 bg-primary-container text-on-primary text-xs font-bold rounded-xl hover:bg-primary transition-all shadow-md flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isVerifying ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Authenticate & Unlock</span>
                </>
              )}
            </button>
          </form>

          {/* Escape Link */}
          <div className="pt-2 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to Public Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. Authenticated Admin Console
  // ---------------------------------------------------------------------------
  const totalRevenue = orders.reduce((acc, o) => acc + (parseFloat(o.total_amount) || 0), 0);
  const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
  const pendingCount = orders.filter(
    (o) => (o.status || '').toLowerCase() === 'processing' || (o.status || '').toLowerCase() === 'pending'
  ).length;

  // Filter orders
  const filteredOrders = orders.filter((o) => {
    const matchesStatus =
      statusFilter === 'all' || (o.status || '').toLowerCase() === statusFilter.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      (o.id && o.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.shipping_details?.fullName &&
        o.shipping_details.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (o.shipping_details?.city &&
        o.shipping_details.city.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Top Console Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-card">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center shadow-sm">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-on-background tracking-tight">
                Admin Console
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-wider">
                Secret Access Active
              </span>
            </div>
            <p className="text-xs text-secondary mt-0.5">
              Live store fulfillment, order management, and PostgreSQL database tracking
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchAdminOrders}
            className="px-3.5 py-2 bg-surface-container-low hover:bg-surface-container-high text-on-surface font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>

          <button
            onClick={handleAdminLogout}
            className="px-3.5 py-2 bg-error-container/50 hover:bg-error-container text-error font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
          >
            <LogOut className="w-3.5 h-3.5" /> Lock & Exit
          </button>
        </div>
      </div>

      {/* KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-on-background">
            ${totalRevenue.toFixed(2)}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Across all completed orders
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-bold uppercase tracking-wider">Orders Recorded</span>
            <div className="w-9 h-9 rounded-xl bg-primary-fixed text-primary flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-on-background">
            {orders.length}
          </p>
          <p className="text-[11px] text-secondary">Synchronized to database</p>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Action</span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600">
            {pendingCount}
          </p>
          <p className="text-[11px] text-secondary">Awaiting dispatch/fulfillment</p>
        </div>

        <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft space-y-2">
          <div className="flex items-center justify-between text-secondary">
            <span className="text-xs font-bold uppercase tracking-wider">Average Order</span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-on-background">
            ${avgOrderValue.toFixed(2)}
          </p>
          <p className="text-[11px] text-secondary">Per customer checkout</p>
        </div>
      </div>

      {/* Order Management Section with Search & Tabs */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft space-y-6">
        
        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex gap-1 overflow-x-auto hide-scrollbar p-1 bg-surface-container-low rounded-2xl">
            {['all', 'processing', 'shipped', 'delivered', 'cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl capitalize transition-all shrink-0 ${
                  statusFilter === tab
                    ? 'bg-surface-container-lowest text-primary shadow-sm'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-outline absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or customer..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-surface-container-low border border-outline-variant/40 rounded-xl focus:outline-none focus:border-primary-container"
            />
          </div>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="py-16 text-center text-xs text-secondary">Loading records...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 text-center text-xs text-secondary">No matching orders found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-container-low text-secondary uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">Order ID</th>
                  <th className="p-3.5">Buyer Details</th>
                  <th className="p-3.5">Created Date</th>
                  <th className="p-3.5">Items</th>
                  <th className="p-3.5">Total Amount</th>
                  <th className="p-3.5 rounded-r-xl">Change Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-surface-container-low/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-primary">#{o.id}</td>
                    <td className="p-3.5">
                      <p className="font-bold text-on-background">{o.shipping_details?.fullName || 'Customer'}</p>
                      <p className="text-[11px] text-secondary">
                        {o.shipping_details?.city || 'City'}, {o.shipping_details?.country || 'Country'}
                      </p>
                    </td>
                    <td className="p-3.5 text-secondary">
                      {new Date(o.created_at || Date.now()).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="p-3.5 font-semibold text-on-surface">
                      {o.items ? `${o.items.length} items` : '1 item'}
                    </td>
                    <td className="p-3.5 font-black text-on-background">
                      ${parseFloat(o.total_amount).toFixed(2)}
                    </td>
                    <td className="p-3.5">
                      <select
                        value={o.status || 'processing'}
                        disabled={updatingId === o.id}
                        onChange={(e) => handleStatusChange(o.id, e.target.value)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                          o.status === 'delivered'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : o.status === 'shipped'
                            ? 'bg-blue-50 text-blue-800 border-blue-300'
                            : o.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
