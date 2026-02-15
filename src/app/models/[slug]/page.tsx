import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Navbar, Footer } from '@/components/organisms';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { Button } from '@/components/atoms/Button';
import { productsQueries } from '@/modules/products/products.queries';
import { ModelDetailClient } from './ModelDetailClient';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productsQueries.getBySlug(slug);

  if (!product) {
    return {
      title: 'Model Not Found | Guru Rani',
    };
  }

  return {
    title: `${product.name} - Electric Scooter | Guru Rani`,
    description: product.description || `Explore the ${product.name} electric scooter. ${product.tagline}`,
  };
}

export default async function ModelDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await productsQueries.getBySlug(slug);

  if (!product || product.variants.length === 0) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <ModelDetailClient product={product} />
      <Footer />
    </>
  );
}
