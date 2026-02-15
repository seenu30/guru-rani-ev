'use client';

import { motion } from 'framer-motion';
import {
  Zap,
  Shield,
  Wrench,
  Leaf,
  IndianRupee,
  Smartphone,
  MapPin,
  Award,
} from 'lucide-react';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { Card } from '@/components/molecules/Card';
import { slideUp, staggerContainer } from '@/lib/animations';

const features = [
  {
    icon: Zap,
    title: 'Powerful Performance',
    description: 'Up to 100 km/h top speed with instant torque for a thrilling ride experience.',
  },
  {
    icon: Shield,
    title: '3 Year Warranty',
    description: 'Comprehensive warranty on battery and motor. Ride with confidence.',
  },
  {
    icon: Wrench,
    title: 'Easy Maintenance',
    description: 'No oil changes, minimal moving parts. Just charge and go.',
  },
  {
    icon: Leaf,
    title: 'Zero Emissions',
    description: 'Contribute to cleaner air and a greener future for India.',
  },
  {
    icon: IndianRupee,
    title: 'Maximum Savings',
    description: 'Save up to ₹40,000 annually on fuel costs compared to petrol.',
  },
  {
    icon: Smartphone,
    title: 'Smart Connected',
    description: 'Track your rides, locate your scooter, and more with our app.',
  },
  {
    icon: MapPin,
    title: 'Local Service',
    description: 'Dedicated service center in Gangavaram, Andhra Pradesh.',
  },
  {
    icon: Award,
    title: 'Award Winning',
    description: 'Recognized for innovation and design excellence in the EV industry.',
  },
];

export function WhyChooseUs() {
  return (
    <Section>
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {/* Header */}
          <motion.div variants={slideUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
              Why Choose Guru Rani?
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              More than just an electric scooter. A complete ecosystem designed for the modern Indian commuter.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={slideUp}
                custom={index}
              >
                <Card
                  variant="outlined"
                  padding="md"
                  hover
                  className="h-full text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <feature.icon size={24} className="text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-text-primary mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-text-muted">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}

export default WhyChooseUs;
