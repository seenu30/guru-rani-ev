'use client';

import { useState, useEffect, useCallback } from 'react';
import { Download, Filter, Eye, Phone, Mail } from 'lucide-react';
import { DataTable, type Column } from '@/components/organisms/DataTable';
import { Card } from '@/components/molecules/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { Modal } from '@/components/molecules/Modal';
import { Heading, Text } from '@/components/atoms/Typography';
import { ZapLoader } from '@/components/atoms';
import type { Lead } from '@/types';

interface LeadWithModel extends Lead {
  scooter_models: { name: string } | null;
}

const statusOptions = ['all', 'new', 'contacted', 'qualified', 'converted', 'lost'];
const sourceOptions = ['all', 'website', 'enquiry_form', 'test_ride_form', 'facebook', 'instagram', 'google_ads', 'referral'];

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadWithModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [selectedLead, setSelectedLead] = useState<LeadWithModel | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/leads');
      if (response.ok) {
        const data = await response.json();
        setLeads(data as LeadWithModel[]);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial data fetch on mount
    fetchLeads();
  }, [fetchLeads]);

  const updateLeadStatus = async (leadId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });

      if (response.ok) {
        setLeads(leads.map(lead =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead
        ));
        if (selectedLead?.id === leadId) {
          setSelectedLead({ ...selectedLead, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
    setIsUpdating(false);
  };

  const filteredLeads = leads.filter((lead) => {
    if (statusFilter !== 'all' && lead.status !== statusFilter) return false;
    if (sourceFilter !== 'all' && lead.source !== sourceFilter) return false;
    return true;
  });

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'success' | 'warning' | 'error' => {
    const variants: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'error'> = {
      new: 'default',
      contacted: 'secondary',
      qualified: 'warning',
      converted: 'success',
      lost: 'error',
    };
    return variants[status] || 'default';
  };

  const formatSource = (source: string | null) => {
    if (!source) return '-';
    return source.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const columns: Column<LeadWithModel>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone' },
    { key: 'city', header: 'City', sortable: true },
    {
      key: 'model_id',
      header: 'Interested In',
      render: (lead) => lead.scooter_models?.name || 'Any model',
    },
    {
      key: 'source',
      header: 'Source',
      render: (lead) => formatSource(lead.source),
    },
    {
      key: 'status',
      header: 'Status',
      render: (lead) => (
        <Badge variant={getStatusVariant(lead.status)}>
          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
        </Badge>
      ),
    },
    {
      key: 'created_at',
      header: 'Date',
      sortable: true,
      render: (lead) => new Date(lead.created_at).toLocaleDateString('en-IN'),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ZapLoader size="lg" text="Loading leads..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Heading level={2}>Leads</Heading>
          <Text color="muted">Manage and track customer enquiries ({leads.length} total)</Text>
        </div>
        <Button leftIcon={<Download size={16} />} variant="outline">
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card variant="default" className="p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-text-muted" />
            <span className="text-sm text-text-muted">Filters:</span>
          </div>
          <div className="flex gap-4 flex-wrap">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-40"
            >
              {statusOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'all' ? 'All Status' : option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </Select>
            <Select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="w-40"
            >
              {sourceOptions.map((option) => (
                <option key={option} value={option}>
                  {option === 'all' ? 'All Sources' : formatSource(option)}
                </option>
              ))}
            </Select>
          </div>
          {(statusFilter !== 'all' || sourceFilter !== 'all') && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setSourceFilter('all');
              }}
              className="text-sm text-primary hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </Card>

      {/* Table */}
      <Card variant="default" className="p-6">
        {filteredLeads.length === 0 ? (
          <div className="text-center py-12">
            <Text color="muted">No leads found</Text>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredLeads}
            searchPlaceholder="Search leads..."
            onRowClick={setSelectedLead}
            actions={(lead) => (
              <div className="flex items-center gap-2 justify-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLead(lead);
                  }}
                  className="p-2 rounded hover:bg-surface transition-colors"
                  aria-label="View details"
                >
                  <Eye size={16} className="text-text-muted" />
                </button>
                <a
                  href={`tel:${lead.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded hover:bg-surface transition-colors"
                  aria-label="Call"
                >
                  <Phone size={16} className="text-text-muted" />
                </a>
                <a
                  href={`mailto:${lead.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded hover:bg-surface transition-colors"
                  aria-label="Email"
                >
                  <Mail size={16} className="text-text-muted" />
                </a>
              </div>
            )}
          />
        )}
      </Card>

      {/* Lead Detail Modal */}
      <Modal
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        title="Lead Details"
        size="md"
      >
        {selectedLead && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-heading font-semibold text-text-primary">
                  {selectedLead.name}
                </h3>
                <p className="text-text-muted">{selectedLead.city}</p>
              </div>
              <Badge variant={getStatusVariant(selectedLead.status)}>
                {selectedLead.status.charAt(0).toUpperCase() + selectedLead.status.slice(1)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-muted">Email</p>
                <a href={`mailto:${selectedLead.email}`} className="text-primary hover:underline">
                  {selectedLead.email}
                </a>
              </div>
              <div>
                <p className="text-sm text-text-muted">Phone</p>
                <a href={`tel:${selectedLead.phone}`} className="text-primary hover:underline">
                  {selectedLead.phone}
                </a>
              </div>
              <div>
                <p className="text-sm text-text-muted">Interested In</p>
                <p className="font-medium">{selectedLead.scooter_models?.name || 'Any model'}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Source</p>
                <p className="font-medium">{formatSource(selectedLead.source)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-text-muted">Submitted</p>
                <p className="font-medium">
                  {new Date(selectedLead.created_at).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            </div>

            {selectedLead.message && (
              <div>
                <p className="text-sm text-text-muted mb-2">Message</p>
                <p className="p-3 bg-surface rounded-lg">{selectedLead.message}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Select
                value={selectedLead.status}
                onChange={(e) => updateLeadStatus(selectedLead.id, e.target.value)}
                className="flex-1"
                disabled={isUpdating}
              >
                {statusOptions.filter(s => s !== 'all').map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
