'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, FileText } from 'lucide-react';
import { Card } from '@/components/molecules/Card';
import { Badge } from '@/components/atoms/Badge';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image: string | null;
  category: string | null;
  author: string | null;
  published_at: string | null;
  read_time: number;
}

interface BlogCardProps {
  post: BlogPost;
  index?: number;
  featured?: boolean;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function BlogCard({ post, index = 0, featured = false }: BlogCardProps) {
  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
      >
        <Link href={`/blog/${post.slug}`}>
          <Card variant="elevated" padding="none" hover className="overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="aspect-[16/10] md:aspect-auto bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                <FileText size={64} className="text-primary/50" />
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-text-muted">
                    {post.published_at ? formatDate(post.published_at) : ''}
                  </span>
                </div>

                <h2 className="text-2xl font-heading font-bold text-text-primary mb-3 line-clamp-2">
                  {post.title}
                </h2>

                <p className="text-text-secondary mb-4 line-clamp-3">
                  {post.excerpt}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-text-muted">
                    <Clock size={14} />
                    <span>{post.read_time} min read</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                    Read More <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card variant="outlined" padding="none" hover className="h-full overflow-hidden group">
          {/* Image */}
          <div className="aspect-[16/10] bg-gradient-to-br from-surface to-background flex items-center justify-center">
            <FileText size={48} className="text-primary/30" />
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="outline" className="text-xs">
                {post.category}
              </Badge>
              <span className="text-xs text-text-muted">
                {post.published_at ? formatDate(post.published_at) : ''}
              </span>
            </div>

            <h3 className="font-heading font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>

            <p className="text-sm text-text-muted mb-4 line-clamp-2">
              {post.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-text-muted">
                <Clock size={12} />
                <span>{post.read_time} min</span>
              </div>
              <span className="text-sm text-primary font-medium inline-flex items-center gap-1">
                Read <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export default BlogCard;
