'use client';

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ZapLoaderSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ZapLoaderProps {
  size?: ZapLoaderSize;
  className?: string;
  text?: string;
}

const sizeStyles: Record<ZapLoaderSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

export function ZapLoader({ size = 'md', className, text }: ZapLoaderProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn('flex flex-col items-center justify-center gap-2', className)}
    >
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Zap size={sizeStyles[size]} className="text-primary fill-primary/20" />
      </motion.div>
      {text && <span className="text-sm text-text-muted">{text}</span>}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export default ZapLoader;
