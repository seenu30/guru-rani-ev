import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { FAQAccordion } from '@/components/organisms/FAQAccordion';
import { Heading, Text } from '@/components/atoms/Typography';
import { faqsQueries } from '@/modules/faqs/faqs.queries';
import { HelpCircle, MessageCircle, Phone } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ - Frequently Asked Questions',
  description:
    'Find answers to common questions about Guru Rani electric scooters, including ownership, charging, battery, subsidies, and more.',
};

const supportChannels = [
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Mon-Sat, 9AM-7PM',
    action: 'tel:+911800123456',
    actionLabel: '1800-123-456',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    description: 'Quick responses',
    action: 'https://wa.me/911234567890',
    actionLabel: 'Chat Now',
  },
  {
    icon: HelpCircle,
    title: 'Email Support',
    description: 'Detailed queries',
    action: 'mailto:support@gururani.in',
    actionLabel: 'support@gururani.in',
  },
];

export default async function FAQPage() {
  const faqCategories = await faqsQueries.getByCategory();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <Section background="surface" className="pt-24 pb-12">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <Heading level={1} className="mb-4">
                Frequently Asked Questions
              </Heading>
              <Text size="lg" color="muted">
                Everything you need to know about Guru Rani electric scooters.
                Can&apos;t find what you&apos;re looking for? Contact our support team.
              </Text>
            </div>
          </Container>
        </Section>

        {/* FAQ Content */}
        <Section background="white" className="py-12">
          <Container size="md">
            <FAQAccordion categories={faqCategories} />
          </Container>
        </Section>

        {/* Still Have Questions */}
        <Section background="surface" className="py-12">
          <Container>
            <div className="text-center mb-8">
              <Heading level={3}>Still have questions?</Heading>
              <Text color="muted" className="mt-2">
                Our support team is here to help you
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {supportChannels.map((channel, index) => (
                <a
                  key={index}
                  href={channel.action}
                  className="flex flex-col items-center text-center p-6 bg-white rounded-xl hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <channel.icon size={24} className="text-primary" />
                  </div>
                  <h4 className="font-heading font-semibold text-text-primary mb-1">
                    {channel.title}
                  </h4>
                  <p className="text-sm text-text-muted mb-3">
                    {channel.description}
                  </p>
                  <span className="text-primary font-medium group-hover:underline">
                    {channel.actionLabel}
                  </span>
                </a>
              ))}
            </div>
          </Container>
        </Section>

        {/* Contact Form CTA */}
        <Section background="white" className="py-12">
          <Container>
            <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8">
              <Heading level={4} className="mb-3">
                Need personalized assistance?
              </Heading>
              <Text color="muted" className="mb-6">
                Fill out our contact form and our team will get back to you within 24 hours.
              </Text>
              <a
                href="/contact"
                className="inline-flex items-center justify-center h-11 px-6 font-medium rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
