import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  User,
  Package,
  Shield,
  Menu,
  X,
  LogOut,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAppAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { itemCount, openCart } = useCart();
  const { isSignedIn, user, openSignIn, signIn, signOut, isClerkMode } = useAppAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileNavOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'My Orders', path: '/orders' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-surface/90 border-b border-outline-variant/30 shadow-sm transition-all">
      {/* Top Notification Announcement */}
      <div className="bg-primary text-on-primary py-1.5 px-4 text-center text-xs font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-primary-fixed" />
        <span>Use code <strong>SHOPSPHERE10</strong> for 10% off • Free express shipping on orders over $50</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Mobile menu trigger */}
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            className="md:hidden p-2 text-on-surface-variant hover:text-on-surface focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-primary-container flex items-center justify-center text-on-primary shadow-md group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-on-background group-hover:text-primary transition-colors">
                Shop<span className="text-primary-container">Sphere</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-primary bg-primary-fixed/40'
                      : 'text-secondary hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar (Desktop) */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden lg:flex flex-1 max-w-md mx-4 relative items-center"
          >
            <Search className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products, brands, categories..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-surface-container-low border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all placeholder:text-outline"
            />
          </form>

          {/* Right Actions: Cart & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-xl text-on-surface hover:bg-surface-container-low active:scale-95 transition-all"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-6 h-6 text-on-surface" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-container text-on-primary text-[11px] font-bold h-5 min-w-[20px] px-1 rounded-full flex items-center justify-center shadow-sm animate-fade-in">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>

            {/* Auth Button / Profile Menu */}
            {isSignedIn ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-surface-container-low transition-all"
                >
                  {user?.imageUrl ? (
                    <img
                      src={user.imageUrl}
                      alt={user.fullName || 'User'}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-fixed"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed font-bold text-xs flex items-center justify-center">
                      {(user?.fullName || user?.firstName || 'U')[0].toUpperCase()}
                    </div>
                  )}
                  <span className="hidden sm:inline text-xs font-semibold text-on-surface max-w-[100px] truncate">
                    {user?.firstName || user?.fullName || 'Account'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-surface-container-lowest rounded-2xl shadow-elevated border border-outline-variant/30 py-2 z-50 animate-slide-up"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-outline-variant/20">
                      <p className="text-xs font-medium text-secondary">Signed in as</p>
                      <p className="text-sm font-bold text-on-surface truncate">
                        {user?.primaryEmailAddress?.emailAddress || user?.fullName || 'User'}
                      </p>
                    </div>

                    <Link
                      to="/profile"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      <User className="w-4 h-4 text-secondary" /> My Profile
                    </Link>

                    <Link
                      to="/orders"
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      <Package className="w-4 h-4 text-secondary" /> My Orders
                    </Link>

                    <div className="border-t border-outline-variant/20 my-1"></div>

                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-error hover:bg-error-container/20 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {isClerkMode ? (
                  <button
                    onClick={() => openSignIn()}
                    className="px-4 py-2 text-xs sm:text-sm font-semibold bg-primary-container text-on-primary rounded-xl hover:bg-primary transition-all shadow-sm"
                  >
                    Sign In
                  </button>
                ) : (
                  <button
                    onClick={() => signIn()}
                    className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold bg-primary-container text-on-primary rounded-xl hover:bg-primary transition-all shadow-sm flex items-center gap-1.5"
                  >
                    <User className="w-4 h-4" /> Sign In
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <div className="pb-3 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-outline absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-surface-container-low border border-outline-variant/50 rounded-xl focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container"
            />
          </form>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileNavOpen && (
        <div className="md:hidden border-t border-outline-variant/30 bg-surface px-4 py-4 space-y-2 animate-slide-up">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsMobileNavOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-base font-semibold text-on-surface hover:bg-surface-container-low"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};
