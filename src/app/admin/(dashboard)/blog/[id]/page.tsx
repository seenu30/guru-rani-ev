'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Eye, EyeOff } from 'lucide-react';
import { Card } from '@/components/molecules/Card';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Select } from '@/components/atoms/Select';
import { Heading, Text } from '@/components/atoms/Typography';
import { createClient } from '@/lib/supabase/client';
import type { BlogPost } from '@/types';

const CATEGORIES = [
  { value: 'EV News', label: 'EV News' },
  { value: 'Tips & Guides', label: 'Tips & Guides' },
  { value: 'Company Updates', label: 'Company Updates' },
];

export default function AdminBlogEditPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const isNew = postId === 'new';

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [post, setPost] = useState<Partial<BlogPost>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category: 'EV News',
    author: 'Guru Rani Team',
    is_published: false,
  });

  useEffect(() => {
    if (!isNew) {
      fetchPost();
    }
  }, [isNew, postId]);

  const fetchPost = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error || !data) {
      router.push('/admin/blog');
      return;
    }

    setPost(data as BlogPost);
    setIsLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const handleChange = (field: keyof BlogPost, value: string | boolean) => {
    setPost((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'title' && !post.id ? { slug: generateSlug(value as string) } : {}),
    }));
  };

  const handleSave = async (publish?: boolean) => {
    if (!post.title || !post.slug || !post.content) {
      alert('Please fill in the required fields (title, slug, content)');
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    const shouldPublish = publish !== undefined ? publish : post.is_published;

    try {
      const postData = {
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || null,
        content: post.content,
        cover_image: post.cover_image || null,
        category: post.category || null,
        author: post.author || null,
        is_published: shouldPublish,
        published_at: shouldPublish ? (post.published_at || new Date().toISOString()) : null,
      };

      if (isNew) {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert(postData as never)
          .select()
          .single();

        if (error) throw error;
        router.push(`/admin/blog/${(data as { id: string }).id}`);
      } else {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData as never)
          .eq('id', postId);

        if (error) throw error;
        setPost({ ...post, ...postData });
      }

      alert('Post saved successfully!');
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Error saving post. Please try again.');
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/blog">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <Heading level={2}>{isNew ? 'New Post' : 'Edit Post'}</Heading>
            <Text color="muted">{isNew ? 'Create a new blog post' : post.title}</Text>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {!isNew && post.is_published && (
            <Link href={`/blog/${post.slug}`} target="_blank">
              <Button variant="outline">
                <Eye size={18} className="mr-2" />
                View
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            onClick={() => handleSave(!post.is_published)}
            disabled={isSaving}
          >
            {post.is_published ? (
              <>
                <EyeOff size={18} className="mr-2" />
                Unpublish
              </>
            ) : (
              <>
                <Eye size={18} className="mr-2" />
                Publish
              </>
            )}
          </Button>
          <Button variant="primary" onClick={() => handleSave()} disabled={isSaving}>
            <Save size={18} className="mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card variant="default" className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Title <span className="text-error">*</span>
                </label>
                <Input
                  value={post.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter post title"
                  className="text-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Slug <span className="text-error">*</span>
                </label>
                <Input
                  value={post.slug || ''}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="post-url-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Excerpt</label>
                <Textarea
                  value={post.excerpt || ''}
                  onChange={(e) => handleChange('excerpt', e.target.value)}
                  placeholder="A brief summary of the post..."
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Content <span className="text-error">*</span>
                </label>
                <Textarea
                  value={post.content || ''}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Write your post content here... (HTML supported)"
                  rows={20}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-text-muted mt-1">
                  You can use HTML tags for formatting (h2, h3, p, ul, li, strong, em, etc.)
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card variant="default" className="p-6">
            <h3 className="font-heading font-semibold text-text-primary mb-4">Post Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Category</label>
                <Select
                  value={post.category || 'EV News'}
                  onChange={(e) => handleChange('category', e.target.value)}
                  options={CATEGORIES}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Author</label>
                <Input
                  value={post.author || ''}
                  onChange={(e) => handleChange('author', e.target.value)}
                  placeholder="Author name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Cover Image URL</label>
                <Input
                  value={post.cover_image || ''}
                  onChange={(e) => handleChange('cover_image', e.target.value)}
                  placeholder="https://..."
                />
                {post.cover_image && (
                  <div className="mt-2">
                    <img
                      src={post.cover_image}
                      alt="Cover preview"
                      className="w-full h-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </Card>

          <Card variant="default" className="p-6">
            <h3 className="font-heading font-semibold text-text-primary mb-4">Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Status</span>
                <span className={post.is_published ? 'text-success' : 'text-warning'}>
                  {post.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
              {post.published_at && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Published</span>
                  <span className="text-text-secondary">
                    {new Date(post.published_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
              {post.created_at && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-muted">Created</span>
                  <span className="text-text-secondary">
                    {new Date(post.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
