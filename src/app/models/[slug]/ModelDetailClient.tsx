'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Zap, Share2, Heart } from 'lucide-react';
import { VariantSelector } from '@/components/organisms/VariantSelector';
import { ColorSelector } from '@/components/organisms/ColorSelector';
import { SpecsTable } from '@/components/organisms/SpecsTable';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Card } from '@/components/molecules/Card';
import type { ProductWithVariants } from '@/modules/products/products.queries';

interface ModelDetailClientProps {
  product: ProductWithVariants;
}

export function ModelDetailClient({ product }: ModelDetailClientProps) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedColor, setSelectedColor] = useState(product.variants[0].colors[0]);

  return (
    <main className="pt-20">
      {/* Breadcrumb */}
      <div className="bg-surface py-4">
        <Container>
          <Link
            href="/models"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Models
          </Link>
        </Container>
      </div>

      {/* Product Section */}
      <Section>
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="relative aspect-square bg-gradient-to-br from-surface to-background rounded-xl flex items-center justify-center sticky top-24">
                <div className="text-center">
                  <Zap size={120} className="text-primary mx-auto mb-4" />
                  <p className="text-text-muted">
                    {product.name} - {selectedColor.name}
                  </p>
                </div>
                <Badge variant="success" className="absolute top-4 left-4">
                  In Stock
                </Badge>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                    aria-label="Add to wishlist"
                  >
                    <Heart size={20} className="text-text-muted" />
                  </button>
                  <button
                    className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
                    aria-label="Share"
                  >
                    <Share2 size={20} className="text-text-muted" />
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Right: Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {/* Title */}
              <div>
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-2">
                  {product.name}
                </h1>
                <p className="text-lg text-primary font-medium">
                  {product.tagline}
                </p>
              </div>

              {/* Description */}
              <p className="text-text-secondary leading-relaxed">
                {product.description}
              </p>

              {/* Price */}
              <div className="pb-6 border-b border-surface">
                <p className="text-sm text-text-muted mb-1">Ex-showroom price</p>
                <p className="text-3xl font-heading font-bold text-accent">
                  ₹{selectedVariant.price.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-text-muted mt-1">
                  EMI starting ₹{Math.round(selectedVariant.price / 36).toLocaleString('en-IN')}/month
                </p>
              </div>

              {/* Variant Selector */}
              <VariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelect={(v) => {
                  setSelectedVariant(v);
                  setSelectedColor(v.colors[0]);
                }}
              />

              {/* Color Selector */}
              <ColorSelector
                colors={selectedVariant.colors}
                selectedColor={selectedColor}
                onSelect={setSelectedColor}
              />

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href={`/enquiry?model=${product.id}`} className="flex-1">
                  <Button fullWidth size="lg">
                    Get Quote
                  </Button>
                </Link>
                <Link href="/test-ride" className="flex-1">
                  <Button variant="outline" fullWidth size="lg">
                    Book Test Ride
                  </Button>
                </Link>
              </div>

              {/* Quick Benefits */}
              <Card variant="filled" padding="md" className="bg-surface/50">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span>3 Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span>Free Home Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span>0% Finance Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-success" />
                    <span>Free Registration</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* Specifications */}
      <Section className="bg-surface">
        <Container>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-text-primary mb-8 text-center">
            Specifications
          </h2>
          <div className="max-w-2xl mx-auto">
            <SpecsTable variant={selectedVariant} />
          </div>
        </Container>
      </Section>

      {/* Compare CTA */}
      <Section>
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-text-primary mb-4">
              Compare with Other Models
            </h2>
            <p className="text-text-secondary mb-6">
              See how the {product.name} stacks up against our other electric scooters.
            </p>
            <Link href="/compare">
              <Button variant="outline">Compare Now</Button>
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}
