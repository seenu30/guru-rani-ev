'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'filled';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  variant?: InputVariant;
  error?: boolean;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

const sizeStyles: Record<InputSize, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-base',
  lg: 'h-13 px-5 text-lg',
};

const variantStyles: Record<InputVariant, string> = {
  default: 'bg-white border border-surface',
  filled: 'bg-surface border border-transparent',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = 'text',
      size = 'md',
      variant = 'default',
      error = false,
      leftElement,
      rightElement,
      disabled,
      ...props
    },
    ref
  ) => {
    const hasLeftElement = !!leftElement;
    const hasRightElement = !!rightElement;

    return (
      <div className="relative w-full">
        {leftElement && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {leftElement}
          </div>
        )}
        <input
          ref={ref}
          type={type}
          disabled={disabled}
          className={cn(
            // Base styles
            'w-full rounded-input',
            'text-text-primary placeholder:text-text-muted',
            'transition-all duration-150 ease-out',
            // Focus state
            'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
            // Disabled state
            'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface',
            // Error state
            error && 'border-error focus:ring-error/20 focus:border-error',
            // Variant and size
            variantStyles[variant],
            sizeStyles[size],
            // Padding for elements
            hasLeftElement && 'pl-10',
            hasRightElement && 'pr-10',
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted">
            {rightElement}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
