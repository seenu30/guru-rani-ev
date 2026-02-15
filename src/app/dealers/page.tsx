import { Metadata } from 'next';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { Heading, Text } from '@/components/atoms/Typography';
import { dealersQueries } from '@/modules/dealers/dealers.queries';
import { DealersClient } from './DealersClient';

export const metadata: Metadata = {
  title: 'Find a Dealer | Guru Rani',
  description: 'Find a Guru Rani experience center near you. Test ride our electric scooters and get expert advice.',
};

export default async function DealersPage() {
  const dealers = await dealersQueries.getAll();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <Section background="surface" className="pt-24 pb-8">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <Heading level={1} className="mb-4">
                Find a Dealer
              </Heading>
              <Text size="lg" color="muted">
                Visit a Guru Rani experience center near you. Test ride our scooters
                and get expert advice from our team.
              </Text>
            </div>
          </Container>
        </Section>

        <DealersClient dealers={dealers} />

        {/* Contact CTA */}
        <Section background="surface" className="py-12">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <Heading level={3} className="mb-4">
                Can&apos;t find a dealer near you?
              </Heading>
              <Text color="muted" className="mb-6">
                We&apos;re expanding rapidly across India. Leave us your details and
                we&apos;ll notify you when we open in your city.
              </Text>
              <a
                href="/enquiry"
                className="inline-flex items-center justify-center h-11 px-6 font-medium rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
              >
                Get Notified
              </a>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
