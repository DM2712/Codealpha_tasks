import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag, Heart, Eye } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isWishlisted, setIsWishlisted] = useState(false);

  if (!product) return null;

  const imageUrl = product.thumbnail || (product.images && product.images[0]) || 'https://via.placeholder.com/400?text=Product';
  const rating = product.rating || 4.5;
  const originalPrice = product.discountPercentage
    ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
    : null;

  return (
    <div className="group bg-surface-container-lowest rounded-2xl border border-outline-variant/30 overflow-hidden shadow-soft hover:shadow-card transition-all duration-300 flex flex-col h-full">
      {/* Image & Badges */}
      <div className="relative w-full aspect-square bg-surface-container-low overflow-hidden">
        {product.discountPercentage > 5 && (
          <span className="absolute top-2.5 left-2.5 z-10 bg-error/90 text-on-error text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md tracking-wider shadow-sm">
            {Math.round(product.discountPercentage)}% Off
          </span>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsWishlisted(!isWishlisted);
          }}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-surface/80 text-secondary hover:text-rose-600 hover:bg-surface'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        <Link to={`/products/${product.id}`} className="block w-full h-full">
          <img
            src={imageUrl}
            alt={product.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-contain p-4 group-hover:scale-108 transition-transform duration-500"
          />
        </Link>

        {/* Quick View overlay on hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <Link
            to={`/products/${product.id}`}
            className="px-3 py-1.5 bg-white/95 text-xs font-bold text-on-background rounded-xl hover:bg-white shadow-sm flex items-center gap-1 transition-all"
          >
            <Eye className="w-3.5 h-3.5" /> View Details
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-[11px] font-bold text-primary tracking-wider uppercase mb-1 line-clamp-1">
          {product.category?.replace('-', ' ') || 'General'}
        </span>

        <Link to={`/products/${product.id}`}>
          <h3 className="font-bold text-sm text-on-background line-clamp-2 hover:text-primary transition-colors min-h-[40px]">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mt-1.5 mb-3">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-xs font-semibold text-on-surface">
            {typeof rating === 'number' ? rating.toFixed(1) : rating}
          </span>
          {product.reviews && (
            <span className="text-[11px] text-outline">({product.reviews.length})</span>
          )}
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-outline-variant/20">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-on-background">
                ${product.price.toFixed(2)}
              </span>
              {originalPrice && (
                <span className="text-xs text-outline line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="w-9 h-9 rounded-xl bg-primary-container text-on-primary flex items-center justify-center hover:bg-primary active:scale-95 transition-all shadow-sm group/btn"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
