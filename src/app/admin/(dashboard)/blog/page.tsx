'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FileText, Plus, Edit2, Trash2, Eye, ExternalLink } from 'lucide-react';
import { DataTable, type Column } from '@/components/organisms/DataTable';
import { Card } from '@/components/molecules/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Heading, Text } from '@/components/atoms/Typography';
import { Modal } from '@/components/molecules/Modal';
import { createClient } from '@/lib/supabase/client';
import type { BlogPost } from '@/types';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; post: BlogPost | null }>({
    open: false,
    post: null,
  });

  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error);
      setIsLoading(false);
      return;
    }

    setPosts(data || []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial data fetch on mount
    fetchPosts();
  }, [fetchPosts]);

  const handleDelete = async () => {
    if (!deleteModal.post) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', deleteModal.post.id);

    if (!error) {
      setPosts(posts.filter((p) => p.id !== deleteModal.post?.id));
    }

    setDeleteModal({ open: false, post: null });
  };

  const handleTogglePublish = async (post: BlogPost) => {
    const supabase = createClient();
    const newPublishedState = !post.is_published;

    const { error } = await supabase
      .from('blog_posts')
      .update({
        is_published: newPublishedState,
        published_at: newPublishedState ? new Date().toISOString() : null,
      } as never)
      .eq('id', post.id);

    if (!error) {
      setPosts(
        posts.map((p) =>
          p.id === post.id
            ? { ...p, is_published: newPublishedState, published_at: newPublishedState ? new Date().toISOString() : null }
            : p
        )
      );
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const columns: Column<BlogPost>[] = [
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (post) => (
        <div className="flex items-center gap-3">
          <div className="w-16 h-12 rounded-lg bg-surface flex items-center justify-center overflow-hidden">
            {post.cover_image ? (
              <img
                src={post.cover_image}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <FileText size={20} className="text-text-muted" />
            )}
          </div>
          <div className="max-w-xs">
            <p className="font-medium text-text-primary truncate">{post.title}</p>
            <p className="text-sm text-text-muted truncate">{post.excerpt || '-'}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (post) => (
        <Badge variant="secondary">{post.category || 'Uncategorized'}</Badge>
      ),
    },
    {
      key: 'author',
      header: 'Author',
      render: (post) => <span>{post.author || '-'}</span>,
    },
    {
      key: 'is_published',
      header: 'Status',
      render: (post) => (
        <button
          onClick={() => handleTogglePublish(post)}
          className="focus:outline-none"
        >
          <Badge variant={post.is_published ? 'success' : 'warning'}>
            {post.is_published ? 'Published' : 'Draft'}
          </Badge>
        </button>
      ),
    },
    {
      key: 'published_at',
      header: 'Published',
      sortable: true,
      render: (post) => (
        <span className="text-text-secondary">{formatDate(post.published_at)}</span>
      ),
    },
  ];

  const actions = (post: BlogPost) => (
    <div className="flex items-center justify-end gap-2">
      {post.is_published && (
        <Link href={`/blog/${post.slug}`} target="_blank">
          <Button variant="ghost" size="sm" title="View on site">
            <ExternalLink size={16} />
          </Button>
        </Link>
      )}
      <Link href={`/admin/blog/${post.id}`}>
        <Button variant="ghost" size="sm" title="Edit">
          <Edit2 size={16} />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        title="Delete"
        onClick={() => setDeleteModal({ open: true, post })}
        className="text-error hover:bg-error/10"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2}>Blog Posts</Heading>
          <Text color="muted">Create and manage blog content</Text>
        </div>
        <Link href="/admin/blog/new">
          <Button variant="primary">
            <Plus size={18} className="mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <FileText size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{posts.length}</p>
              <p className="text-sm text-text-muted">Total Posts</p>
            </div>
          </div>
        </Card>
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Eye size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {posts.filter((p) => p.is_published).length}
              </p>
              <p className="text-sm text-text-muted">Published</p>
            </div>
          </div>
        </Card>
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <FileText size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {posts.filter((p) => !p.is_published).length}
              </p>
              <p className="text-sm text-text-muted">Drafts</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card variant="default" className="p-6">
        <DataTable
          columns={columns}
          data={posts}
          isLoading={isLoading}
          searchable
          searchPlaceholder="Search posts..."
          pagination
          pageSize={10}
          actions={actions}
          emptyMessage="No blog posts yet. Create your first post to get started."
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, post: null })}
        title="Delete Blog Post"
        size="sm"
      >
        <div className="space-y-4">
          <Text>
            Are you sure you want to delete <strong>{deleteModal.post?.title}</strong>?
            This action cannot be undone.
          </Text>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, post: null })}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
