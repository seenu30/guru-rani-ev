'use client';

import { useState, createContext, useContext } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Context
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

// Tabs Container
export interface TabsProps {
  children: React.ReactNode;
  defaultTab: string;
  onChange?: (tabId: string) => void;
  className?: string;
}

export function Tabs({ children, defaultTab, onChange, className }: TabsProps) {
  const [activeTab, setActiveTabState] = useState(defaultTab);

  const setActiveTab = (id: string) => {
    setActiveTabState(id);
    onChange?.(id);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

// Tab List (container for tabs)
export interface TabListProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
}

export function TabList({ children, className, variant = 'default' }: TabListProps) {
  const variantStyles = {
    default: 'border-b border-surface',
    pills: 'bg-surface rounded-lg p-1',
    underline: 'border-b border-surface',
  };

  return (
    <div
      role="tablist"
      className={cn(
        'flex gap-1',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

// Individual Tab
export interface TabProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export function Tab({ id, children, disabled = false, className }: TabProps) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('Tab must be used within Tabs');
  }

  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === id;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${id}`}
      disabled={disabled}
      onClick={() => !disabled && setActiveTab(id)}
      className={cn(
        'relative px-4 py-2 text-sm font-medium rounded-md',
        'transition-colors duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        isActive ? 'text-accent' : 'text-text-muted hover:text-text-primary',
        className
      )}
    >
      {children}
      {isActive && (
        <motion.div
          layoutId="tab-indicator"
          className="absolute inset-x-0 -bottom-px h-0.5 bg-accent"
          transition={{ duration: 0.2 }}
        />
      )}
    </button>
  );
}

// Tab Panel (content for each tab)
export interface TabPanelProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function TabPanel({ id, children, className }: TabPanelProps) {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error('TabPanel must be used within Tabs');
  }

  const { activeTab } = context;
  const isActive = activeTab === id;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`tabpanel-${id}`}
      aria-labelledby={id}
      className={cn('mt-4', className)}
    >
      {children}
    </div>
  );
}

export default Tabs;
