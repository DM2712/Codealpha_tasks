import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones
} from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-surface-container-lowest border-t border-outline-variant/30 text-on-surface mt-16">
      
      {/* 1. Trust Badges Rail */}
      <div className="border-b border-outline-variant/20 bg-surface-container-low/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-soft hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-on-background uppercase tracking-wider">Free Delivery</h4>
                <p className="text-xs text-secondary truncate">On orders exceeding $50</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-soft hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-on-background uppercase tracking-wider">Secure Payments</h4>
                <p className="text-xs text-secondary truncate">256-bit SSL encryption</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-soft hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-on-background uppercase tracking-wider">30-Day Returns</h4>
                <p className="text-xs text-secondary truncate">Hassle-free money back</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-surface-container-lowest border border-outline-variant/20 shadow-soft hover:shadow-card transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-on-background uppercase tracking-wider">24/7 Support</h4>
                <p className="text-xs text-secondary truncate">Dedicated customer care</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 2. Symmetrical 3-Column Grid for Remaining Elements */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Column 1: Brand & Tagline (6 cols) */}
          <div className="md:col-span-6 lg:col-span-6 space-y-4">
            <Link to="/" className="inline-flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary shadow-md group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-on-background group-hover:text-primary transition-colors">
                Shop<span className="text-primary-container">Sphere</span>
              </span>
            </Link>
            
            <p className="text-xs sm:text-sm text-secondary leading-relaxed max-w-md">
              Discover curated luxury essentials, cutting-edge consumer tech, and premium lifestyle items crafted for modern tastes.
            </p>
          </div>

          {/* Column 2: Categories (3 cols) */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-on-background">
              Categories
            </h5>
            <ul className="space-y-2.5 text-xs text-secondary">
              <li>
                <Link to="/products" className="hover:text-primary transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/products?category=beauty" className="hover:text-primary transition-colors">
                  Beauty & Cosmetics
                </Link>
              </li>
              <li>
                <Link to="/products?category=smartphones" className="hover:text-primary transition-colors">
                  Smartphones
                </Link>
              </li>
              <li>
                <Link to="/products?category=mens-watches" className="hover:text-primary transition-colors">
                  Luxury Watches
                </Link>
              </li>
              <li>
                <Link to="/products?category=furniture" className="hover:text-primary transition-colors">
                  Home & Decor
                </Link>
              </li>
              <li>
                <Link to="/products?category=fragrances" className="hover:text-primary transition-colors">
                  Fragrances
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Account & Help (3 cols) */}
          <div className="md:col-span-3 lg:col-span-3 space-y-3.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-on-background">
              Account & Help
            </h5>
            <ul className="space-y-2.5 text-xs text-secondary">
              <li>
                <Link to="/profile" className="hover:text-primary transition-colors">
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-primary transition-colors">
                  Track Orders
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-primary transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <span className="text-secondary/70 cursor-default">Help Center</span>
              </li>
              <li>
                <span className="text-secondary/70 cursor-default">Returns Policy</span>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* 3. Bottom Sub-Footer */}
      <div className="border-t border-outline-variant/20 bg-surface-container-low/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} <strong>ShopSphere</strong>. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Security</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
