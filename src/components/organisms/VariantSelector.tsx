'use client';

import { cn } from '@/lib/utils';
import type { Variant, Color } from '@/types';

type VariantWithColors = Variant & { colors: Color[] };

interface VariantSelectorProps {
  variants: VariantWithColors[];
  selectedVariant: VariantWithColors;
  onSelect: (variant: VariantWithColors) => void;
}

export function VariantSelector({
  variants,
  selectedVariant,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text-primary">
        Select Variant
      </label>
      <div className="flex flex-wrap gap-3">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedVariant.id;

          return (
            <button
              key={variant.id}
              onClick={() => onSelect(variant)}
              className={cn(
                'px-4 py-3 rounded-lg border-2 transition-all text-left',
                isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-surface hover:border-primary/50'
              )}
            >
              <span className="block font-semibold text-text-primary">
                {variant.name}
              </span>
              <span className="block text-sm text-primary font-medium">
                ₹{variant.price.toLocaleString('en-IN')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default VariantSelector;
