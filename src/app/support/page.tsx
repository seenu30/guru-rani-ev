'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { FAQAccordion } from '@/components/organisms/FAQAccordion';
import { Heading, Text } from '@/components/atoms/Typography';
import { Card } from '@/components/molecules/Card';
import { HelpCircle, MessageCircle, Phone, Mail, MapPin } from 'lucide-react';
import { ZapLoader } from '@/components/atoms';
import { createClient } from '@/lib/supabase/client';
import type { FAQ } from '@/types';

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
    icon: Mail,
    title: 'Email Support',
    description: 'Detailed queries',
    action: 'mailto:support@gururani.in',
    actionLabel: 'support@gururani.in',
  },
];

export default function SupportPage() {
  const [faqCategories, setFaqCategories] = useState<{ category: string; items: { id: string; question: string; answer: string }[] }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('category')
        .order('sort_order');

      if (!error && data) {
        // Group FAQs by category
        const grouped = data.reduce((acc: Record<string, FAQ[]>, faq: FAQ) => {
          if (!acc[faq.category]) {
            acc[faq.category] = [];
          }
          acc[faq.category].push(faq);
          return acc;
        }, {});

        const categories = Object.entries(grouped).map(([category, faqs]) => ({
          category,
          items: faqs.map((q) => ({
            id: q.id,
            question: q.question,
            answer: q.answer,
          })),
        }));

        setFaqCategories(categories);
      }
      setIsLoading(false);
    };

    fetchFaqs();
  }, []);

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <Section background="surface" className="pt-24 pb-12">
          <Container>
            <div className="text-center max-w-2xl mx-auto">
              <Heading level={1} className="mb-4">
                Support Center
              </Heading>
              <Text size="lg" color="muted">
                We&apos;re here to help! Find answers to common questions or reach out to our support team.
              </Text>
            </div>
          </Container>
        </Section>

        {/* Support Channels */}
        <Section background="white" className="py-12">
          <Container>
            <div className="text-center mb-8">
              <Heading level={3}>Get in Touch</Heading>
              <Text color="muted" className="mt-2">
                Choose your preferred way to contact us
              </Text>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {supportChannels.map((channel, index) => (
                <a
                  key={index}
                  href={channel.action}
                  className="flex flex-col items-center text-center p-6 bg-surface rounded-xl hover:shadow-md transition-shadow group"
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

        {/* FAQ Section */}
        <Section background="surface" className="py-12">
          <Container>
            <div className="text-center mb-8">
              <Heading level={3}>Frequently Asked Questions</Heading>
              <Text color="muted" className="mt-2">
                Find quick answers to common questions
              </Text>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <ZapLoader size="lg" text="Loading FAQs..." />
              </div>
            ) : faqCategories.length > 0 ? (
              <div className="max-w-3xl mx-auto">
                <FAQAccordion categories={faqCategories} />
              </div>
            ) : (
              <div className="text-center py-8">
                <Text color="muted">No FAQs available at the moment.</Text>
              </div>
            )}
          </Container>
        </Section>

        {/* Service Centers */}
        <Section background="white" className="py-12">
          <Container>
            <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <MapPin size={24} className="text-accent" />
              </div>
              <Heading level={4} className="mb-3">
                Find a Service Center Near You
              </Heading>
              <Text color="muted" className="mb-6">
                Visit any of our authorized service centers for maintenance, repairs, or product support.
              </Text>
              <a
                href="/dealers"
                className="inline-flex items-center justify-center h-11 px-6 font-medium rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
              >
                Find Dealers
              </a>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
