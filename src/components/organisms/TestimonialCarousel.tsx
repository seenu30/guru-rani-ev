'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { Card } from '@/components/molecules/Card';
import { Avatar } from '@/components/atoms/Avatar';
import { slideUp, staggerContainer } from '@/lib/animations';
import { placeholderTestimonials } from '@/data/placeholder-products';

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % placeholderTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? placeholderTestimonials.length - 1 : prev - 1
    );
  };

  const currentTestimonial = placeholderTestimonials[currentIndex];

  return (
    <Section className="bg-surface">
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
              What Our Riders Say
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Hear from our happy riders who have made the switch to electric.
            </p>
          </motion.div>

          {/* Carousel */}
          <motion.div variants={slideUp} className="relative max-w-3xl mx-auto">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center z-10">
              <Quote size={24} className="text-white" />
            </div>

            <Card variant="elevated" padding="lg" className="pt-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  {/* Stars */}
                  <div className="flex items-center justify-center gap-1 mb-6">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={20}
                        className={
                          i < currentTestimonial.rating
                            ? 'text-warning fill-warning'
                            : 'text-gray-300'
                        }
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-lg md:text-xl text-text-primary mb-8 leading-relaxed">
                    &ldquo;{currentTestimonial.text}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-4">
                    <Avatar
                      name={currentTestimonial.name}
                      size="lg"
                    />
                    <div className="text-left">
                      <p className="font-semibold text-text-primary">
                        {currentTestimonial.name}
                      </p>
                      <p className="text-sm text-text-muted">
                        {currentTestimonial.location}
                      </p>
                      <p className="text-sm text-primary font-medium">
                        {currentTestimonial.productName} Owner
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </Card>

            {/* Navigation Buttons */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4 md:-mx-16 pointer-events-none">
              <button
                onClick={prevTestimonial}
                className="p-3 rounded-full bg-background shadow-lg text-text-primary hover:bg-surface transition-colors pointer-events-auto"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-3 rounded-full bg-background shadow-lg text-text-primary hover:bg-surface transition-colors pointer-events-auto"
                aria-label="Next testimonial"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-2 mt-8">
              {placeholderTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex
                      ? 'w-8 bg-primary'
                      : 'bg-primary/30 hover:bg-primary/50'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}

export default TestimonialCarousel;
