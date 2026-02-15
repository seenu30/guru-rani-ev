import Link from 'next/link';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { Heading, Text } from '@/components/atoms/Typography';
import { Zap, Target, Users, Leaf, Award, Globe } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Guru Rani - our mission to revolutionize urban mobility in India with affordable, sustainable electric scooters.',
};

const values = [
  {
    icon: Leaf,
    title: 'Sustainability First',
    description:
      'Every decision we make considers environmental impact. From manufacturing to packaging, we minimize our carbon footprint.',
  },
  {
    icon: Target,
    title: 'Indian-First Design',
    description:
      'Our scooters are designed specifically for Indian roads, weather conditions, and riding patterns.',
  },
  {
    icon: Users,
    title: 'Customer Obsession',
    description:
      'We listen to our riders. Every feature, every improvement comes from real customer feedback.',
  },
  {
    icon: Award,
    title: 'Quality Without Compromise',
    description:
      'We use premium components and rigorous testing to ensure every Guru Rani meets the highest standards.',
  },
];

const milestones = [
  { year: '2024', title: 'Founded', description: 'Guru Rani was born in Andhra Pradesh' },
  { year: '2025', title: 'First Model', description: 'Launched Guru Rani S' },
  { year: '2025', title: 'Service Center', description: 'Opened dealership in Gangavaram' },
  { year: '2026', title: 'Growing', description: 'Expanding across Andhra Pradesh' },
];

const stats = [
  { value: '100+', label: 'Happy Riders' },
  { value: 'AP', label: 'Starting Region' },
  { value: '1', label: 'Service Center' },
  { value: '₹5L+', label: 'Fuel Saved' },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <Section background="surface" className="pt-24 pb-16">
          <Container>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Zap size={32} className="text-primary" />
              </div>
              <Heading level={1} className="mb-6">
                Revolutionizing Urban Mobility
              </Heading>
              <Text size="xl" color="muted">
                We&apos;re on a mission to make sustainable transportation accessible
                to every Indian. One scooter at a time.
              </Text>
            </div>
          </Container>
        </Section>

        {/* Stats Section */}
        <Section background="white" className="py-12">
          <Container>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-3xl md:text-4xl font-heading font-bold text-accent mb-2">
                    {stat.value}
                  </p>
                  <p className="text-text-muted">{stat.label}</p>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Story Section */}
        <Section background="surface" className="py-16">
          <Container size="md">
            <Heading level={2} className="text-center mb-8">
              Our Story
            </Heading>
            <div className="prose prose-lg max-w-none text-text-secondary">
              <p>
                Guru Rani was born out of frustration with the status quo. In 2022,
                our founders - a group of engineers and designers passionate about
                sustainable mobility - set out to build the electric scooter India
                deserved.
              </p>
              <p>
                We saw a market flooded with either overpriced imports or
                underwhelming local options. We knew there had to be a better way.
                A scooter that understood Indian roads, Indian weather, and Indian
                budgets.
              </p>
              <p>
                After months of intense R&D, countless prototypes, and extensive
                testing on real Indian roads, we launched the Guru Rani S. The
                response has been encouraging - riders love the blend of quality,
                range, and affordability.
              </p>
              <p>
                Today, we&apos;re proud to serve riders in Andhra Pradesh, with
                each customer saving money while reducing their carbon footprint.
                This is just the beginning. Our vision is to bring Guru Rani to
                every Indian household that believes in sustainable transportation.
              </p>
            </div>
          </Container>
        </Section>

        {/* Values Section */}
        <Section background="white" className="py-16">
          <Container>
            <Heading level={2} className="text-center mb-12">
              Our Values
            </Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="flex gap-5 p-6 rounded-xl bg-surface/50"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <value.icon size={24} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-text-primary mb-2">
                      {value.title}
                    </h3>
                    <p className="text-text-secondary">{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </Section>

        {/* Timeline Section */}
        <Section background="surface" className="py-16">
          <Container size="md">
            <Heading level={2} className="text-center mb-12">
              Our Journey
            </Heading>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 -translate-x-1/2 hidden md:block" />

              <div className="space-y-8 md:space-y-12">
                {milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className={`relative flex items-center ${
                      index % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Content */}
                    <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                      <div className="bg-white rounded-lg p-6 shadow-sm">
                        <span className="text-sm font-semibold text-primary">
                          {milestone.year}
                        </span>
                        <h4 className="font-heading font-semibold text-lg text-text-primary mt-1">
                          {milestone.title}
                        </h4>
                        <p className="text-text-muted mt-2">{milestone.description}</p>
                      </div>
                    </div>

                    {/* Dot */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background" />
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </Section>

        {/* CTA Section */}
        <Section background="white" className="py-16">
          <Container>
            <div className="max-w-2xl mx-auto text-center bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 md:p-12">
              <Globe size={48} className="text-primary mx-auto mb-6" />
              <Heading level={3} className="mb-4">
                Join the Movement
              </Heading>
              <Text color="muted" className="mb-8">
                Be part of India&apos;s electric revolution. Experience the future
                of mobility today.
              </Text>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/test-ride"
                  className="inline-flex items-center justify-center h-12 px-8 font-medium rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors"
                >
                  Book a Test Ride
                </Link>
                <Link
                  href="/models"
                  className="inline-flex items-center justify-center h-12 px-8 font-medium rounded-lg border-2 border-accent text-accent hover:bg-accent hover:text-white transition-colors"
                >
                  Explore Models
                </Link>
              </div>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
