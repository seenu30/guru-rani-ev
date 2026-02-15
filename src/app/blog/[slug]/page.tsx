import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/organisms/Navbar';
import { Footer } from '@/components/organisms/Footer';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { Heading, Text } from '@/components/atoms/Typography';
import { Badge } from '@/components/atoms/Badge';
import { Breadcrumb } from '@/components/molecules/Breadcrumb';
import { BlogCard } from '@/components/organisms/BlogCard';
import { blogQueries } from '@/modules/blog/blog.queries';
import { Clock, ArrowLeft, Twitter, Linkedin, Facebook } from 'lucide-react';
import type { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await blogQueries.getBySlug(resolvedParams.slug);

  if (!post) {
    return { title: 'Post Not Found' };
  }

  return {
    title: `${post.title} | Guru Rani Blog`,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.published_at || undefined,
      authors: post.author ? [post.author] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const resolvedParams = await params;
  const post = await blogQueries.getBySlug(resolvedParams.slug);

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const allPosts = await blogQueries.getAll();
  const relatedPosts = allPosts
    .filter((p) => p.id !== post.id && p.category === post.category)
    .slice(0, 2);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: post.title },
  ];

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <Section background="surface" className="pt-24 pb-8">
          <Container size="md">
            <Breadcrumb items={breadcrumbItems} className="mb-6" />

            <div className="flex items-center gap-3 mb-4">
              {post.category && <Badge variant="secondary">{post.category}</Badge>}
              {post.published_at && (
                <span className="text-sm text-text-muted">
                  {formatDate(post.published_at)}
                </span>
              )}
              <span className="text-sm text-text-muted flex items-center gap-1">
                <Clock size={14} />
                {post.read_time} min read
              </span>
            </div>

            <Heading level={1} className="mb-4">
              {post.title}
            </Heading>

            {post.excerpt && (
              <Text size="lg" color="muted" className="mb-6">
                {post.excerpt}
              </Text>
            )}

            <div className="flex items-center justify-between">
              {post.author && (
                <Text size="sm" color="muted">
                  By {post.author}
                </Text>
              )}

              {/* Share buttons */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-text-muted mr-2">Share:</span>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://gururani.in/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white hover:bg-primary/10 transition-colors"
                  aria-label="Share on Twitter"
                >
                  <Twitter size={18} className="text-primary" />
                </a>
                <a
                  href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(`https://gururani.in/blog/${post.slug}`)}&title=${encodeURIComponent(post.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white hover:bg-primary/10 transition-colors"
                  aria-label="Share on LinkedIn"
                >
                  <Linkedin size={18} className="text-primary" />
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://gururani.in/blog/${post.slug}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white hover:bg-primary/10 transition-colors"
                  aria-label="Share on Facebook"
                >
                  <Facebook size={18} className="text-primary" />
                </a>
              </div>
            </div>
          </Container>
        </Section>

        {/* Article Content */}
        <Section background="white" className="py-12">
          <Container size="md">
            <article className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-primary prose-strong:text-text-primary">
              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(post.content) }} />
            </article>
          </Container>
        </Section>

        {/* Back to Blog */}
        <Section background="surface" className="py-8">
          <Container size="md">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
            >
              <ArrowLeft size={18} />
              Back to Blog
            </Link>
          </Container>
        </Section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <Section background="white" className="py-12">
            <Container>
              <Heading level={3} className="mb-8 text-center">
                Related Articles
              </Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {relatedPosts.map((relatedPost, index) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} index={index} />
                ))}
              </div>
            </Container>
          </Section>
        )}
      </main>
      <Footer />
    </>
  );
}

// Simple markdown to HTML converter (basic implementation)
function markdownToHtml(markdown: string): string {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Lists
    .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    // Tables (simplified)
    .replace(/\|(.+)\|/g, (match) => {
      const cells = match.split('|').filter(Boolean);
      const row = cells.map((cell) => `<td class="border px-4 py-2">${cell.trim()}</td>`).join('');
      return `<tr>${row}</tr>`;
    })
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>');
}
