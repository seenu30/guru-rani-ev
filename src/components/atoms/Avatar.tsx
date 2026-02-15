import { cn } from '@/lib/utils';
import { getInitials } from '@/lib/utils';
import Image from 'next/image';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  fallback?: React.ReactNode;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; imgSize: number }> = {
  xs: { container: 'h-6 w-6', text: 'text-xs', imgSize: 24 },
  sm: { container: 'h-8 w-8', text: 'text-xs', imgSize: 32 },
  md: { container: 'h-10 w-10', text: 'text-sm', imgSize: 40 },
  lg: { container: 'h-12 w-12', text: 'text-base', imgSize: 48 },
  xl: { container: 'h-16 w-16', text: 'text-lg', imgSize: 64 },
};

export function Avatar({
  className,
  src,
  alt,
  name,
  size = 'md',
  fallback,
  ...props
}: AvatarProps) {
  const { container, text, imgSize } = sizeStyles[size];
  const initials = name ? getInitials(name) : null;

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center',
        'rounded-full bg-surface overflow-hidden',
        'ring-2 ring-white',
        container,
        className
      )}
      {...props}
    >
      {src ? (
        <Image
          src={src}
          alt={alt || name || 'Avatar'}
          width={imgSize}
          height={imgSize}
          className="h-full w-full object-cover"
        />
      ) : fallback ? (
        fallback
      ) : initials ? (
        <span className={cn('font-medium text-accent', text)}>{initials}</span>
      ) : (
        <svg
          className={cn('text-text-muted', text)}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      )}
    </div>
  );
}

export function AvatarGroup({
  children,
  max = 4,
  size = 'md',
  className,
}: {
  children: React.ReactNode;
  max?: number;
  size?: AvatarSize;
  className?: string;
}) {
  const avatars = Array.isArray(children) ? children : [children];
  const visibleAvatars = avatars.slice(0, max);
  const remainingCount = avatars.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visibleAvatars}
      {remainingCount > 0 && (
        <Avatar
          size={size}
          name={`+${remainingCount}`}
          className="bg-primary text-white ring-2 ring-white"
        />
      )}
    </div>
  );
}

export default Avatar;
