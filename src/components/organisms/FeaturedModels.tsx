'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Gauge, Battery } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { Card } from '@/components/molecules/Card';
import { Badge } from '@/components/atoms/Badge';
import { slideUp, staggerContainer } from '@/lib/animations';

interface Variant {
  id: string;
  name: string;
  price: number;
  range_km: number;
  top_speed: number;
  battery: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  variants: Variant[];
}

interface FeaturedModelsProps {
  products: Product[];
}

export function FeaturedModels({ products }: FeaturedModelsProps) {
  return (
    <Section>
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div variants={slideUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
              Our Electric Scooters
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Choose from our range of stylish, powerful, and eco-friendly electric scooters designed for every rider.
            </p>
          </motion.div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {products.map((product, index) => {
              const defaultVariant = product.variants[0];
              if (!defaultVariant) return null;

              return (
                <motion.div
                  key={product.id}
                  variants={slideUp}
                  custom={index}
                >
                  <Card
                    variant="elevated"
                    padding="none"
                    hover
                    className="h-full overflow-hidden"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] bg-gradient-to-br from-surface to-background flex items-center justify-center">
                      <div className="text-center">
                        <Zap size={64} className="text-primary mx-auto mb-2" />
                        <span className="text-sm text-text-muted">Image Coming Soon</span>
                      </div>
                      {index === 0 && (
                        <Badge variant="default" className="absolute top-4 left-4">
                          Best Seller
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-heading font-bold text-text-primary mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-text-muted mb-4">{product.tagline}</p>

                      {/* Quick Specs */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-primary mb-1">
                            <Gauge size={14} />
                            <span className="text-sm font-semibold text-text-primary">
                              {defaultVariant.range_km}
                            </span>
                          </div>
                          <p className="text-xs text-text-muted">km Range</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-primary mb-1">
                            <Zap size={14} />
                            <span className="text-sm font-semibold text-text-primary">
                              {defaultVariant.top_speed}
                            </span>
                          </div>
                          <p className="text-xs text-text-muted">km/h</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center gap-1 text-primary mb-1">
                            <Battery size={14} />
                            <span className="text-sm font-semibold text-text-primary">
                              {defaultVariant.battery}
                            </span>
                          </div>
                          <p className="text-xs text-text-muted">Battery</p>
                        </div>
                      </div>

                      {/* Price & CTA */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-text-muted">Starting at</p>
                          <p className="text-xl font-heading font-bold text-accent">
                            ₹{defaultVariant.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                        <Link href={`/models/${product.slug}`}>
                          <Button size="sm" rightIcon={<ArrowRight size={16} />}>
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* View All Button */}
          <motion.div variants={slideUp} className="text-center">
            <Link href="/models">
              <Button variant="outline" size="lg" rightIcon={<ArrowRight size={20} />}>
                View All Models
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}

export default FeaturedModels;
