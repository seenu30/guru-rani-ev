import { cn } from '@/lib/utils';

export type SectionPadding = 'sm' | 'md' | 'lg' | 'xl' | 'none';
export type SectionBackground = 'transparent' | 'white' | 'surface' | 'gradient';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  padding?: SectionPadding;
  background?: SectionBackground;
  as?: 'section' | 'div' | 'article';
}

const paddingStyles: Record<SectionPadding, string> = {
  none: '',
  sm: 'py-8 md:py-12',
  md: 'py-12 md:py-16',
  lg: 'py-16 md:py-20',
  xl: 'py-20 md:py-28',
};

const backgroundStyles: Record<SectionBackground, string> = {
  transparent: 'bg-transparent',
  white: 'bg-white',
  surface: 'bg-surface',
  gradient: 'bg-gradient-to-b from-background to-surface',
};

export function Section({
  className,
  padding = 'lg',
  background = 'transparent',
  as: Component = 'section',
  children,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(
        paddingStyles[padding],
        backgroundStyles[background],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default Section;
