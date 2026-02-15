import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
}

const variantStyles: Record<AlertVariant, { container: string; icon: string }> = {
  info: {
    container: 'bg-info/10 border-info/20 text-info',
    icon: 'text-info',
  },
  success: {
    container: 'bg-success/10 border-success/20 text-success',
    icon: 'text-success',
  },
  warning: {
    container: 'bg-warning/10 border-warning/20 text-warning',
    icon: 'text-warning',
  },
  error: {
    container: 'bg-error/10 border-error/20 text-error',
    icon: 'text-error',
  },
};

const variantIcons: Record<AlertVariant, React.ReactNode> = {
  info: <Info className="h-5 w-5" />,
  success: <CheckCircle className="h-5 w-5" />,
  warning: <AlertTriangle className="h-5 w-5" />,
  error: <AlertCircle className="h-5 w-5" />,
};

export function Alert({
  className,
  variant = 'info',
  title,
  dismissible = false,
  onDismiss,
  icon,
  children,
  ...props
}: AlertProps) {
  const styles = variantStyles[variant];
  const defaultIcon = variantIcons[variant];

  return (
    <div
      role="alert"
      className={cn(
        'relative flex gap-3 p-4 rounded-lg border',
        styles.container,
        className
      )}
      {...props}
    >
      <div className={cn('flex-shrink-0 mt-0.5', styles.icon)}>
        {icon || defaultIcon}
      </div>
      <div className="flex-1 min-w-0">
        {title && (
          <h5 className="font-medium text-text-primary mb-1">{title}</h5>
        )}
        <div className="text-sm text-text-primary/90">{children}</div>
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className={cn(
            'flex-shrink-0 p-1 rounded-md',
            'hover:bg-black/5 transition-colors',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-current'
          )}
          aria-label="Dismiss alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export default Alert;
