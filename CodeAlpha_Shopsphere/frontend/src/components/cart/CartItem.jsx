import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { QuantitySelector } from '../product/QuantitySelector';
import { useCart } from '../../context/CartContext';

export const CartItem = ({ item, isDrawer = false }) => {
  const { updateQuantity, removeFromCart, closeCart } = useCart();

  if (!item) return null;

  return (
    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-surface-container-lowest rounded-2xl border border-outline-variant/30 transition-all hover:border-outline-variant/60">
      {/* Product Thumbnail */}
      <Link
        to={`/products/${item.id}`}
        onClick={isDrawer ? closeCart : undefined}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-surface-container-low overflow-hidden shrink-0 flex items-center justify-center p-2 border border-outline-variant/20"
      >
        <img
          src={item.image || 'https://via.placeholder.com/150'}
          alt={item.title}
          className="w-full h-full object-contain hover:scale-105 transition-transform"
        />
      </Link>

      {/* Item Details */}
      <div className="flex flex-col flex-1 justify-between min-w-0">
        <div>
          <div className="flex justify-between items-start gap-2">
            <Link
              to={`/products/${item.id}`}
              onClick={isDrawer ? closeCart : undefined}
              className="text-xs sm:text-sm font-bold text-on-background line-clamp-1 hover:text-primary transition-colors"
            >
              {item.title}
            </Link>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-outline hover:text-error transition-colors p-1"
              aria-label="Remove item"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-secondary capitalize mt-0.5">
            {item.category?.replace('-', ' ') || 'Item'}
          </p>
        </div>

        {/* Price & Quantity Controls */}
        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="flex flex-col">
            <span className="text-sm sm:text-base font-extrabold text-on-background">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
            {item.quantity > 1 && (
              <span className="text-[10px] text-outline">
                ${item.price.toFixed(2)} each
              </span>
            )}
          </div>

          <QuantitySelector
            quantity={item.quantity}
            onDecrease={() => updateQuantity(item.id, item.quantity - 1)}
            onIncrease={() => updateQuantity(item.id, item.quantity + 1)}
            max={item.stock || 50}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};
