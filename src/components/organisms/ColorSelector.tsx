'use client';

import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import type { Color } from '@/types';

interface ColorSelectorProps {
  colors: Color[];
  selectedColor: Color;
  onSelect: (color: Color) => void;
}

export function ColorSelector({
  colors,
  selectedColor,
  onSelect,
}: ColorSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-text-primary">
          Color
        </label>
        <span className="text-sm text-text-muted">{selectedColor.name}</span>
      </div>
      <div className="flex flex-wrap gap-3">
        {colors.map((color) => {
          const isSelected = color.id === selectedColor.id;
          const isLight =
            color.hex_code === '#ffffff' ||
            color.hex_code === '#f5f5f5' ||
            color.hex_code.toLowerCase() === '#fff';

          return (
            <button
              key={color.id}
              onClick={() => onSelect(color)}
              className={cn(
                'w-10 h-10 rounded-full transition-all relative',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
                isSelected && 'ring-2 ring-primary ring-offset-2',
                isLight && 'border border-gray-200'
              )}
              style={{ backgroundColor: color.hex_code }}
              title={color.name}
              aria-label={`Select ${color.name} color`}
            >
              {isSelected && (
                <Check
                  size={18}
                  className={cn(
                    'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
                    isLight ? 'text-text-primary' : 'text-white'
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default ColorSelector;
