'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Gauge, Battery } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Container } from '@/components/layouts/Container';
import { fadeIn, slideUp, staggerContainer } from '@/lib/animations';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-background via-surface/50 to-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent rounded-full blur-3xl" />
      </div>

      <Container className="relative z-10 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="text-center lg:text-left"
          >
            <motion.div variants={slideUp} className="mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                <Zap size={16} />
                Now Available in Andhra Pradesh
              </span>
            </motion.div>

            <motion.h1
              variants={slideUp}
              className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-text-primary mb-6 leading-tight"
            >
              The Future of
              <span className="text-primary block">Urban Mobility</span>
            </motion.h1>

            <motion.p
              variants={slideUp}
              className="text-lg md:text-xl text-text-secondary mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Experience the perfect blend of style, performance, and sustainability.
              Guru Rani electric scooters are designed for the modern Indian commuter.
            </motion.p>

            {/* Quick Stats */}
            <motion.div
              variants={slideUp}
              className="grid grid-cols-3 gap-4 mb-8"
            >
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-primary mb-1">
                  <Gauge size={20} />
                  <span className="text-2xl font-bold text-text-primary">160</span>
                </div>
                <p className="text-sm text-text-muted">km Range</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-primary mb-1">
                  <Zap size={20} />
                  <span className="text-2xl font-bold text-text-primary">100</span>
                </div>
                <p className="text-sm text-text-muted">km/h Top Speed</p>
              </div>
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-primary mb-1">
                  <Battery size={20} />
                  <span className="text-2xl font-bold text-text-primary">4</span>
                </div>
                <p className="text-sm text-text-muted">Hour Charge</p>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={slideUp}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link href="/models">
                <Button size="lg" rightIcon={<ArrowRight size={20} />}>
                  Explore Models
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image/Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Placeholder for scooter image */}
            <div className="relative aspect-square">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full animate-pulse-slow" />
              <div className="absolute inset-8 bg-gradient-to-br from-surface to-background rounded-full flex items-center justify-center">
                <div className="text-center">
                  <Zap size={80} className="text-primary mx-auto mb-4" />
                  <p className="text-lg font-heading font-semibold text-text-primary">
                    Guru Rani X
                  </p>
                  <p className="text-sm text-text-muted">Starting at ₹79,999</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center pt-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;
