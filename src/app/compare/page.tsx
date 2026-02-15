import { Metadata } from 'next';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { Heading, Text } from '@/components/atoms/Typography';
import { productsQueries } from '@/modules/products/products.queries';
import { CompareClient } from './CompareClient';

export const metadata: Metadata = {
  title: 'Compare Electric Scooters | Guru Rani',
  description: 'Compare Guru Rani electric scooters side by side to find your perfect match.',
};

export default async function ComparePage() {
  const products = await productsQueries.getAllForComparison();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <Section background="surface" className="pt-24 pb-12">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <Heading level={1} className="mb-4">
                Compare Scooters
              </Heading>
              <Text size="lg" color="muted">
                Not sure which Guru Rani is right for you? Compare up to 3 models
                side-by-side to find your perfect match.
              </Text>
            </div>
          </Container>
        </Section>

        <CompareClient products={products} />
      </main>
      <Footer />
    </>
  );
}
