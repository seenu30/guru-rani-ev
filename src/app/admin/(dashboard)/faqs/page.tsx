'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { HelpCircle, Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import { DataTable, type Column } from '@/components/organisms/DataTable';
import { Card } from '@/components/molecules/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Heading, Text } from '@/components/atoms/Typography';
import { Modal } from '@/components/molecules/Modal';
import { createClient } from '@/lib/supabase/client';
import type { FAQ } from '@/types';

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; faq: FAQ | null }>({
    open: false,
    faq: null,
  });

  const fetchFaqs = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching FAQs:', error);
      setIsLoading(false);
      return;
    }

    setFaqs(data || []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial data fetch on mount
    fetchFaqs();
  }, [fetchFaqs]);

  const handleDelete = async () => {
    if (!deleteModal.faq) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', deleteModal.faq.id);

    if (!error) {
      setFaqs(faqs.filter((f) => f.id !== deleteModal.faq?.id));
    }

    setDeleteModal({ open: false, faq: null });
  };

  const handleToggleActive = async (faq: FAQ) => {
    const supabase = createClient();
    const newActiveState = !faq.is_active;

    const { error } = await supabase
      .from('faqs')
      .update({ is_active: newActiveState } as never)
      .eq('id', faq.id);

    if (!error) {
      setFaqs(
        faqs.map((f) =>
          f.id === faq.id ? { ...f, is_active: newActiveState } : f
        )
      );
    }
  };

  // Get unique categories
  const categories = [...new Set(faqs.map((f) => f.category))];

  const columns: Column<FAQ>[] = [
    {
      key: 'sort_order',
      header: '#',
      width: '60px',
      render: (faq) => (
        <div className="flex items-center gap-2 text-text-muted">
          <GripVertical size={14} className="cursor-grab" />
          <span>{faq.sort_order}</span>
        </div>
      ),
    },
    {
      key: 'question',
      header: 'Question',
      sortable: true,
      render: (faq) => (
        <div className="max-w-md">
          <p className="font-medium text-text-primary line-clamp-2">{faq.question}</p>
          <p className="text-sm text-text-muted line-clamp-1 mt-1">
            {faq.answer.replace(/<[^>]*>/g, '').substring(0, 100)}...
          </p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (faq) => (
        <Badge variant="secondary">{faq.category}</Badge>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (faq) => (
        <button
          onClick={() => handleToggleActive(faq)}
          className="focus:outline-none"
        >
          <Badge variant={faq.is_active ? 'success' : 'default'}>
            {faq.is_active ? 'Active' : 'Hidden'}
          </Badge>
        </button>
      ),
    },
  ];

  const actions = (faq: FAQ) => (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/admin/faqs/${faq.id}`}>
        <Button variant="ghost" size="sm" title="Edit">
          <Edit2 size={16} />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        title="Delete"
        onClick={() => setDeleteModal({ open: true, faq })}
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
          <Heading level={2}>FAQs</Heading>
          <Text color="muted">Manage frequently asked questions</Text>
        </div>
        <Link href="/admin/faqs/new">
          <Button variant="primary">
            <Plus size={18} className="mr-2" />
            Add FAQ
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <HelpCircle size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{faqs.length}</p>
              <p className="text-sm text-text-muted">Total FAQs</p>
            </div>
          </div>
        </Card>
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <HelpCircle size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {faqs.filter((f) => f.is_active).length}
              </p>
              <p className="text-sm text-text-muted">Active</p>
            </div>
          </div>
        </Card>
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <HelpCircle size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{categories.length}</p>
              <p className="text-sm text-text-muted">Categories</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Categories Quick Filter */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant="default"
          className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
        >
          All ({faqs.length})
        </Badge>
        {categories.map((cat) => (
          <Badge
            key={cat}
            variant="secondary"
            className="cursor-pointer hover:bg-primary hover:text-white transition-colors"
          >
            {cat} ({faqs.filter((f) => f.category === cat).length})
          </Badge>
        ))}
      </div>

      {/* Table */}
      <Card variant="default" className="p-6">
        <DataTable
          columns={columns}
          data={faqs}
          isLoading={isLoading}
          searchable
          searchPlaceholder="Search FAQs..."
          pagination
          pageSize={15}
          actions={actions}
          emptyMessage="No FAQs found. Add your first FAQ to get started."
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, faq: null })}
        title="Delete FAQ"
        size="sm"
      >
        <div className="space-y-4">
          <Text>
            Are you sure you want to delete this FAQ?
          </Text>
          <div className="p-3 bg-surface rounded-lg">
            <p className="font-medium text-text-primary line-clamp-2">
              {deleteModal.faq?.question}
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, faq: null })}
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
