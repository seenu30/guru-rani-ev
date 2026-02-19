'use client';

import { useState } from 'react';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { CompareSelector, type CompareSelection } from '@/components/organisms/CompareSelector';
import { ComparisonTable } from '@/components/organisms/ComparisonTable';
import { Heading, Text } from '@/components/atoms/Typography';
import type { ProductWithVariants } from '@/modules/products/products.queries';

interface CompareClientProps {
  products: ProductWithVariants[];
}

export function CompareClient({ products }: CompareClientProps) {
  const [selections, setSelections] = useState<CompareSelection[]>([]);

  return (
    <>
      {/* Selector Section */}
      <Section background="white" className="py-12">
        <Container>
          <div className="mb-8">
            <Heading level={3} className="mb-2">
              Select Scooters to Compare
            </Heading>
            <Text color="muted">
              Click on the slots below to add scooters for comparison
            </Text>
          </div>
          <CompareSelector
            products={products}
            maxSlots={3}
            onSelectionChange={setSelections}
          />
        </Container>
      </Section>

      {/* Comparison Table Section */}
      <Section background="surface" className="py-12">
        <Container>
          <div className="mb-8">
            <Heading level={3}>Detailed Comparison</Heading>
          </div>
          <ComparisonTable selections={selections} />
        </Container>
      </Section>

      {/* Help CTA */}
      {selections.length > 0 && (
        <Section background="white" className="py-12">
          <Container>
            <div className="text-center bg-primary/5 rounded-2xl p-8">
              <Heading level={4} className="mb-3">
                Still need help deciding?
              </Heading>
              <Text color="muted" className="mb-6">
                Our experts are here to help you choose the perfect Guru Rani for your needs.
              </Text>
              <div className="flex justify-center gap-4 flex-wrap">
                <a
                  href="/enquiry"
                  className="inline-flex items-center justify-center h-11 px-6 font-medium rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
                >
                  Get a Quote
                </a>
                <a
                  href="/dealers"
                  className="inline-flex items-center justify-center h-11 px-6 font-medium rounded-lg border-2 border-accent text-accent hover:bg-accent hover:text-white transition-colors"
                >
                  Find a Dealer
                </a>
              </div>
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
