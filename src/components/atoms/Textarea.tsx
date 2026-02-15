'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type TextareaVariant = 'default' | 'filled';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: TextareaVariant;
  error?: boolean;
}

const variantStyles: Record<TextareaVariant, string> = {
  default: 'bg-white border border-surface',
  filled: 'bg-surface border border-transparent',
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'default', error = false, disabled, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base styles
          'w-full min-h-[120px] px-4 py-3 rounded-input',
          'text-base text-text-primary placeholder:text-text-muted',
          'transition-all duration-150 ease-out',
          'resize-y',
          // Focus state
          'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
          // Disabled state
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-surface disabled:resize-none',
          // Error state
          error && 'border-error focus:ring-error/20 focus:border-error',
          // Variant
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
