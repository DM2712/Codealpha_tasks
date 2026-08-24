import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  if (!product) return null;

  const imageUrl = product.thumbnail || (product.images && product.images[0]) || 'https://via.placeholder.com/400?text=Product';
  const rating = product.rating || 4.5;
  const originalPrice = product.discountPercentage
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div className="group bg-surface-container-lowest rounded-xl sm:rounded-2xl border border-outline-variant/30 overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 flex flex-col h-full active:scale-[0.99]">
      {/* Image & Badges */}
      <div className="relative w-full aspect-square bg-surface-container-low/70 overflow-hidden flex items-center justify-center">
        {product.discountPercentage > 5 && (
          <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 bg-error text-on-error text-[9px] sm:text-[10px] font-black uppercase px-1.5 sm:px-2 py-0.5 rounded-full tracking-wider shadow-sm">
            {Math.round(product.discountPercentage)}% Off
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className={`absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all active:scale-90 ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 text-secondary hover:text-rose-600 hover:bg-white'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        <Link to={`/products/${product.id}`} className="block w-full h-full p-2 sm:p-4">
          <img
            src={imageUrl}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Content */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        <span className="text-[9px] sm:text-[11px] font-bold text-primary tracking-wider uppercase mb-0.5 line-clamp-1">
          {product.category?.replace('-', ' ') || 'General'}
        </span>

        <Link to={`/products/${product.id}`} className="block">
          <h3 className="font-bold text-xs sm:text-sm text-on-background line-clamp-2 hover:text-primary transition-colors leading-tight sm:leading-snug min-h-[30px] sm:min-h-[38px]">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-1 mb-2 text-secondary">
          <div className="flex items-center text-amber-500">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-[10px] sm:text-xs font-semibold text-on-surface">
            {typeof rating === 'number' ? rating.toFixed(1) : rating}
          </span>
          {product.reviews && (
            <span className="text-[9px] sm:text-[11px] text-outline">({product.reviews.length})</span>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-outline-variant/20 gap-1">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-xs sm:text-base font-black text-on-background truncate">
                ${product.price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-[9px] sm:text-xs text-outline line-through truncate">
                  ${originalPrice}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center transition-all shadow-sm shrink-0 active:scale-90 ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-primary-container text-on-primary hover:bg-primary'
            }`}
            aria-label="Add to cart"
            title="Add to Cart"
          >
            {isAdded ? (
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-scale-in" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
