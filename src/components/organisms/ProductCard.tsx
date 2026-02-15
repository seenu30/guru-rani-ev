'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Gauge, Battery } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import { Badge } from '@/components/atoms/Badge';

interface ProductVariant {
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
  description: string | null;
  image_url: string | null;
  variants: ProductVariant[];
}

interface ProductCardProps {
  product: Product;
  index?: number;
  featured?: boolean;
}

export function ProductCard({ product, index = 0, featured = false }: ProductCardProps) {
  const defaultVariant = product.variants[0];

  // Don't render if no variants available
  if (!defaultVariant) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card variant="elevated" padding="none" hover className="h-full overflow-hidden">
        {/* Image */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-surface to-background flex items-center justify-center">
          <div className="text-center">
            <Zap size={64} className="text-primary mx-auto mb-2" />
            <span className="text-sm text-text-muted">Image Coming Soon</span>
          </div>
          {featured && (
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

          {/* Variants */}
          <div className="mb-4">
            <p className="text-xs text-text-muted mb-2">
              {product.variants.length} variant{product.variants.length > 1 ? 's' : ''} available
            </p>
            <div className="flex gap-2">
              {product.variants.map((variant) => (
                <span
                  key={variant.id}
                  className="text-xs px-2 py-1 bg-surface rounded-full text-text-secondary"
                >
                  {variant.name}
                </span>
              ))}
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
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default ProductCard;
