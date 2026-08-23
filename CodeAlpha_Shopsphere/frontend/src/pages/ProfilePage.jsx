import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Shield,
  Package,
  ShoppingBag,
  LogOut,
  MapPin,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAppAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const ProfilePage = () => {
  const { user, userId, isSignedIn, signOut, isClerkMode, openUserProfile } = useAppAuth();
  const { itemCount } = useCart();

  if (!isSignedIn || !user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="pb-4 border-b border-outline-variant/30">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-on-background tracking-tight">
          My Profile & Account
        </h1>
        <p className="text-xs sm:text-sm text-secondary mt-0.5">
          Manage your account settings, addresses, and e-commerce preferences
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-card flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {user.imageUrl ? (
          <img
            src={user.imageUrl}
            alt={user.fullName || 'User'}
            className="w-24 h-24 rounded-3xl object-cover ring-4 ring-primary-fixed shrink-0 shadow-md"
          />
        ) : (
          <div className="w-24 h-24 rounded-3xl bg-primary-fixed text-primary font-black text-3xl flex items-center justify-center shrink-0 shadow-sm">
            {(user.fullName || 'U')[0]}
          </div>
        )}

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-on-background">
                {user.fullName || user.firstName || 'Shopper'}
              </h2>
              <p className="text-xs text-secondary flex items-center justify-center sm:justify-start gap-1 mt-0.5">
                <Mail className="w-3.5 h-3.5" />
                {user.primaryEmailAddress?.emailAddress || 'user@example.com'}
              </p>
            </div>

            <div className="pt-2 sm:pt-0">
              {isClerkMode && (
                <button
                  onClick={() => openUserProfile()}
                  className="px-4 py-2 bg-primary-container text-on-primary text-xs font-bold rounded-xl hover:bg-primary transition-all flex items-center gap-1.5 shadow-sm mx-auto sm:mx-0"
                >
                  <Shield className="w-3.5 h-3.5" /> Manage Account
                </button>
              )}
            </div>
          </div>

          <div className="pt-2">
            <span className="text-[11px] font-mono text-outline bg-surface-container-low px-2.5 py-1 rounded-md">
              User ID: {userId}
            </span>
          </div>
        </div>
      </div>

      {/* Quick Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/orders"
          className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft hover:shadow-card transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">My Orders</span>
            <p className="text-lg font-black text-on-background">View Purchases</p>
          </div>
        </Link>

        <Link
          to="/cart"
          className="p-5 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft hover:shadow-card transition-all flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-2xl bg-secondary-container text-secondary flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Active Cart</span>
            <p className="text-lg font-black text-on-background">{itemCount} items</p>
          </div>
        </Link>
      </div>

      {/* Saved Addresses Section */}
      <div className="p-6 rounded-3xl bg-surface-container-lowest border border-outline-variant/30 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-bold text-on-background">Default Shipping Address</h3>
          </div>
          <span className="text-xs font-bold text-emerald-600">Primary</span>
        </div>

        <div className="text-xs text-secondary space-y-1">
          <p className="font-bold text-on-surface text-sm">{user.fullName || 'Alex Morgan'}</p>
          <p>742 Evergreen Terrace</p>
          <p>Springfield, OR 97477</p>
          <p>United States</p>
          <p>Phone: +1 (555) 234-5678</p>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="pt-4 text-center">
        <button
          onClick={() => signOut()}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-error-container/40 text-error font-bold text-xs hover:bg-error-container transition-all"
        >
          <LogOut className="w-4 h-4" /> Sign Out of ShopSphere
        </button>
      </div>
    </div>
  );
};
