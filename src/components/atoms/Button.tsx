'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'link';

export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-accent text-white',
    'hover:bg-accent/90',
    'active:bg-accent/80',
    'shadow-button'
  ),
  secondary: cn(
    'bg-primary text-white',
    'hover:bg-primary/90',
    'active:bg-primary/80'
  ),
  outline: cn(
    'border-2 border-accent text-accent bg-transparent',
    'hover:bg-accent hover:text-white',
    'active:bg-accent/90'
  ),
  ghost: cn(
    'text-accent bg-transparent',
    'hover:bg-surface',
    'active:bg-surface/80'
  ),
  destructive: cn(
    'bg-error text-white',
    'hover:bg-error/90',
    'active:bg-error/80'
  ),
  link: cn(
    'text-primary underline-offset-4 bg-transparent p-0 h-auto',
    'hover:underline',
    'active:text-accent'
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-6 text-base gap-2',
  lg: 'h-13 px-8 text-lg gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'font-medium rounded-button',
          'transition-all duration-200 ease-out',
          // Focus state
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',
          // Disabled state
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          // Variant and size
          variantStyles[variant],
          variant !== 'link' && sizeStyles[size],
          // Full width
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
