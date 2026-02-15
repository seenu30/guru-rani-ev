'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect();
        setCoords(calculatePosition(rect, position));
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Don't render portal on server
  if (typeof window === 'undefined') {
    return children;
  }

  return (
    <>
      {/* Trigger element */}
      <span
        ref={triggerRef as React.RefObject<HTMLSpanElement>}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </span>

      {/* Tooltip portal */}
      {createPortal(
        <AnimatePresence>
          {isVisible && (
            <motion.div
              role="tooltip"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.1 }}
              style={{
                position: 'fixed',
                left: coords.x,
                top: coords.y,
                zIndex: 50,
              }}
              className={cn(
                'px-3 py-1.5 text-sm text-white bg-accent rounded-md shadow-lg',
                'pointer-events-none whitespace-nowrap',
                className
              )}
            >
              {content}
              <TooltipArrow position={position} />
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

function TooltipArrow({ position }: { position: TooltipPosition }) {
  const arrowStyles: Record<TooltipPosition, string> = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-accent border-x-transparent border-b-transparent',
    bottom: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-accent border-x-transparent border-t-transparent',
    left: 'right-0 top-1/2 translate-x-full -translate-y-1/2 border-l-accent border-y-transparent border-r-transparent',
    right: 'left-0 top-1/2 -translate-x-full -translate-y-1/2 border-r-accent border-y-transparent border-l-transparent',
  };

  return (
    <div
      className={cn(
        'absolute w-0 h-0 border-4',
        arrowStyles[position]
      )}
    />
  );
}

function calculatePosition(
  rect: DOMRect,
  position: TooltipPosition
): { x: number; y: number } {
  const gap = 8;

  switch (position) {
    case 'top':
      return {
        x: rect.left + rect.width / 2,
        y: rect.top - gap,
      };
    case 'bottom':
      return {
        x: rect.left + rect.width / 2,
        y: rect.bottom + gap,
      };
    case 'left':
      return {
        x: rect.left - gap,
        y: rect.top + rect.height / 2,
      };
    case 'right':
      return {
        x: rect.right + gap,
        y: rect.top + rect.height / 2,
      };
    default:
      return { x: 0, y: 0 };
  }
}

export default Tooltip;
