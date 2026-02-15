'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Select } from '@/components/atoms/Select';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { Card } from '@/components/molecules/Card';
import { FormField } from '@/components/molecules/FormField';
import { slideUp, staggerContainer } from '@/lib/animations';
import { createClient } from '@/lib/supabase/client';

interface Model {
  id: string;
  name: string;
}

interface Dealer {
  id: string;
  name: string;
  city: string;
}

const enquirySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit phone number'),
  dealerId: z.string().min(1, 'Please select a location'),
  modelId: z.string().optional(),
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

export function EnquiryForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);

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
    formState: { errors },
    reset,
  } = useForm<EnquiryFormData>({
    resolver: zodResolver(enquirySchema),
  });

  const onSubmit = async (data: EnquiryFormData) => {
    setIsLoading(true);

    // Get city from selected dealer
    const selectedDealer = dealers.find(d => d.id === data.dealerId);
    const city = selectedDealer?.city || 'Unknown';

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          city: city,
          modelId: data.modelId || undefined,
          message: data.message || undefined,
          source: 'website',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      setIsSubmitted(true);
      reset();
    } catch (error) {
      console.error('Enquiry error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Section className="bg-gradient-to-br from-accent to-primary text-white">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div variants={slideUp}>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                Ready to Go Electric?
              </h2>
              <p className="text-white/80 text-lg mb-6">
                Fill out the form and our team will get back to you within 24 hours
                with personalized pricing and availability for your city.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-success" />
                  <span>Free consultation call</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-success" />
                  <span>City-specific pricing</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-success" />
                  <span>Financing options available</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-success" />
                  <span>No obligation to purchase</span>
                </div>
              </div>
            </motion.div>

            {/* Form */}
            <motion.div variants={slideUp}>
              <Card variant="elevated" padding="lg">
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 size={32} className="text-success" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-text-primary mb-2">
                      Thank You!
                    </h3>
                    <p className="text-text-muted mb-4">
                      We&apos;ve received your enquiry. Our team will contact you shortly.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Submit Another Enquiry
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormField label="Full Name" error={errors.name?.message} required>
                      <Input
                        {...register('name')}
                        placeholder="Enter your name"
                        error={!!errors.name}
                      />
                    </FormField>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Email" error={errors.email?.message} required>
                        <Input
                          {...register('email')}
                          type="email"
                          placeholder="you@example.com"
                          error={!!errors.email}
                        />
                      </FormField>

                      <FormField label="Phone" error={errors.phone?.message} required>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 bg-surface border border-r-0 border-surface rounded-l-lg text-text-muted">
                            +91
                          </span>
                          <Input
                            {...register('phone')}
                            type="tel"
                            placeholder="10-digit mobile number"
                            maxLength={10}
                            className="rounded-l-none"
                            error={!!errors.phone}
                          />
                        </div>
                      </FormField>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Location" error={errors.dealerId?.message} required>
                        <Select {...register('dealerId')} error={!!errors.dealerId}>
                          <option value="">Select location</option>
                          {dealers.map((dealer) => (
                            <option key={dealer.id} value={dealer.id}>
                              {dealer.name} - {dealer.city}
                            </option>
                          ))}
                        </Select>
                      </FormField>

                      <FormField label="Interested Model">
                        <Select {...register('modelId')}>
                          <option value="">Any model</option>
                          {models.map((model) => (
                            <option key={model.id} value={model.id}>
                              {model.name}
                            </option>
                          ))}
                        </Select>
                      </FormField>
                    </div>

                    <FormField label="Message (Optional)" error={errors.message?.message}>
                      <Textarea
                        {...register('message')}
                        placeholder="Any specific questions or requirements?"
                        rows={3}
                        error={!!errors.message}
                      />
                    </FormField>

                    <Button
                      type="submit"
                      fullWidth
                      size="lg"
                      isLoading={isLoading}
                      rightIcon={<Send size={18} />}
                    >
                      Get Quote
                    </Button>

                    <p className="text-xs text-text-muted text-center">
                      By submitting, you agree to our Privacy Policy and Terms of Service.
                    </p>
                  </form>
                )}
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

export default EnquiryForm;
