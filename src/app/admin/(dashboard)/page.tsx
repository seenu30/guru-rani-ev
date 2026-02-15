'use client';

import { useState, useEffect, useCallback } from 'react';
import { Users, Calendar, TrendingUp, IndianRupee, MapPin, Package } from 'lucide-react';
import { StatCard } from '@/components/organisms/StatCard';
import { DataTable, type Column } from '@/components/organisms/DataTable';
import { Card } from '@/components/molecules/Card';
import { Badge } from '@/components/atoms/Badge';
import { Heading, Text } from '@/components/atoms/Typography';
import { ZapLoader } from '@/components/atoms';
import type { Lead, TestRideBooking } from '@/types';

interface LeadWithModel extends Lead {
  scooter_models: { name: string } | null;
}

interface BookingWithRelations extends TestRideBooking {
  dealers: { name: string } | null;
  scooter_models: { name: string } | null;
}

interface DashboardStats {
  totalLeads: number;
  totalBookings: number;
  convertedLeads: number;
  newLeadsThisMonth: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    totalBookings: 0,
    convertedLeads: 0,
    newLeadsThisMonth: 0,
  });
  const [recentLeads, setRecentLeads] = useState<LeadWithModel[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<BookingWithRelations[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentLeads(data.recentLeads as LeadWithModel[]);
        setUpcomingBookings(data.upcomingBookings as BookingWithRelations[]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initial data fetch on mount
    fetchDashboardData();
  }, [fetchDashboardData]);

  const conversionRate = stats.totalLeads > 0
    ? ((stats.convertedLeads / stats.totalLeads) * 100).toFixed(1)
    : '0';

  const statsData = [
    { title: 'Total Leads', value: stats.totalLeads.toLocaleString(), change: stats.newLeadsThisMonth, icon: <Users size={20} /> },
    { title: 'Test Rides', value: stats.totalBookings.toLocaleString(), change: 0, icon: <Calendar size={20} /> },
    { title: 'Conversion Rate', value: `${conversionRate}%`, change: 0, icon: <TrendingUp size={20} /> },
    { title: 'Converted', value: stats.convertedLeads.toLocaleString(), change: 0, icon: <IndianRupee size={20} /> },
  ];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const leadColumns: Column<LeadWithModel>[] = [
    { key: 'name', header: 'Name', sortable: true },
    { key: 'email', header: 'Email' },
    { key: 'city', header: 'City', sortable: true },
    {
      key: 'model_id',
      header: 'Model',
      render: (lead) => lead.scooter_models?.name || 'Any model',
    },
    {
      key: 'status',
      header: 'Status',
      render: (lead) => {
        const variants: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'error'> = {
          new: 'default',
          contacted: 'secondary',
          qualified: 'warning',
          converted: 'success',
          lost: 'error',
        };
        return (
          <Badge variant={variants[lead.status] || 'default'}>
            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </Badge>
        );
      },
    },
    {
      key: 'created_at',
      header: 'Created',
      render: (lead) => formatTimeAgo(lead.created_at),
    },
  ];

  const bookingColumns: Column<BookingWithRelations>[] = [
    { key: 'name', header: 'Customer' },
    {
      key: 'dealer_id',
      header: 'Dealer',
      render: (booking) => booking.dealers?.name || '-',
    },
    { key: 'date', header: 'Date' },
    { key: 'time_slot', header: 'Time' },
    {
      key: 'status',
      header: 'Status',
      render: (booking) => (
        <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'}>
          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
        </Badge>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <ZapLoader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Heading level={2}>Dashboard</Heading>
        <Text color="muted">Welcome back! Here&apos;s what&apos;s happening today.</Text>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            index={index}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Add Product', icon: Package, href: '/admin/products/new' },
          { label: 'Add Dealer', icon: MapPin, href: '/admin/dealers/new' },
          { label: 'Export Leads', icon: Users, href: '#' },
          { label: 'View Reports', icon: TrendingUp, href: '/admin/reports' },
        ].map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="flex items-center gap-3 p-4 bg-white rounded-lg border border-surface hover:border-primary hover:shadow-sm transition-all group"
          >
            <div className="w-10 h-10 rounded-lg bg-surface group-hover:bg-primary/10 flex items-center justify-center transition-colors">
              <action.icon size={20} className="text-text-muted group-hover:text-primary" />
            </div>
            <span className="font-medium text-text-primary">{action.label}</span>
          </a>
        ))}
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Leads */}
        <Card variant="default" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-semibold text-text-primary">Recent Leads</h3>
              <p className="text-sm text-text-muted">Latest enquiries from customers</p>
            </div>
            <a href="/admin/leads" className="text-sm text-primary hover:underline">
              View all
            </a>
          </div>
          {recentLeads.length > 0 ? (
            <DataTable
              columns={leadColumns}
              data={recentLeads}
              searchable={false}
              pagination={false}
            />
          ) : (
            <div className="text-center py-8">
              <Text color="muted">No leads yet</Text>
            </div>
          )}
        </Card>

        {/* Upcoming Bookings */}
        <Card variant="default" className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-heading font-semibold text-text-primary">Upcoming Test Rides</h3>
              <p className="text-sm text-text-muted">Scheduled appointments</p>
            </div>
            <a href="/admin/bookings" className="text-sm text-primary hover:underline">
              View all
            </a>
          </div>
          {upcomingBookings.length > 0 ? (
            <DataTable
              columns={bookingColumns}
              data={upcomingBookings}
              searchable={false}
              pagination={false}
            />
          ) : (
            <div className="text-center py-8">
              <Text color="muted">No upcoming bookings</Text>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
