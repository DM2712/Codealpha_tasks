import React from 'react';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from '../ui/Skeleton';
import { ShoppingBag, RefreshCw } from 'lucide-react';

export const ProductGrid = ({ products = [], isLoading = false, error = null, onRetry, skeletonCount = 8 }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center max-w-md mx-auto p-6 bg-surface-container-lowest rounded-3xl border border-outline-variant/30">
        <p className="text-sm font-semibold text-error mb-4">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary rounded-xl text-sm font-bold hover:bg-primary transition-all"
          >
            <RefreshCw className="w-4 h-4" /> Try Again
          </button>
        )}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center max-w-md mx-auto p-8 bg-surface-container-lowest rounded-3xl border border-outline-variant/30 shadow-soft">
        <div className="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mx-auto mb-4 text-outline">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-on-background mb-1">No products found</h3>
        <p className="text-xs text-secondary mb-4">
          Try adjusting your search criteria, category, or filter options.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
