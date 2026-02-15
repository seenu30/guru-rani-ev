import { Metadata } from 'next';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { Heading, Text } from '@/components/atoms/Typography';
import { blogQueries } from '@/modules/blog/blog.queries';
import { BlogClient } from './BlogClient';

export const metadata: Metadata = {
  title: 'Blog & News | Guru Rani',
  description: 'Stay updated with the latest news, tips, and guides about electric mobility and Guru Rani scooters.',
};

export default async function BlogPage() {
  const posts = await blogQueries.getAll();
  const categories = await blogQueries.getCategories();

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <Section background="surface" className="pt-24 pb-12">
          <Container>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <Heading level={1} className="mb-4">
                Blog & News
              </Heading>
              <Text size="lg" color="muted">
                Stay updated with the latest news, tips, and guides about electric
                mobility and Guru Rani scooters.
              </Text>
            </div>
          </Container>
        </Section>

        <BlogClient posts={posts} categories={categories} />

        {/* Newsletter CTA */}
        <Section background="surface" className="py-12">
          <Container>
            <div className="max-w-2xl mx-auto text-center">
              <Heading level={3} className="mb-4">
                Stay in the Loop
              </Heading>
              <Text color="muted" className="mb-6">
                Subscribe to our newsletter for the latest updates, offers, and EV insights.
              </Text>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 h-11 px-4 rounded-lg border border-surface focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="h-11 px-6 font-medium rounded-lg bg-accent text-white hover:bg-accent/90 transition-colors whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
              <p className="text-xs text-text-muted mt-3">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </Container>
        </Section>
      </main>
      <Footer />
    </>
  );
}
