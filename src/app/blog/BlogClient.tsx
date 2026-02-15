'use client';

import { useState, useMemo } from 'react';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { BlogCard } from '@/components/organisms/BlogCard';
import { Input } from '@/components/atoms/Input';
import { Text } from '@/components/atoms/Typography';
import { Search } from 'lucide-react';
import type { BlogPostWithReadTime } from '@/modules/blog/blog.queries';

interface BlogClientProps {
  posts: BlogPostWithReadTime[];
  categories: string[];
}

export function BlogClient({ posts, categories }: BlogClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch =
        searchQuery === '' ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      const matchesCategory =
        selectedCategory === 'All' || post.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [posts, searchQuery, selectedCategory]);

  const featuredPost = filteredPosts[0];
  const regularPosts = filteredPosts.slice(1);
  const allCategories = ['All', ...categories];

  return (
    <>
      {/* Search and Filters */}
      <Section background="surface" className="pb-12">
        <Container>
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap justify-center gap-2">
              {allCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-white text-text-secondary hover:bg-primary/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* Blog Posts */}
      <Section background="white" className="py-12">
        <Container>
          {filteredPosts.length > 0 ? (
            <>
              {/* Featured Post */}
              {featuredPost && (
                <div className="mb-12">
                  <BlogCard post={featuredPost} featured index={0} />
                </div>
              )}

              {/* Regular Posts Grid */}
              {regularPosts.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((post, index) => (
                    <BlogCard key={post.id} post={post} index={index + 1} />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Text color="muted" className="mb-2">
                No articles found
              </Text>
              <Text size="sm" color="muted">
                Try adjusting your search or filter criteria
              </Text>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
