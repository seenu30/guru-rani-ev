import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  label?: string;
}

export function Divider({
  className,
  orientation = 'horizontal',
  variant = 'solid',
  label,
  ...props
}: DividerProps) {
  const isHorizontal = orientation === 'horizontal';

  const variantStyles = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
  };

  if (label && isHorizontal) {
    return (
      <div className={cn('flex items-center gap-4', className)} {...props}>
        <div
          className={cn(
            'flex-1 border-t border-surface',
            variantStyles[variant]
          )}
        />
        <span className="text-sm text-text-muted">{label}</span>
        <div
          className={cn(
            'flex-1 border-t border-surface',
            variantStyles[variant]
          )}
        />
      </div>
    );
  }

  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'border-surface',
        variantStyles[variant],
        isHorizontal ? 'border-t w-full' : 'border-l h-full',
        className
      )}
      {...props}
    />
  );
}

export default Divider;
