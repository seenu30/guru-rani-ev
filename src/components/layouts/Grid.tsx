import { cn } from '@/lib/utils';

export type GridCols = 1 | 2 | 3 | 4 | 5 | 6 | 12;
export type GridGap = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: GridCols;
  colsMd?: GridCols;
  colsLg?: GridCols;
  gap?: GridGap;
}

const colStyles: Record<GridCols, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  12: 'grid-cols-12',
};

const colMdStyles: Record<GridCols, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  12: 'md:grid-cols-12',
};

const colLgStyles: Record<GridCols, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  12: 'lg:grid-cols-12',
};

const gapStyles: Record<GridGap, string> = {
  none: 'gap-0',
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

export function Grid({
  className,
  cols = 1,
  colsMd,
  colsLg,
  gap = 'md',
  children,
  ...props
}: GridProps) {
  return (
    <div
      className={cn(
        'grid',
        colStyles[cols],
        colsMd && colMdStyles[colsMd],
        colsLg && colLgStyles[colsLg],
        gapStyles[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default Grid;
