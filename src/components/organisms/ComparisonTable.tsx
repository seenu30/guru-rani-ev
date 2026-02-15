'use client';

import { motion } from 'framer-motion';
import { Check, X, Minus } from 'lucide-react';
import type { CompareSelection } from './CompareSelector';

interface ComparisonTableProps {
  selections: CompareSelection[];
}

interface SpecRow {
  label: string;
  key: string;
  format?: (value: unknown) => string;
  highlight?: 'max' | 'min';
}

const specRows: SpecRow[] = [
  { label: 'Price', key: 'price', format: (v) => `₹${(v as number).toLocaleString('en-IN')}`, highlight: 'min' },
  { label: 'Range', key: 'range_km', format: (v) => `${v} km`, highlight: 'max' },
  { label: 'Top Speed', key: 'top_speed', format: (v) => `${v} km/h`, highlight: 'max' },
  { label: 'Battery', key: 'battery' },
  { label: 'Charging Time', key: 'charging_time' },
  { label: 'Motor Power', key: 'motor_power' },
  { label: 'Boot Space', key: 'boot_space', format: (v) => v ? `${v} L` : '-', highlight: 'max' },
];

function getHighlightIndex(
  values: (number | null | undefined)[],
  type: 'max' | 'min'
): number {
  const validValues = values.map((v, i) => ({ v: v ?? -Infinity, i })).filter(x => x.v !== -Infinity);
  if (validValues.length === 0) return -1;

  const target = type === 'max'
    ? Math.max(...validValues.map(x => x.v))
    : Math.min(...validValues.map(x => x.v));

  return validValues.find(x => x.v === target)?.i ?? -1;
}

export function ComparisonTable({ selections }: ComparisonTableProps) {
  if (selections.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted">
        <p>Select at least one scooter to see comparison</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-x-auto"
    >
      <table className="w-full">
        <thead>
          <tr className="border-b border-surface">
            <th className="text-left py-4 px-4 font-medium text-text-muted w-1/4">
              Specification
            </th>
            {selections.map((selection) => (
              <th
                key={`${selection.product.id}-${selection.variant.id}`}
                className="text-center py-4 px-4 font-heading font-semibold text-text-primary"
              >
                {selection.product.name}
                <span className="block text-sm font-normal text-text-muted">
                  {selection.variant.name}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specRows.map((row, rowIndex) => {
            const values = selections.map((s) => {
              const val = s.variant[row.key as keyof typeof s.variant];
              return typeof val === 'number' ? val : null;
            });
            const highlightIdx = row.highlight ? getHighlightIndex(values, row.highlight) : -1;

            return (
              <motion.tr
                key={row.key}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: rowIndex * 0.05 }}
                className="border-b border-surface/50 hover:bg-surface/30 transition-colors"
              >
                <td className="py-4 px-4 font-medium text-text-secondary">
                  {row.label}
                </td>
                {selections.map((selection, idx) => {
                  const value = selection.variant[row.key as keyof typeof selection.variant];
                  const displayValue = row.format ? row.format(value) : String(value ?? '-');
                  const isHighlighted = idx === highlightIdx;

                  return (
                    <td
                      key={`${selection.product.id}-${selection.variant.id}-${row.key}`}
                      className={`text-center py-4 px-4 ${
                        isHighlighted ? 'text-accent font-semibold' : 'text-text-primary'
                      }`}
                    >
                      {displayValue}
                      {isHighlighted && (
                        <span className="ml-2 inline-flex items-center justify-center w-5 h-5 rounded-full bg-success/20 text-success">
                          <Check size={12} />
                        </span>
                      )}
                    </td>
                  );
                })}
              </motion.tr>
            );
          })}

          {/* Colors row */}
          <motion.tr
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: specRows.length * 0.05 }}
            className="border-b border-surface/50"
          >
            <td className="py-4 px-4 font-medium text-text-secondary">
              Available Colors
            </td>
            {selections.map((selection) => (
              <td
                key={`${selection.product.id}-${selection.variant.id}-colors`}
                className="py-4 px-4"
              >
                <div className="flex justify-center gap-2 flex-wrap">
                  {selection.variant.colors.map((color) => (
                    <div
                      key={color.id}
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: color.hex_code }}
                      title={color.name}
                    />
                  ))}
                </div>
              </td>
            ))}
          </motion.tr>
        </tbody>
      </table>

      {/* Summary cards on mobile */}
      <div className="md:hidden mt-8 space-y-4">
        {selections.map((selection) => (
          <div
            key={`summary-${selection.product.id}-${selection.variant.id}`}
            className="p-4 bg-surface rounded-lg"
          >
            <h4 className="font-heading font-semibold text-text-primary mb-3">
              {selection.product.name} - {selection.variant.name}
            </h4>
            <dl className="space-y-2">
              {specRows.map((row) => {
                const value = selection.variant[row.key as keyof typeof selection.variant];
                const displayValue = row.format ? row.format(value) : String(value ?? '-');
                return (
                  <div key={row.key} className="flex justify-between text-sm">
                    <dt className="text-text-muted">{row.label}</dt>
                    <dd className="font-medium text-text-primary">{displayValue}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default ComparisonTable;
