'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Package, Plus, Edit2, Trash2, Eye, ChevronRight } from 'lucide-react';
import { DataTable, type Column } from '@/components/organisms/DataTable';
import { Card } from '@/components/molecules/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Heading, Text } from '@/components/atoms/Typography';
import { Modal } from '@/components/molecules/Modal';
import { createClient } from '@/lib/supabase/client';
import type { ScooterModel } from '@/types';

interface ProductWithVariantCount extends ScooterModel {
  variant_count: number;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductWithVariantCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; product: ProductWithVariantCount | null }>({
    open: false,
    product: null,
  });

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();

    // Get all models (including drafts/archived for admin)
    const { data: models, error } = await supabase
      .from('scooter_models')
      .select('*')
      .is('deleted_at', null)
      .order('sort_order', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
      setIsLoading(false);
      return;
    }

    // Get variant counts for each model
    const { data: variantCounts } = await supabase
      .from('variants')
      .select('model_id');

    const countMap = new Map<string, number>();
    (variantCounts as { model_id: string }[] | null)?.forEach((v) => {
      countMap.set(v.model_id, (countMap.get(v.model_id) || 0) + 1);
    });

    const productsWithCounts = ((models || []) as ScooterModel[]).map((model) => ({
      ...model,
      variant_count: countMap.get(model.id) || 0,
    }));

    setProducts(productsWithCounts);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial data fetch on mount
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async () => {
    if (!deleteModal.product) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('scooter_models')
      .update({ deleted_at: new Date().toISOString() } as never)
      .eq('id', deleteModal.product.id);

    if (!error) {
      setProducts(products.filter((p) => p.id !== deleteModal.product?.id));
    }

    setDeleteModal({ open: false, product: null });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price / 100);
  };

  const columns: Column<ProductWithVariantCount>[] = [
    {
      key: 'name',
      header: 'Product',
      sortable: true,
      render: (product) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Package size={20} className="text-text-muted" />
            )}
          </div>
          <div>
            <p className="font-medium text-text-primary">{product.name}</p>
            <p className="text-sm text-text-muted">{product.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'tagline',
      header: 'Tagline',
      render: (product) => (
        <span className="text-text-secondary truncate max-w-xs block">
          {product.tagline || '-'}
        </span>
      ),
    },
    {
      key: 'variant_count',
      header: 'Variants',
      render: (product) => (
        <Badge variant="secondary">{product.variant_count} variants</Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (product) => {
        const variants: Record<string, 'success' | 'warning' | 'default'> = {
          active: 'success',
          draft: 'warning',
          archived: 'default',
        };
        return (
          <Badge variant={variants[product.status] || 'default'}>
            {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'sort_order',
      header: 'Order',
      sortable: true,
    },
  ];

  const actions = (product: ProductWithVariantCount) => (
    <div className="flex items-center justify-end gap-2">
      <Link href={`/models/${product.slug}`} target="_blank">
        <Button variant="ghost" size="sm" title="View on site">
          <Eye size={16} />
        </Button>
      </Link>
      <Link href={`/admin/products/${product.id}`}>
        <Button variant="ghost" size="sm" title="Edit">
          <Edit2 size={16} />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        title="Delete"
        onClick={() => setDeleteModal({ open: true, product })}
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
          <Heading level={2}>Products</Heading>
          <Text color="muted">Manage your scooter models, variants, and colors</Text>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary">
            <Plus size={18} className="mr-2" />
            Add Product
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Package size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{products.length}</p>
              <p className="text-sm text-text-muted">Total Models</p>
            </div>
          </div>
        </Card>
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Package size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {products.filter((p) => p.status === 'active').length}
              </p>
              <p className="text-sm text-text-muted">Active</p>
            </div>
          </div>
        </Card>
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <Package size={20} className="text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {products.reduce((acc, p) => acc + p.variant_count, 0)}
              </p>
              <p className="text-sm text-text-muted">Total Variants</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card variant="default" className="p-6">
        <DataTable
          columns={columns}
          data={products}
          isLoading={isLoading}
          searchable
          searchPlaceholder="Search products..."
          pagination
          pageSize={10}
          actions={actions}
          emptyMessage="No products found. Add your first product to get started."
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, product: null })}
        title="Delete Product"
        size="sm"
      >
        <div className="space-y-4">
          <Text>
            Are you sure you want to delete <strong>{deleteModal.product?.name}</strong>?
            This will also remove all associated variants and colors.
          </Text>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, product: null })}
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
