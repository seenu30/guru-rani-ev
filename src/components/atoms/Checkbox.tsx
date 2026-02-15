'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Check, Minus } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      description,
      error,
      indeterminate = false,
      disabled,
      checked,
      ...props
    },
    ref
  ) => {
    return (
      <label
        className={cn(
          'flex items-start gap-3 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50',
          className
        )}
      >
        <div className="relative flex items-center justify-center pt-0.5">
          <input
            ref={ref}
            type="checkbox"
            disabled={disabled}
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'h-5 w-5 rounded border-2 border-surface',
              'transition-all duration-150 ease-out',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2',
              'peer-checked:bg-accent peer-checked:border-accent',
              indeterminate && 'bg-accent border-accent',
              error && 'border-error',
              !disabled && 'hover:border-primary'
            )}
          />
          {(checked || indeterminate) && (
            <div className="absolute text-white">
              {indeterminate ? (
                <Minus className="h-3.5 w-3.5" strokeWidth={3} />
              ) : (
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              )}
            </div>
          )}
        </div>
        {(label || description) && (
          <div className="flex flex-col">
            {label && (
              <span className="text-sm font-medium text-text-primary">
                {label}
              </span>
            )}
            {description && (
              <span className="text-sm text-text-muted">{description}</span>
            )}
            {error && <span className="text-sm text-error mt-1">{error}</span>}
          </div>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
