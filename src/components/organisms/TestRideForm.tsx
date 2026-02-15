'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, addDays, startOfToday } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { FormField } from '@/components/molecules/FormField';
import { Card } from '@/components/molecules/Card';
import { Alert } from '@/components/molecules/Alert';
import { TIME_SLOTS } from '@/modules/bookings/bookings.validation';
import { createClient } from '@/lib/supabase/client';
import { z } from 'zod';

interface Model {
  id: string;
  name: string;
}

interface Dealer {
  id: string;
  name: string;
  city: string;
}

import 'react-day-picker/style.css';

interface TestRideFormProps {
  preselectedDealer?: string;
  preselectedModel?: string;
  onSuccess?: () => void;
}

// Form schema with Date type for bookingDate
const formSchema = z.object({
  name: z.string().min(2, 'Name is required').max(100),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be 10 digits').max(10),
  dealerId: z.string().min(1, 'Please select a dealer'),
  modelId: z.string().optional(),
  bookingDate: z.date().optional(),
  timeSlot: z.string().min(1, 'Please select a time slot'),
});

type FormData = z.infer<typeof formSchema>;

export function TestRideForm({
  preselectedDealer,
  preselectedModel,
  onSuccess,
}: TestRideFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);

  const today = startOfToday();
  const maxDate = addDays(today, 30);

  // Fetch models and dealers
  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch models
      const { data: modelsData } = await supabase
        .from('scooter_models')
        .select('id, name')
        .eq('status', 'active')
        .is('deleted_at', null)
        .order('sort_order');

      if (modelsData) {
        setModels(modelsData);
      }

      // Fetch dealers
      const { data: dealersData } = await supabase
        .from('dealers')
        .select('id, name, city')
        .eq('is_active', true)
        .order('city');

      if (dealersData) {
        setDealers(dealersData);
      }
    };

    fetchData();
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dealerId: preselectedDealer || '',
      modelId: preselectedModel || '',
      bookingDate: undefined,
      timeSlot: '',
    },
  });

  const selectedDate = watch('bookingDate');
  const selectedDealer = watch('dealerId');

  // Close date picker on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.date-picker-container')) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const onSubmit = async (data: FormData) => {
    if (!data.bookingDate) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          dealerId: data.dealerId,
          modelId: data.modelId || undefined,
          bookingDate: format(data.bookingDate, 'yyyy-MM-dd'),
          timeSlot: data.timeSlot,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to book test ride');
      }

      setSubmitStatus('success');
      onSuccess?.();
    } catch (error) {
      console.error('Booking error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-success/20 flex items-center justify-center">
          <CheckCircle size={32} className="text-success" />
        </div>
        <h3 className="text-2xl font-heading font-bold text-text-primary mb-3">
          Booking Confirmed!
        </h3>
        <p className="text-text-muted mb-6 max-w-md mx-auto">
          Your test ride has been booked. You will receive a confirmation email
          shortly with all the details.
        </p>
        <Button onClick={() => setSubmitStatus('idle')}>Book Another Ride</Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitStatus === 'error' && (
        <Alert variant="error" title="Booking Failed">
          Something went wrong. Please try again or contact our support team.
        </Alert>
      )}

      {/* Personal Details */}
      <Card variant="outlined">
        <div className="p-6">
          <h3 className="font-heading font-semibold text-text-primary mb-4">
            Personal Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Full Name"
              htmlFor="name"
              error={errors.name?.message}
              required
            >
              <Input
                id="name"
                placeholder="Enter your full name"
                {...register('name')}
              />
            </FormField>

            <FormField
              label="Email Address"
              htmlFor="email"
              error={errors.email?.message}
              required
            >
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register('email')}
              />
            </FormField>

            <FormField
              label="Phone Number"
              htmlFor="phone"
              error={errors.phone?.message}
              required
              className="md:col-span-2"
            >
              <div className="flex">
                <span className="inline-flex items-center px-3 bg-surface border border-r-0 border-surface rounded-l-lg text-text-muted">
                  +91
                </span>
                <Input
                  id="phone"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className="rounded-l-none"
                  {...register('phone')}
                />
              </div>
            </FormField>
          </div>
        </div>
      </Card>

      {/* Dealer & Model Selection */}
      <Card variant="outlined">
        <div className="p-6">
          <h3 className="font-heading font-semibold text-text-primary mb-4">
            Select Dealer & Model
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Dealer Location"
              htmlFor="dealerId"
              error={errors.dealerId?.message}
              required
            >
              <Select id="dealerId" {...register('dealerId')}>
                <option value="">Select a dealer</option>
                {dealers.map((dealer) => (
                  <option key={dealer.id} value={dealer.id}>
                    {dealer.name} - {dealer.city}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Model (Optional)"
              htmlFor="modelId"
              error={errors.modelId?.message}
            >
              <Select id="modelId" {...register('modelId')}>
                <option value="">Any model</option>
                {models.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </Select>
            </FormField>
          </div>
        </div>
      </Card>

      {/* Date & Time Selection */}
      <Card variant="outlined">
        <div className="p-6">
          <h3 className="font-heading font-semibold text-text-primary mb-4">
            Select Date & Time
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Picker */}
            <FormField
              label="Preferred Date"
              htmlFor="bookingDate"
              required
            >
              <div className="relative date-picker-container">
                <button
                  type="button"
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 border border-surface rounded-lg text-left hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <Calendar size={18} className="text-text-muted" />
                  {selectedDate ? (
                    <span className="text-text-primary">
                      {format(selectedDate, 'EEE, MMM d, yyyy')}
                    </span>
                  ) : (
                    <span className="text-text-muted">Select a date</span>
                  )}
                </button>

                <AnimatePresence>
                  {showDatePicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-50 mt-2 p-4 bg-white rounded-lg shadow-lg border border-surface"
                    >
                      <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setValue('bookingDate', date);
                          setShowDatePicker(false);
                        }}
                        disabled={[
                          { before: today },
                          { after: maxDate },
                          { dayOfWeek: [0] }, // Disable Sundays
                        ]}
                        modifiersClassNames={{
                          selected: 'bg-primary text-white',
                          today: 'font-bold text-accent',
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FormField>

            {/* Time Slot */}
            <FormField
              label="Preferred Time"
              htmlFor="timeSlot"
              error={errors.timeSlot?.message}
              required
            >
              <div className="grid grid-cols-2 gap-2">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = watch('timeSlot') === slot;
                  return (
                    <label
                      key={slot}
                      className={`flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-surface hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        value={slot}
                        {...register('timeSlot')}
                        className="sr-only"
                      />
                      <Clock size={14} className={isSelected ? 'text-primary' : 'text-text-muted'} />
                      <span className="text-sm">{slot.split(' - ')[0]}</span>
                    </label>
                  );
                })}
              </div>
            </FormField>
          </div>
        </div>
      </Card>

      {/* Submit */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <p className="text-sm text-text-muted">
          By booking, you agree to our terms and conditions
        </p>
        <Button
          type="submit"
          size="lg"
          isLoading={isSubmitting}
          disabled={!selectedDate || !selectedDealer}
        >
          Book Test Ride
        </Button>
      </div>
    </form>
  );
}

export default TestRideForm;
