'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { TestRideForm } from '@/components/organisms/TestRideForm';
import { Heading, Text } from '@/components/atoms/Typography';
import { Skeleton } from '@/components/atoms/Skeleton';
import { Shield, Clock, Zap } from 'lucide-react';

function TestRideContent() {
  const searchParams = useSearchParams();
  const dealerId = searchParams.get('dealer') || undefined;
  const modelId = searchParams.get('model') || undefined;

  return (
    <TestRideForm
      preselectedDealer={dealerId}
      preselectedModel={modelId}
    />
  );
}

function FormSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-36 w-full rounded-lg" />
      <Skeleton className="h-48 w-full rounded-lg" />
    </div>
  );
}

const benefits = [
  {
    icon: Zap,
    title: 'Experience the Power',
    description: 'Feel the instant torque and smooth acceleration',
  },
  {
    icon: Shield,
    title: 'No Obligation',
    description: 'Free test ride with no pressure to buy',
  },
  {
    icon: Clock,
    title: 'Quick & Easy',
    description: 'Book online, ride within 48 hours',
  },
];

export default function TestRidePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <Section background="surface" className="pt-24 pb-12">
          <Container>
            <div className="max-w-2xl mx-auto text-center mb-12">
              <Heading level={1} className="mb-4">
                Book a Test Ride
              </Heading>
              <Text size="lg" color="muted">
                Experience the thrill of riding a Guru Rani electric scooter.
                Book your free test ride at a dealer near you.
              </Text>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-6 bg-white rounded-xl"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <benefit.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-text-primary mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-sm text-text-muted">{benefit.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Form Section */}
        <Section background="white" className="py-12">
          <Container size="md">
            <Suspense fallback={<FormSkeleton />}>
              <TestRideContent />
            </Suspense>
          </Container>
        </Section>

        {/* FAQ Preview */}
        <Section background="surface" className="py-12">
          <Container>
            <div className="max-w-2xl mx-auto">
              <Heading level={3} className="text-center mb-8">
                Frequently Asked Questions
              </Heading>
              <div className="space-y-4">
                <details className="group bg-white rounded-lg">
                  <summary className="flex justify-between items-center p-4 cursor-pointer list-none">
                    <span className="font-medium text-text-primary">
                      What do I need for a test ride?
                    </span>
                    <span className="text-primary group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-text-secondary">
                    Just bring a valid driving license. Our team will handle everything else.
                    You&apos;ll get a brief orientation before your ride.
                  </div>
                </details>

                <details className="group bg-white rounded-lg">
                  <summary className="flex justify-between items-center p-4 cursor-pointer list-none">
                    <span className="font-medium text-text-primary">
                      How long is the test ride?
                    </span>
                    <span className="text-primary group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-text-secondary">
                    Each test ride session is approximately 15-20 minutes,
                    giving you enough time to experience the scooter on different road conditions.
                  </div>
                </details>

                <details className="group bg-white rounded-lg">
                  <summary className="flex justify-between items-center p-4 cursor-pointer list-none">
                    <span className="font-medium text-text-primary">
                      Can I reschedule my booking?
                    </span>
                    <span className="text-primary group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <div className="px-4 pb-4 text-text-secondary">
                    Yes, you can reschedule up to 2 hours before your scheduled time.
                    Contact the dealer or use the link in your confirmation email.
                  </div>
                </details>
              </div>
              <div className="text-center mt-6">
                <a
                  href="/faq"
                  className="text-primary hover:underline font-medium"
                >
                  View all FAQs →
                </a>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
