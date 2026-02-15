import { createClient as createServerClient } from '@/lib/supabase/server';
import type { BlogPost } from '@/types';

export interface BlogPostWithReadTime extends BlogPost {
  read_time: number;
}

function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

export const blogQueries = {
  /**
   * Get all published blog posts
   */
  async getAll(): Promise<BlogPostWithReadTime[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;

    const posts = data as BlogPost[] | null;

    return (posts || []).map((post) => ({
      ...post,
      read_time: calculateReadTime(post.content),
    }));
  },

  /**
   * Get a single blog post by slug
   */
  async getBySlug(slug: string): Promise<BlogPostWithReadTime | null> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    const post = data as BlogPost;

    return {
      ...post,
      read_time: calculateReadTime(post.content),
    };
  },

  /**
   * Get blog posts by category
   */
  async getByCategory(category: string): Promise<BlogPostWithReadTime[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .ilike('category', category)
      .order('published_at', { ascending: false });

    if (error) throw error;

    const posts = data as BlogPost[] | null;

    return (posts || []).map((post) => ({
      ...post,
      read_time: calculateReadTime(post.content),
    }));
  },

  /**
   * Get unique categories
   */
  async getCategories(): Promise<string[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('category')
      .eq('is_published', true);

    if (error) throw error;

    const posts = data as { category: string | null }[] | null;
    const categories = [...new Set((posts || []).map((p) => p.category).filter(Boolean) as string[])];
    return categories;
  },

  /**
   * Search blog posts
   */
  async search(query: string): Promise<BlogPostWithReadTime[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,content.ilike.%${query}%`)
      .order('published_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    const posts = data as BlogPost[] | null;

    return (posts || []).map((post) => ({
      ...post,
      read_time: calculateReadTime(post.content),
    }));
  },
};

export default blogQueries;
