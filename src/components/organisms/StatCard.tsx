'use client';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/molecules/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  index?: number;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel = 'vs last month',
  icon,
  index = 0,
}: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card variant="default" className="p-6">
        <div className="flex items-start justify-between mb-4">
          <span className="text-text-muted text-sm font-medium">{title}</span>
          {icon && (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {icon}
            </div>
          )}
        </div>

        <p className="text-3xl font-heading font-bold text-text-primary mb-2">
          {value}
        </p>

        {change !== undefined && (
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-sm font-medium ${
                isPositive
                  ? 'text-success'
                  : isNegative
                  ? 'text-error'
                  : 'text-text-muted'
              }`}
            >
              {isPositive ? (
                <TrendingUp size={16} />
              ) : isNegative ? (
                <TrendingDown size={16} />
              ) : (
                <Minus size={16} />
              )}
              {isPositive && '+'}
              {change}%
            </span>
            <span className="text-xs text-text-muted">{changeLabel}</span>
          </div>
        )}
      </Card>
    </motion.div>
  );
}

export default StatCard;
