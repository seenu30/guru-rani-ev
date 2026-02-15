'use client';

import { forwardRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: SelectSize;
  error?: boolean;
  options?: SelectOption[];
  placeholder?: string;
  children?: ReactNode;
}

const sizeStyles: Record<SelectSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-base',
  lg: 'h-13 px-5 text-lg',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      size = 'md',
      error = false,
      options,
      placeholder,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          disabled={disabled}
          className={cn(
            // Base styles
            'w-full rounded-input appearance-none',
            'bg-white border border-surface',
            'text-text-primary',
            'transition-all duration-150 ease-out',
            'pr-10', // Space for chevron
            // Focus state
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            // Disabled state
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface',
            // Error state
            error && 'border-error focus:ring-error/20 focus:border-error',
            // Size
            sizeStyles[size],
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
          {options?.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className={cn(
            'absolute right-3 top-1/2 -translate-y-1/2',
            'h-5 w-5 text-text-muted pointer-events-none',
            disabled && 'opacity-50'
          )}
        />
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;
