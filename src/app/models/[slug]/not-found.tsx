import Link from 'next/link';
import { Navbar, Footer } from '@/components/organisms';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { Button } from '@/components/atoms/Button';

export default function ModelNotFound() {
  return (
    <>
      <Navbar />
      <main className="pt-20 min-h-screen">
        <Section>
          <Container>
            <div className="text-center py-20">
              <h1 className="text-2xl font-heading font-bold text-text-primary mb-4">
                Model Not Found
              </h1>
              <p className="text-text-muted mb-6">
                The scooter model you&apos;re looking for doesn&apos;t exist.
              </p>
              <Link href="/models">
                <Button>View All Models</Button>
              </Link>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
