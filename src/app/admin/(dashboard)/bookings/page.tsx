'use client';

import { useState, useEffect, useCallback } from 'react';
import { Calendar, Download, Filter, Eye, Phone, Check, X } from 'lucide-react';
import { DataTable, type Column } from '@/components/organisms/DataTable';
import { Card } from '@/components/molecules/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Select } from '@/components/atoms/Select';
import { Modal } from '@/components/molecules/Modal';
import { Heading, Text } from '@/components/atoms/Typography';
import { ZapLoader } from '@/components/atoms';
import type { TestRideBooking, Dealer } from '@/types';

interface BookingWithRelations extends TestRideBooking {
  dealers: { name: string; city: string } | null;
  scooter_models: { name: string } | null;
}

const statusOptions = ['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no_show'];

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dealerFilter, setDealerFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingWithRelations | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data.bookings as BookingWithRelations[]);
        setDealers(data.dealers);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial data fetch on mount
    fetchData();
  }, [fetchData]);

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: newStatus }),
      });

      if (response.ok) {
        setBookings(bookings.map(booking =>
          booking.id === bookingId ? { ...booking, status: newStatus } : booking
        ));
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking({ ...selectedBooking, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
    setIsUpdating(false);
  };

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter !== 'all' && booking.status !== statusFilter) return false;
    if (dealerFilter !== 'all' && booking.dealer_id !== dealerFilter) return false;
    return true;
  });

  const getStatusVariant = (status: string): 'default' | 'secondary' | 'success' | 'warning' | 'error' => {
    const variants: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'error'> = {
      pending: 'warning',
      confirmed: 'secondary',
      completed: 'success',
      cancelled: 'error',
      no_show: 'error',
    };
    return variants[status] || 'default';
  };

  const formatStatus = (status: string) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const columns: Column<BookingWithRelations>[] = [
    { key: 'name', header: 'Customer', sortable: true },
    {
      key: 'dealer_id',
      header: 'Dealer',
      render: (booking) => booking.dealers?.name || '-',
    },
    {
      key: 'model_id',
      header: 'Model',
      render: (booking) => booking.scooter_models?.name || 'Any model',
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      render: (booking) => (
        <div>
          <p className="font-medium">{new Date(booking.booking_date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
          <p className="text-xs text-text-muted">{booking.time_slot.split(' - ')[0]}</p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (booking) => (
        <Badge variant={getStatusVariant(booking.status)}>
          {formatStatus(booking.status)}
        </Badge>
      ),
    },
  ];

  // Get upcoming bookings count for today
  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.booking_date === today && ['pending', 'confirmed'].includes(b.status));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ZapLoader size="lg" text="Loading bookings..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Heading level={2}>Test Ride Bookings</Heading>
          <Text color="muted">Manage test ride appointments ({bookings.length} total)</Text>
        </div>
        <div className="flex gap-3">
          <Button leftIcon={<Calendar size={16} />} variant="outline">
            Calendar View
          </Button>
          <Button leftIcon={<Download size={16} />} variant="outline">
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Today', value: todayBookings.length, color: 'bg-primary' },
          { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'bg-warning' },
          { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'bg-success' },
          { label: 'No Shows', value: bookings.filter(b => b.status === 'no_show').length, color: 'bg-error' },
        ].map((stat) => (
          <Card key={stat.label} variant="default" className="p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg ${stat.color}/20 flex items-center justify-center`}>
                <span className={`text-lg font-bold ${stat.color.replace('bg-', 'text-')}`}>{stat.value}</span>
              </div>
              <span className="text-text-secondary">{stat.label}</span>
            </div>
          </Card>
        ))}
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
                  {option === 'all' ? 'All Status' : formatStatus(option)}
                </option>
              ))}
            </Select>
            <Select
              value={dealerFilter}
              onChange={(e) => setDealerFilter(e.target.value)}
              className="w-48"
            >
              <option value="all">All Dealers</option>
              {dealers.map((dealer) => (
                <option key={dealer.id} value={dealer.id}>
                  {dealer.name}
                </option>
              ))}
            </Select>
          </div>
          {(statusFilter !== 'all' || dealerFilter !== 'all') && (
            <button
              onClick={() => {
                setStatusFilter('all');
                setDealerFilter('all');
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
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <Text color="muted">No bookings found</Text>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredBookings}
            searchPlaceholder="Search bookings..."
            onRowClick={setSelectedBooking}
            actions={(booking) => (
              <div className="flex items-center gap-1 justify-end">
                {booking.status === 'pending' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateBookingStatus(booking.id, 'confirmed');
                      }}
                      className="p-2 rounded hover:bg-success/10 transition-colors"
                      aria-label="Confirm"
                      title="Confirm"
                      disabled={isUpdating}
                    >
                      <Check size={16} className="text-success" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateBookingStatus(booking.id, 'cancelled');
                      }}
                      className="p-2 rounded hover:bg-error/10 transition-colors"
                      aria-label="Cancel"
                      title="Cancel"
                      disabled={isUpdating}
                    >
                      <X size={16} className="text-error" />
                    </button>
                  </>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedBooking(booking);
                  }}
                  className="p-2 rounded hover:bg-surface transition-colors"
                  aria-label="View details"
                >
                  <Eye size={16} className="text-text-muted" />
                </button>
                <a
                  href={`tel:${booking.phone}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 rounded hover:bg-surface transition-colors"
                  aria-label="Call"
                >
                  <Phone size={16} className="text-text-muted" />
                </a>
              </div>
            )}
          />
        )}
      </Card>

      {/* Booking Detail Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onClose={() => setSelectedBooking(null)}
        title="Booking Details"
        size="md"
      >
        {selectedBooking && (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-heading font-semibold text-text-primary">
                  {selectedBooking.name}
                </h3>
                <p className="text-text-muted">
                  {new Date(selectedBooking.booking_date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
              <Badge variant={getStatusVariant(selectedBooking.status)}>
                {formatStatus(selectedBooking.status)}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-text-muted">Email</p>
                <a href={`mailto:${selectedBooking.email}`} className="text-primary hover:underline">
                  {selectedBooking.email}
                </a>
              </div>
              <div>
                <p className="text-sm text-text-muted">Phone</p>
                <a href={`tel:${selectedBooking.phone}`} className="text-primary hover:underline">
                  {selectedBooking.phone}
                </a>
              </div>
              <div>
                <p className="text-sm text-text-muted">Model</p>
                <p className="font-medium">{selectedBooking.scooter_models?.name || 'Any model'}</p>
              </div>
              <div>
                <p className="text-sm text-text-muted">Time Slot</p>
                <p className="font-medium">{selectedBooking.time_slot}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-text-muted">Dealer</p>
                <p className="font-medium">{selectedBooking.dealers?.name || '-'}</p>
                <p className="text-sm text-text-muted">{selectedBooking.dealers?.city || '-'}</p>
              </div>
            </div>

            {selectedBooking.notes && (
              <div>
                <p className="text-sm text-text-muted mb-2">Notes</p>
                <p className="p-3 bg-surface rounded-lg">{selectedBooking.notes}</p>
              </div>
            )}

            <div className="flex gap-3">
              <Select
                value={selectedBooking.status}
                onChange={(e) => updateBookingStatus(selectedBooking.id, e.target.value)}
                className="flex-1"
                disabled={isUpdating}
              >
                {statusOptions.filter(s => s !== 'all').map((option) => (
                  <option key={option} value={option}>
                    {formatStatus(option)}
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
