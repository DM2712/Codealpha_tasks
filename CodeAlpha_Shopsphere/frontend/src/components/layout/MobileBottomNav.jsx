import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, ShoppingBag, Package, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const MobileBottomNav = () => {
  const location = useLocation();
  const { itemCount, openCart } = useCart();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Shop', path: '/products', icon: Compass },
    { name: 'Orders', path: '/orders', icon: Package },
    { name: 'Profile', path: '/profile', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-lg border-t border-outline-variant/30 px-3 py-2 flex items-center justify-around shadow-lg">
      {navItems.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-primary' : 'text-secondary hover:text-on-surface'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] font-semibold mt-1">{item.name}</span>
          </Link>
        );
      })}

      {/* Floating Center Cart Button */}
      <button
        onClick={openCart}
        className="relative -top-4 w-12 h-12 bg-primary-container text-on-primary rounded-full flex items-center justify-center shadow-lg border-4 border-surface hover:scale-105 active:scale-95 transition-all"
        aria-label="Cart"
      >
        <ShoppingBag className="w-5 h-5" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-error text-on-error text-[10px] font-bold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {navItems.slice(2).map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-primary' : 'text-secondary hover:text-on-surface'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
            <span className="text-[10px] font-semibold mt-1">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
};
