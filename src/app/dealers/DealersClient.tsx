'use client';

import { useState } from 'react';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { DealerList } from '@/components/organisms/DealerList';
import { DealerMapWrapper } from '@/components/organisms/DealerMapWrapper';
import type { Dealer } from '@/types';
import type { DealerData } from '@/components/organisms/DealerCard';

interface DealersClientProps {
  dealers: Dealer[];
}

export function DealersClient({ dealers }: DealersClientProps) {
  const [selectedDealer, setSelectedDealer] = useState<DealerData | null>(null);

  // Transform Dealer to DealerData (they're compatible, just cast)
  const dealerData: DealerData[] = dealers;

  return (
    <Section background="white" className="py-8">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px]">
          {/* Map */}
          <div className="order-2 lg:order-1 h-[350px] lg:h-full">
            <DealerMapWrapper
              dealers={dealerData}
              selectedDealer={selectedDealer}
              onSelectDealer={setSelectedDealer}
            />
          </div>

          {/* Dealer List */}
          <div className="order-1 lg:order-2 h-[350px] lg:h-full bg-background rounded-lg border border-surface overflow-hidden">
            <DealerList
              dealers={dealerData}
              selectedDealer={selectedDealer}
              onSelectDealer={setSelectedDealer}
            />
          </div>
        </div>
      </Container>
    </Section>
  );
}
