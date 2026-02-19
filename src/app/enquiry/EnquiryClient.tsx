'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { Heading, Text } from '@/components/atoms/Typography';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import { createClient } from '@/lib/supabase/client';
import { Send, CheckCircle, IndianRupee, Truck, Shield, CreditCard } from 'lucide-react';
import type { ScooterModel } from '@/types';

const benefits = [
  {
    icon: IndianRupee,
    title: 'Best Prices',
    description: 'Get the best on-road price with all subsidies',
  },
  {
    icon: Truck,
    title: 'Free Delivery',
    description: 'Doorstep delivery across India',
  },
  {
    icon: Shield,
    title: '3 Year Warranty',
    description: 'Comprehensive coverage on all components',
  },
  {
    icon: CreditCard,
    title: 'Easy EMI',
    description: 'Flexible financing options available',
  },
];

interface Dealer {
  id: string;
  name: string;
  city: string;
}

export default function EnquiryClient() {
  const searchParams = useSearchParams();
  const preselectedModel = searchParams.get('model') || '';

  const [models, setModels] = useState<ScooterModel[]>([]);
  const [dealers, setDealers] = useState<Dealer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dealer_id: '',
    model_id: preselectedModel,
    message: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      // Fetch models
      const { data: modelsData } = await supabase
        .from('scooter_models')
        .select('id, name, slug')
        .eq('status', 'active')
        .is('deleted_at', null)
        .order('sort_order');

      if (modelsData) {
        setModels(modelsData as ScooterModel[]);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Get city from selected dealer
    const selectedDealer = dealers.find(d => d.id === formData.dealer_id);
    const city = selectedDealer?.city || 'Unknown';

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          city: city,
          modelId: formData.model_id || undefined,
          message: formData.message || undefined,
          source: 'enquiry_form',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit');
      }

      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      alert('Something went wrong. Please try again.');
    }

    setIsLoading(false);
  };

  if (isSubmitted) {
    return (
      <Section background="surface" className="pt-24 pb-24">
        <Container>
          <div className="max-w-lg mx-auto text-center">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-success" />
            </div>
            <Heading level={2} className="mb-4">
              Thank You!
            </Heading>
            <Text size="lg" color="muted" className="mb-8">
              We&apos;ve received your enquiry. Our team will contact you within 24 hours with pricing details and offers.
            </Text>
            <div className="flex gap-4 justify-center">
              <Link href="/models">
                <Button variant="outline">Explore Models</Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <Section background="surface" className="pt-24 pb-12">
        <Container>
          <div className="max-w-2xl mx-auto text-center mb-12">
            <Heading level={1} className="mb-4">
              Get a Quote
            </Heading>
            <Text size="lg" color="muted">
              Interested in a Guru Rani electric scooter? Fill out the form below and we&apos;ll get back to you with the best price and offers.
            </Text>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="flex flex-col items-center text-center p-4 bg-white rounded-xl"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <benefit.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-heading font-semibold text-text-primary text-sm mb-1">
                  {benefit.title}
                </h3>
                <p className="text-xs text-text-muted">{benefit.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Form Section */}
      <Section background="white" className="py-12">
        <Container size="sm">
          <Card variant="elevated" className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Details */}
              <div>
                <h3 className="font-heading font-semibold text-text-primary mb-4">
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Full Name <span className="text-error">*</span>
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Email Address <span className="text-error">*</span>
                    </label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Phone Number <span className="text-error">*</span>
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 bg-surface border border-r-0 border-surface rounded-l-lg text-text-muted">
                        +91
                      </span>
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                      Location <span className="text-error">*</span>
                    </label>
                    <Select
                      name="dealer_id"
                      value={formData.dealer_id}
                      onChange={handleChange}
                      options={[
                        { value: '', label: 'Select location' },
                        ...dealers.map((dealer) => ({ value: dealer.id, label: `${dealer.name} - ${dealer.city}` })),
                      ]}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Model Selection */}
              <div>
                <h3 className="font-heading font-semibold text-text-primary mb-4">
                  Interested In
                </h3>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1">
                    Select Model (Optional)
                  </label>
                  <Select
                    name="model_id"
                    value={formData.model_id}
                    onChange={handleChange}
                    options={[
                      { value: '', label: 'Any model' },
                      ...models.map((model) => ({ value: model.id, label: model.name })),
                    ]}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1">
                  Message (Optional)
                </label>
                <Textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Any specific questions or requirements?"
                  rows={3}
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    'Submitting...'
                  ) : (
                    <>
                      <Send size={18} className="mr-2" />
                      Get Quote
                    </>
                  )}
                </Button>
                <p className="text-xs text-text-muted text-center mt-3">
                  By submitting, you agree to our{' '}
                  <a href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>
            </form>
          </Card>
        </Container>
      </Section>

      {/* Why Guru Rani */}
      <Section background="surface" className="py-12">
        <Container>
          <div className="max-w-2xl mx-auto text-center">
            <Heading level={3} className="mb-4">
              Why Choose Guru Rani?
            </Heading>
            <Text color="muted" className="mb-8">
              Join our growing family of happy riders who&apos;ve made the switch to electric.
            </Text>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-3xl font-heading font-bold text-primary">100+</p>
                <p className="text-sm text-text-muted">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-heading font-bold text-primary">1</p>
                <p className="text-sm text-text-muted">Service Center</p>
              </div>
              <div>
                <p className="text-3xl font-heading font-bold text-primary">4.8★</p>
                <p className="text-sm text-text-muted">Customer Rating</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
