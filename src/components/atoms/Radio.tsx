'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, description, error, disabled, ...props }, ref) => {
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
            type="radio"
            disabled={disabled}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              'h-5 w-5 rounded-full border-2 border-surface',
              'transition-all duration-150 ease-out',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2',
              'peer-checked:border-accent',
              error && 'border-error',
              !disabled && 'hover:border-primary'
            )}
          />
          <div
            className={cn(
              'absolute h-2.5 w-2.5 rounded-full bg-accent',
              'scale-0 transition-transform duration-150',
              'peer-checked:scale-100'
            )}
          />
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

Radio.displayName = 'Radio';

export function RadioGroup({
  children,
  className,
  label,
  error,
  orientation = 'vertical',
}: {
  children: React.ReactNode;
  className?: string;
  label?: string;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
}) {
  return (
    <div role="radiogroup" className={className}>
      {label && (
        <div className="text-sm font-medium text-text-primary mb-3">{label}</div>
      )}
      <div
        className={cn(
          'flex gap-4',
          orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'
        )}
      >
        {children}
      </div>
      {error && <div className="text-sm text-error mt-2">{error}</div>}
    </div>
  );
}

export default Radio;
