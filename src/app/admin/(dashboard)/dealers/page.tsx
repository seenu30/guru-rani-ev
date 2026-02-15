'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { MapPin, Plus, Edit2, Trash2, Phone, Mail, Clock } from 'lucide-react';
import { DataTable, type Column } from '@/components/organisms/DataTable';
import { Card } from '@/components/molecules/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Heading, Text } from '@/components/atoms/Typography';
import { Modal } from '@/components/molecules/Modal';
import { createClient } from '@/lib/supabase/client';
import type { Dealer } from '@/types';

export default function AdminDealersPage() {
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; dealer: Dealer | null }>({
    open: false,
    dealer: null,
  });

  const fetchDealers = useCallback(async () => {
    setIsLoading(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from('dealers')
      .select('*')
      .order('city', { ascending: true });

    if (error) {
      console.error('Error fetching dealers:', error);
      setIsLoading(false);
      return;
    }

    setDealers(data || []);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial data fetch on mount
    fetchDealers();
  }, [fetchDealers]);

  const handleDelete = async () => {
    if (!deleteModal.dealer) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('dealers')
      .delete()
      .eq('id', deleteModal.dealer.id);

    if (!error) {
      setDealers(dealers.filter((d) => d.id !== deleteModal.dealer?.id));
    }

    setDeleteModal({ open: false, dealer: null });
  };

  const handleToggleActive = async (dealer: Dealer) => {
    const supabase = createClient();
    const newActiveState = !dealer.is_active;

    const { error } = await supabase
      .from('dealers')
      .update({ is_active: newActiveState } as never)
      .eq('id', dealer.id);

    if (!error) {
      setDealers(
        dealers.map((d) =>
          d.id === dealer.id ? { ...d, is_active: newActiveState } : d
        )
      );
    }
  };

  const columns: Column<Dealer>[] = [
    {
      key: 'name',
      header: 'Dealer',
      sortable: true,
      render: (dealer) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin size={18} className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-text-primary">{dealer.name}</p>
            <p className="text-sm text-text-muted">{dealer.address}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'city',
      header: 'Location',
      sortable: true,
      render: (dealer) => (
        <div>
          <p className="text-text-primary">{dealer.city}</p>
          <p className="text-sm text-text-muted">{dealer.state} - {dealer.pincode}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      header: 'Contact',
      render: (dealer) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm">
            <Phone size={14} className="text-text-muted" />
            <span>{dealer.phone}</span>
          </div>
          {dealer.email && (
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Mail size={14} />
              <span className="truncate max-w-32">{dealer.email}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'timings',
      header: 'Timings',
      render: (dealer) => (
        <div className="flex items-center gap-2 text-sm text-text-secondary">
          <Clock size={14} className="text-text-muted" />
          <span>{dealer.timings || '-'}</span>
        </div>
      ),
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (dealer) => (
        <button
          onClick={() => handleToggleActive(dealer)}
          className="focus:outline-none"
        >
          <Badge variant={dealer.is_active ? 'success' : 'default'}>
            {dealer.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </button>
      ),
    },
  ];

  const actions = (dealer: Dealer) => (
    <div className="flex items-center justify-end gap-2">
      <a
        href={`https://www.google.com/maps?q=${dealer.latitude},${dealer.longitude}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="ghost" size="sm" title="View on Map">
          <MapPin size={16} />
        </Button>
      </a>
      <Link href={`/admin/dealers/${dealer.id}`}>
        <Button variant="ghost" size="sm" title="Edit">
          <Edit2 size={16} />
        </Button>
      </Link>
      <Button
        variant="ghost"
        size="sm"
        title="Delete"
        onClick={() => setDeleteModal({ open: true, dealer })}
        className="text-error hover:bg-error/10"
      >
        <Trash2 size={16} />
      </Button>
    </div>
  );

  // Group dealers by city for quick stats
  const cityCounts = dealers.reduce((acc, d) => {
    acc[d.city] = (acc[d.city] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const uniqueCities = Object.keys(cityCounts).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Heading level={2}>Dealers</Heading>
          <Text color="muted">Manage dealer and showroom locations</Text>
        </div>
        <Link href="/admin/dealers/new">
          <Button variant="primary">
            <Plus size={18} className="mr-2" />
            Add Dealer
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{dealers.length}</p>
              <p className="text-sm text-text-muted">Total Dealers</p>
            </div>
          </div>
        </Card>
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <MapPin size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">
                {dealers.filter((d) => d.is_active).length}
              </p>
              <p className="text-sm text-text-muted">Active</p>
            </div>
          </div>
        </Card>
        <Card variant="default" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <MapPin size={20} className="text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{uniqueCities}</p>
              <p className="text-sm text-text-muted">Cities</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card variant="default" className="p-6">
        <DataTable
          columns={columns}
          data={dealers}
          isLoading={isLoading}
          searchable
          searchPlaceholder="Search dealers..."
          pagination
          pageSize={10}
          actions={actions}
          emptyMessage="No dealers found. Add your first dealer location to get started."
        />
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, dealer: null })}
        title="Delete Dealer"
        size="sm"
      >
        <div className="space-y-4">
          <Text>
            Are you sure you want to delete <strong>{deleteModal.dealer?.name}</strong>?
            This will remove the dealer from the locator map.
          </Text>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, dealer: null })}
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
