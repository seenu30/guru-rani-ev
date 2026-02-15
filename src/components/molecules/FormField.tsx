'use client';

import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface FormFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  children: ReactNode;
  htmlFor?: string;
}

export function FormField({
  label,
  error,
  helperText,
  required,
  className,
  children,
  htmlFor,
}: FormFieldProps) {
  const hasError = !!error;

  return (
    <div className={cn('space-y-1.5', className)}>
      {label && (
        <label
          htmlFor={htmlFor}
          className={cn(
            'block text-sm font-medium text-text-primary',
            hasError && 'text-error'
          )}
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {children}
      {(error || helperText) && (
        <p
          className={cn(
            'text-sm',
            error ? 'text-error' : 'text-text-muted'
          )}
          role={error ? 'alert' : undefined}
        >
          {error || helperText}
        </p>
      )}
    </div>
  );
}

export default FormField;
