import { cn } from '@/lib/utils';
import type { Variant } from '@/types';

interface SpecsTableProps {
  variant: Variant;
  className?: string;
}

interface SpecItem {
  label: string;
  value: string | number | null;
  unit?: string;
}

export function SpecsTable({ variant, className }: SpecsTableProps) {
  const specs: SpecItem[] = [
    { label: 'Range', value: variant.range_km, unit: 'km' },
    { label: 'Top Speed', value: variant.top_speed, unit: 'km/h' },
    { label: 'Battery', value: variant.battery },
    { label: 'Charging Time', value: variant.charging_time },
    { label: 'Motor Power', value: variant.motor_power },
    { label: 'Boot Space', value: variant.boot_space, unit: 'L' },
  ];

  return (
    <div className={cn('overflow-hidden rounded-lg border border-surface', className)}>
      <table className="w-full">
        <tbody>
          {specs.map((spec, index) => (
            <tr
              key={spec.label}
              className={cn(index % 2 === 0 ? 'bg-surface/50' : 'bg-white')}
            >
              <td className="px-4 py-3 text-sm text-text-muted font-medium">
                {spec.label}
              </td>
              <td className="px-4 py-3 text-sm text-text-primary font-semibold text-right">
                {spec.value !== null ? (
                  <>
                    {spec.value}
                    {spec.unit && <span className="text-text-muted ml-1">{spec.unit}</span>}
                  </>
                ) : (
                  <span className="text-text-muted">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SpecsTable;
