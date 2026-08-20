import React from 'react';
import { SlidersHorizontal, X, ArrowDownUp, Check } from 'lucide-react';

export const ProductFilters = ({
  categories = [],
  selectedCategory = 'all',
  onSelectCategory,
  sortBy = '',
  order = 'asc',
  onSortChange,
  priceRange = [0, 2000],
  maxPrice = 2000,
  onPriceChange,
  totalResults = 0,
  onReset
}) => {
  const sortOptions = [
    { label: 'Featured / Default', value: '', order: 'asc' },
    { label: 'Price: Low to High', value: 'price', order: 'asc' },
    { label: 'Price: High to Low', value: 'price', order: 'desc' },
    { label: 'Highest Rated', value: 'rating', order: 'desc' }
  ];

  return (
    <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/30 shadow-soft space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h3 className="font-bold text-sm text-on-background">Filters & Sorting</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
        >
          <X className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Sort Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
          <ArrowDownUp className="w-3.5 h-3.5" /> Sort By
        </label>
        <select
          value={`${sortBy}:${order}`}
          onChange={(e) => {
            const [val, ord] = e.target.value.split(':');
            onSortChange(val, ord);
          }}
          className="w-full text-xs font-semibold bg-surface-container-low border border-outline-variant/40 rounded-xl px-3 py-2.5 text-on-surface focus:outline-none focus:border-primary-container"
        >
          {sortOptions.map((opt, idx) => (
            <option key={idx} value={`${opt.value}:${opt.order}`}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Categories */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-secondary">
          Categories
        </label>
        <div className="flex flex-col gap-1 max-h-56 overflow-y-auto pr-1">
          <button
            onClick={() => onSelectCategory('all')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-colors text-left ${
              selectedCategory === 'all'
                ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                : 'text-on-surface hover:bg-surface-container-low'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === 'all' && <Check className="w-3.5 h-3.5" />}
          </button>

          {categories.map((cat) => {
            const slug = typeof cat === 'object' ? cat.slug : cat;
            const name = typeof cat === 'object' ? cat.name : cat.replace(/-/g, ' ');
            const isSelected = selectedCategory === slug;

            return (
              <button
                key={slug}
                onClick={() => onSelectCategory(slug)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold capitalize transition-colors text-left ${
                  isSelected
                    ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                    : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span>{name}</span>
                {isSelected && <Check className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Slider */}
      {onPriceChange && (
        <div className="space-y-2 pt-2 border-t border-outline-variant/20">
          <div className="flex justify-between items-center text-xs">
            <span className="font-bold uppercase tracking-wider text-secondary">Max Price</span>
            <span className="font-extrabold text-primary">${priceRange[1]}</span>
          </div>
          <input
            type="range"
            min="10"
            max={maxPrice || 2000}
            step="10"
            value={priceRange[1]}
            onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value, 10)])}
            className="w-full accent-primary-container cursor-pointer"
          />
        </div>
      )}

      {/* Results Count */}
      <div className="pt-2 text-center text-xs text-secondary font-medium border-t border-outline-variant/20">
        Showing <strong>{totalResults}</strong> products
      </div>
    </div>
  );
};
