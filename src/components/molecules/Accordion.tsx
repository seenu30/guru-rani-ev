'use client';

import { useState, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

// Context for accordion group
interface AccordionContextValue {
  openItems: string[];
  toggleItem: (id: string) => void;
  allowMultiple: boolean;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

// Accordion Group
export interface AccordionProps {
  children: React.ReactNode;
  defaultOpen?: string[];
  allowMultiple?: boolean;
  className?: string;
}

export function Accordion({
  children,
  defaultOpen = [],
  allowMultiple = false,
  className,
}: AccordionProps) {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      }
      if (allowMultiple) {
        return [...prev, id];
      }
      return [id];
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, allowMultiple }}>
      <div className={cn('divide-y divide-surface', className)}>{children}</div>
    </AccordionContext.Provider>
  );
}

// Accordion Item
export interface AccordionItemProps {
  id: string;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function AccordionItem({
  id,
  title,
  children,
  disabled = false,
  className,
}: AccordionItemProps) {
  const context = useContext(AccordionContext);

  if (!context) {
    throw new Error('AccordionItem must be used within an Accordion');
  }

  const { openItems, toggleItem } = context;
  const isOpen = openItems.includes(id);

  return (
    <div className={cn('py-1', className)}>
      <button
        type="button"
        onClick={() => !disabled && toggleItem(id)}
        disabled={disabled}
        className={cn(
          'w-full flex items-center justify-between py-4 text-left',
          'text-text-primary font-medium',
          'transition-colors duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          !disabled && 'hover:text-accent'
        )}
        aria-expanded={isOpen}
        aria-controls={`accordion-content-${id}`}
      >
        <span>{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-text-muted" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`accordion-content-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="pb-4 text-text-secondary">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Accordion;
