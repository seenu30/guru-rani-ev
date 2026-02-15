'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, MapPin } from 'lucide-react';
import { Card } from '@/components/molecules/Card';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Heading, Text } from '@/components/atoms/Typography';
import { createClient } from '@/lib/supabase/client';
import type { Dealer } from '@/types';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan',
  'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal',
];

export default function AdminDealerEditPage() {
  const router = useRouter();
  const params = useParams();
  const dealerId = params.id as string;
  const isNew = dealerId === 'new';

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [dealer, setDealer] = useState<Partial<Dealer>>({
    name: '',
    address: '',
    city: '',
    state: 'Maharashtra',
    pincode: '',
    phone: '',
    email: '',
    latitude: 0,
    longitude: 0,
    timings: 'Mon-Sat: 10AM-8PM, Sun: 11AM-6PM',
    is_active: true,
  });

  useEffect(() => {
    if (!isNew) {
      fetchDealer();
    }
  }, [isNew, dealerId]);

  const fetchDealer = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from('dealers')
      .select('*')
      .eq('id', dealerId)
      .single();

    if (error || !data) {
      router.push('/admin/dealers');
      return;
    }

    setDealer(data as Dealer);
    setIsLoading(false);
  };

  const handleChange = (field: keyof Dealer, value: string | number | boolean) => {
    setDealer((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!dealer.name || !dealer.address || !dealer.city || !dealer.phone) {
      alert('Please fill in all required fields');
      return;
    }

    if (!dealer.latitude || !dealer.longitude) {
      alert('Please enter valid coordinates');
      return;
    }

    setIsSaving(true);
    const supabase = createClient();

    try {
      const dealerData = {
        name: dealer.name,
        address: dealer.address,
        city: dealer.city,
        state: dealer.state,
        pincode: dealer.pincode,
        phone: dealer.phone,
        email: dealer.email || null,
        latitude: dealer.latitude,
        longitude: dealer.longitude,
        timings: dealer.timings || null,
        is_active: dealer.is_active,
      };

      if (isNew) {
        const { error } = await supabase
          .from('dealers')
          .insert(dealerData as never)
          .select()
          .single();

        if (error) throw error;
        router.push('/admin/dealers');
      } else {
        const { error } = await supabase
          .from('dealers')
          .update(dealerData as never)
          .eq('id', dealerId);

        if (error) throw error;
      }

      alert('Dealer saved successfully!');
      if (!isNew) {
        setDealer({ ...dealer, ...dealerData });
      }
    } catch (error) {
      console.error('Error saving dealer:', error);
      alert('Error saving dealer. Please try again.');
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
          <Link href="/admin/dealers">
            <Button variant="ghost" size="sm">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <Heading level={2}>{isNew ? 'Add Dealer' : 'Edit Dealer'}</Heading>
            <Text color="muted">{isNew ? 'Add a new dealer location' : dealer.name}</Text>
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
            <h3 className="font-heading font-semibold text-text-primary mb-4">Dealer Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Name <span className="text-error">*</span>
                </label>
                <Input
                  value={dealer.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="e.g., Guru Rani Experience Center - Mumbai"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Address <span className="text-error">*</span>
                </label>
                <Textarea
                  value={dealer.address || ''}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Full street address"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    City <span className="text-error">*</span>
                  </label>
                  <Input
                    value={dealer.city || ''}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="e.g., Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    State <span className="text-error">*</span>
                  </label>
                  <select
                    value={dealer.state || 'Maharashtra'}
                    onChange={(e) => handleChange('state', e.target.value)}
                    className="w-full px-3 py-2 border border-surface rounded-lg bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Pincode <span className="text-error">*</span>
                  </label>
                  <Input
                    value={dealer.pincode || ''}
                    onChange={(e) => handleChange('pincode', e.target.value)}
                    placeholder="e.g., 400050"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Phone <span className="text-error">*</span>
                  </label>
                  <Input
                    value={dealer.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+91 22 1234 5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                  <Input
                    type="email"
                    value={dealer.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    placeholder="dealer@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">Timings</label>
                <Input
                  value={dealer.timings || ''}
                  onChange={(e) => handleChange('timings', e.target.value)}
                  placeholder="e.g., Mon-Sat: 10AM-8PM, Sun: 11AM-6PM"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card variant="default" className="p-6">
            <h3 className="font-heading font-semibold text-text-primary mb-4">Location</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Latitude <span className="text-error">*</span>
                </label>
                <Input
                  type="number"
                  step="0.000001"
                  value={dealer.latitude || ''}
                  onChange={(e) => handleChange('latitude', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 19.0596"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Longitude <span className="text-error">*</span>
                </label>
                <Input
                  type="number"
                  step="0.000001"
                  value={dealer.longitude || ''}
                  onChange={(e) => handleChange('longitude', parseFloat(e.target.value) || 0)}
                  placeholder="e.g., 72.8295"
                />
              </div>
              {dealer.latitude && dealer.longitude && (
                <a
                  href={`https://www.google.com/maps?q=${dealer.latitude},${dealer.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <MapPin size={16} />
                  View on Google Maps
                </a>
              )}
              <p className="text-xs text-text-muted">
                Tip: Find coordinates on{' '}
                <a
                  href="https://www.latlong.net/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  latlong.net
                </a>
              </p>
            </div>
          </Card>

          <Card variant="default" className="p-6">
            <h3 className="font-heading font-semibold text-text-primary mb-4">Status</h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox
                checked={dealer.is_active || false}
                onChange={(e) => handleChange('is_active', e.target.checked)}
              />
              <span className="text-text-primary">Active</span>
            </label>
            <p className="text-sm text-text-muted mt-2">
              Inactive dealers won&apos;t appear on the dealer locator map.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
