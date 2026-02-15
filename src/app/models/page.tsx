import { Metadata } from 'next';
import { Navbar, Footer } from '@/components/organisms';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { ProductCard } from '@/components/organisms/ProductCard';
import { productsQueries } from '@/modules/products/products.queries';

export const metadata: Metadata = {
  title: 'Electric Scooter Models | Guru Rani',
  description:
    'Explore our range of electric scooters. From city commuters to performance machines, find the perfect Guru Rani for you.',
};

export default async function ModelsPage() {
  const products = await productsQueries.getAllForComparison();

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <Section className="bg-gradient-to-br from-accent to-primary text-white">
          <Container>
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-4">
                Our Electric Scooters
              </h1>
              <p className="text-lg text-white/80">
                Choose from our range of stylish, powerful, and eco-friendly electric scooters.
                Each model is designed for the modern Indian commuter.
              </p>
            </div>
          </Container>
        </Section>

        {/* Products Grid */}
        <Section>
          <Container>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  featured={index === 0}
                />
              ))}
            </div>
          </Container>
        </Section>

        {/* Compare CTA */}
        <Section className="bg-surface">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-text-primary mb-4">
                Not Sure Which Model to Choose?
              </h2>
              <p className="text-text-secondary mb-6">
                Compare our scooters side by side to find the perfect match for your needs.
              </p>
              <a
                href="/compare"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-button font-medium hover:bg-accent/90 transition-colors"
              >
                Compare Models
              </a>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
