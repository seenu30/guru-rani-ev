import { cn } from '@/lib/utils';

type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';

type TypographyVariant =
  | 'display'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'body'
  | 'body-sm'
  | 'caption'
  | 'overline';

type TypographyColor = 'primary' | 'secondary' | 'muted' | 'accent' | 'error' | 'success' | 'inherit';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  as?: TypographyElement;
  variant?: TypographyVariant;
  color?: TypographyColor;
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
}

const variantStyles: Record<TypographyVariant, string> = {
  display: 'text-5xl md:text-6xl lg:text-7xl leading-tight font-bold font-heading',
  h1: 'text-4xl md:text-5xl leading-tight font-bold font-heading',
  h2: 'text-3xl md:text-4xl leading-tight font-semibold font-heading',
  h3: 'text-2xl md:text-3xl leading-snug font-semibold font-heading',
  h4: 'text-xl md:text-2xl leading-snug font-semibold font-heading',
  body: 'text-base leading-relaxed',
  'body-sm': 'text-sm leading-relaxed',
  caption: 'text-xs leading-normal',
  overline: 'text-xs uppercase tracking-wider font-medium',
};

const colorStyles: Record<TypographyColor, string> = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary',
  muted: 'text-text-muted',
  accent: 'text-accent',
  error: 'text-error',
  success: 'text-success',
  inherit: 'text-inherit',
};

const weightStyles: Record<string, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const alignStyles: Record<string, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

// Default element for each variant
const variantElementMap: Record<TypographyVariant, TypographyElement> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  body: 'p',
  'body-sm': 'p',
  caption: 'span',
  overline: 'span',
};

export function Typography({
  as,
  variant = 'body',
  color = 'primary',
  weight,
  align,
  className,
  children,
  ...props
}: TypographyProps) {
  const Component = as || variantElementMap[variant];

  return (
    <Component
      className={cn(
        variantStyles[variant],
        colorStyles[color],
        weight && weightStyles[weight],
        align && alignStyles[align],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

// Convenience components
export function H1(props: Omit<TypographyProps, 'as' | 'variant'>) {
  return <Typography as="h1" variant="h1" {...props} />;
}

export function H2(props: Omit<TypographyProps, 'as' | 'variant'>) {
  return <Typography as="h2" variant="h2" {...props} />;
}

export function H3(props: Omit<TypographyProps, 'as' | 'variant'>) {
  return <Typography as="h3" variant="h3" {...props} />;
}

export function H4(props: Omit<TypographyProps, 'as' | 'variant'>) {
  return <Typography as="h4" variant="h4" {...props} />;
}

export function Text({
  size,
  ...props
}: Omit<TypographyProps, 'as' | 'variant'> & { size?: 'sm' | 'base' | 'lg' | 'xl' }) {
  const sizeMap = {
    sm: 'body-sm' as const,
    base: 'body' as const,
    lg: 'body' as const,
    xl: 'body' as const,
  };
  const variant = size ? sizeMap[size] : 'body';
  const sizeClass = size === 'lg' ? 'text-lg' : size === 'xl' ? 'text-xl' : '';
  return <Typography as="p" variant={variant} className={sizeClass} {...props} />;
}

// Flexible Heading component that maps level to variant
interface HeadingProps extends Omit<TypographyProps, 'as' | 'variant'> {
  level?: 1 | 2 | 3 | 4;
}

export function Heading({ level = 2, ...props }: HeadingProps) {
  const levelMap: Record<number, { as: TypographyElement; variant: TypographyVariant }> = {
    1: { as: 'h1', variant: 'h1' },
    2: { as: 'h2', variant: 'h2' },
    3: { as: 'h3', variant: 'h3' },
    4: { as: 'h4', variant: 'h4' },
  };
  const { as, variant } = levelMap[level];
  return <Typography as={as} variant={variant} {...props} />;
}

export default Typography;
