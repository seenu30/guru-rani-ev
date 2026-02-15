'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Card } from '@/components/molecules/Card';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Select } from '@/components/atoms/Select';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Heading, Text } from '@/components/atoms/Typography';
import { createClient } from '@/lib/supabase/client';
import type { FAQ } from '@/types';

const CATEGORIES = [
  { value: 'Ownership & Delivery', label: 'Ownership & Delivery' },
  { value: 'Booking & Purchase', label: 'Booking & Purchase' },
  { value: 'Government Subsidies', label: 'Government Subsidies' },
  { value: 'Charging & Battery', label: 'Charging & Battery' },
  { value: 'Service & Maintenance', label: 'Service & Maintenance' },
  { value: 'Test Rides', label: 'Test Rides' },
  { value: 'App & Features', label: 'App & Features' },
  { value: 'General', label: 'General' },
];

export default function AdminFAQEditPage() {
  const router = useRouter();
  const params = useParams();
  const faqId = params.id as string;
  const isNew = faqId === 'new';

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [faq, setFaq] = useState<Partial<FAQ>>({
    question: '',
    answer: '',
    category: 'General',
    sort_order: 0,
    is_active: true,
  });

  useEffect(() => {
    if (!isNew) {
      fetchFaq();
    }
  }, [isNew, faqId]);

  const fetchFaq = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('id', faqId)
      .single();

    if (error || !data) {
      router.push('/admin/faqs');
      return;
    }

    setFaq(data as FAQ);
    setIsLoading(false);
  };

  const handleChange = (field: keyof FAQ, value: string | number | boolean) => {
    setFaq((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!faq.question || !faq.answer || !faq.category) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    try {
      const faqData = {
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
        sort_order: faq.sort_order || 0,
        is_active: faq.is_active,
      };

      if (isNew) {
        const { error } = await supabase.from('faqs').insert(faqData as never);
        if (error) throw error;
        router.push('/admin/faqs');
      } else {
        const { error } = await supabase
          .from('faqs')
          .update(faqData as never)
          .eq('id', faqId);

        if (error) throw error;
        setFaq({ ...faq, ...faqData });
      }

      alert('FAQ saved successfully!');
    } catch (error) {
      console.error('Error saving FAQ:', error);
      alert('Error saving FAQ. Please try again.');
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
          <Link href="/admin/faqs">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <Heading level={2}>{isNew ? 'Add FAQ' : 'Edit FAQ'}</Heading>
            <Text color="muted">{isNew ? 'Create a new FAQ entry' : 'Update FAQ details'}</Text>
          </div>
        </div>
        <Button variant="primary" onClick={handleSave} disabled={isSaving}>
          <Save size={18} className="mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card variant="default" className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Question <span className="text-error">*</span>
                </label>
                <Textarea
                  value={faq.question || ''}
                  onChange={(e) => handleChange('question', e.target.value)}
                  placeholder="Enter the frequently asked question"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Answer <span className="text-error">*</span>
                </label>
                <Textarea
                  value={faq.answer || ''}
                  onChange={(e) => handleChange('answer', e.target.value)}
                  placeholder="Enter the answer to this question"
                  rows={6}
                />
                <p className="text-xs text-text-muted mt-1">
                  You can use plain text. HTML formatting is not supported.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card variant="default" className="p-6">
            <h3 className="font-heading font-semibold text-text-primary mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Category <span className="text-error">*</span>
                </label>
                <Select
                  value={faq.category || 'General'}
                  onChange={(e) => handleChange('category', e.target.value)}
                  options={CATEGORIES}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Sort Order
                </label>
                <Input
                  type="number"
                  value={faq.sort_order || 0}
                  onChange={(e) => handleChange('sort_order', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
                <p className="text-xs text-text-muted mt-1">
                  Lower numbers appear first within the category.
                </p>
              </div>
            </div>
          </Card>

          <Card variant="default" className="p-6">
            <h3 className="font-heading font-semibold text-text-primary mb-4">Status</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={faq.is_active || false}
                onChange={(e) => handleChange('is_active', e.target.checked)}
              />
              <span className="text-text-primary">Active</span>
            </label>
            <p className="text-sm text-text-muted mt-2">
              Inactive FAQs won&apos;t be displayed on the support page.
            </p>
          </Card>

          {!isNew && faq.created_at && (
            <Card variant="default" className="p-6">
              <h3 className="font-heading font-semibold text-text-primary mb-4">Info</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Created</span>
                  <span className="text-text-secondary">
                    {new Date(faq.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
                {faq.updated_at && (
                  <div className="flex justify-between">
                    <span className="text-text-muted">Updated</span>
                    <span className="text-text-secondary">
                      {new Date(faq.updated_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
