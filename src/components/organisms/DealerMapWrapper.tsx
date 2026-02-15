'use client';

import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/atoms/Skeleton';
import type { DealerData } from './DealerCard';

// Dynamically import the map to avoid SSR issues with Leaflet
const DealerMap = dynamic(() => import('./DealerMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-surface rounded-lg">
      <div className="text-center">
        <Skeleton className="w-12 h-12 rounded-full mx-auto mb-4" />
        <Skeleton className="w-32 h-4 mx-auto" />
      </div>
    </div>
  ),
});

interface DealerMapWrapperProps {
  dealers: DealerData[];
  selectedDealer?: DealerData | null;
  onSelectDealer?: (dealer: DealerData) => void;
  center?: [number, number];
  zoom?: number;
}

export function DealerMapWrapper(props: DealerMapWrapperProps) {
  return <DealerMap {...props} />;
}

export default DealerMapWrapper;
