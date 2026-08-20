import React from 'react';
import { Minus, Plus } from 'lucide-react';

export const QuantitySelector = ({ quantity = 1, onDecrease, onIncrease, max = 99, min = 1, size = 'md' }) => {
  const isSmall = size === 'sm';

  return (
    <div className={`inline-flex items-center rounded-xl bg-surface-container-low border border-outline-variant/40 ${isSmall ? 'p-0.5' : 'p-1'}`}>
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        className={`rounded-lg flex items-center justify-center text-on-surface hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-all ${
          isSmall ? 'w-6 h-6' : 'w-8 h-8'
        }`}
        aria-label="Decrease quantity"
      >
        <Minus className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      </button>

      <span className={`font-bold text-center text-on-surface select-none ${isSmall ? 'w-6 text-xs' : 'w-8 text-sm'}`}>
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        className={`rounded-lg flex items-center justify-center text-on-surface hover:bg-surface disabled:opacity-30 disabled:cursor-not-allowed transition-all ${
          isSmall ? 'w-6 h-6' : 'w-8 h-8'
        }`}
        aria-label="Increase quantity"
      >
        <Plus className={isSmall ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      </button>
    </div>
  );
};
