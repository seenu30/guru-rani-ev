'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Fuel, Zap, TrendingDown, IndianRupee } from 'lucide-react';
import { Container } from '@/components/layouts/Container';
import { Section } from '@/components/layouts/Section';
import { Card } from '@/components/molecules/Card';
import { fadeIn, slideUp, staggerContainer } from '@/lib/animations';
import { formatPrice } from '@/lib/utils';

// Calculator assumptions
const PETROL_PRICE_PER_LITER = 105;
const ELECTRICITY_PRICE_PER_UNIT = 8;
const PETROL_MILEAGE_KM_PER_LITER = 45;
const EV_EFFICIENCY_KM_PER_UNIT = 15;
const DAYS_PER_MONTH = 26;

export function SavingsCalculator() {
  const [dailyKm, setDailyKm] = useState(30);

  const calculations = useMemo(() => {
    const monthlyKm = dailyKm * DAYS_PER_MONTH;
    const annualKm = monthlyKm * 12;

    // Petrol costs
    const petrolLitersPerMonth = monthlyKm / PETROL_MILEAGE_KM_PER_LITER;
    const petrolCostPerMonth = petrolLitersPerMonth * PETROL_PRICE_PER_LITER;
    const petrolCostPerYear = petrolCostPerMonth * 12;

    // Electric costs
    const electricUnitsPerMonth = monthlyKm / EV_EFFICIENCY_KM_PER_UNIT;
    const electricCostPerMonth = electricUnitsPerMonth * ELECTRICITY_PRICE_PER_UNIT;
    const electricCostPerYear = electricCostPerMonth * 12;

    // Savings
    const monthlySavings = petrolCostPerMonth - electricCostPerMonth;
    const annualSavings = petrolCostPerYear - electricCostPerYear;
    const savingsPercentage = ((petrolCostPerMonth - electricCostPerMonth) / petrolCostPerMonth) * 100;

    return {
      monthlyKm,
      annualKm,
      petrolCostPerMonth: Math.round(petrolCostPerMonth),
      petrolCostPerYear: Math.round(petrolCostPerYear),
      electricCostPerMonth: Math.round(electricCostPerMonth),
      electricCostPerYear: Math.round(electricCostPerYear),
      monthlySavings: Math.round(monthlySavings),
      annualSavings: Math.round(annualSavings),
      savingsPercentage: Math.round(savingsPercentage),
    };
  }, [dailyKm]);

  return (
    <Section className="bg-surface">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={slideUp} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text-primary mb-4">
              Calculate Your Savings
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              See how much you can save by switching to electric. Adjust your daily commute to see real savings.
            </p>
          </motion.div>

          {/* Calculator */}
          <motion.div variants={slideUp}>
            <Card variant="elevated" padding="lg" className="mb-8">
              {/* Slider Section */}
              <div className="text-center mb-8">
                <label className="block text-sm font-medium text-text-secondary mb-4">
                  Daily Commute Distance
                </label>

                {/* Odometer Display */}
                <div className="relative inline-flex items-center justify-center mb-6">
                  <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
                    <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-background flex flex-col items-center justify-center">
                      <span className="text-5xl md:text-6xl font-heading font-bold text-accent">
                        {dailyKm}
                      </span>
                      <span className="text-sm text-text-muted mt-1">km / day</span>
                    </div>
                  </div>
                </div>

                {/* Slider */}
                <div className="max-w-md mx-auto">
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={dailyKm}
                    onChange={(e) => setDailyKm(Number(e.target.value))}
                    className="w-full h-2 bg-primary/20 rounded-full appearance-none cursor-pointer accent-primary
                      [&::-webkit-slider-thumb]:appearance-none
                      [&::-webkit-slider-thumb]:w-6
                      [&::-webkit-slider-thumb]:h-6
                      [&::-webkit-slider-thumb]:rounded-full
                      [&::-webkit-slider-thumb]:bg-primary
                      [&::-webkit-slider-thumb]:shadow-lg
                      [&::-webkit-slider-thumb]:cursor-pointer
                      [&::-webkit-slider-thumb]:transition-transform
                      [&::-webkit-slider-thumb]:hover:scale-110"
                  />
                  <div className="flex justify-between text-xs text-text-muted mt-2">
                    <span>5 km</span>
                    <span>75 km</span>
                    <span>150 km</span>
                  </div>
                </div>
              </div>

              {/* Comparison */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Petrol Cost */}
                <div className="p-6 bg-error/5 border border-error/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center">
                      <Fuel size={20} className="text-error" />
                    </div>
                    <span className="font-medium text-text-primary">Petrol Scooter</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Monthly Cost</span>
                      <span className="font-semibold text-error">
                        {formatPrice(calculations.petrolCostPerMonth)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Annual Cost</span>
                      <span className="font-semibold text-error">
                        {formatPrice(calculations.petrolCostPerYear)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Electric Cost */}
                <div className="p-6 bg-success/5 border border-success/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                      <Zap size={20} className="text-success" />
                    </div>
                    <span className="font-medium text-text-primary">Guru Rani Electric</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Monthly Cost</span>
                      <span className="font-semibold text-success">
                        {formatPrice(calculations.electricCostPerMonth)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Annual Cost</span>
                      <span className="font-semibold text-success">
                        {formatPrice(calculations.electricCostPerYear)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Savings Summary */}
              <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <TrendingDown size={24} className="text-primary" />
                  <span className="text-lg font-medium text-text-primary">Your Savings</span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl md:text-3xl font-heading font-bold text-primary">
                      {calculations.savingsPercentage}%
                    </p>
                    <p className="text-sm text-text-muted">Less Cost</p>
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-heading font-bold text-primary">
                      {formatPrice(calculations.monthlySavings)}
                    </p>
                    <p className="text-sm text-text-muted">Monthly</p>
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-heading font-bold text-primary">
                      {formatPrice(calculations.annualSavings)}
                    </p>
                    <p className="text-sm text-text-muted">Annually</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Disclaimer */}
            <p className="text-xs text-text-muted text-center">
              * Calculations based on petrol price of ₹{PETROL_PRICE_PER_LITER}/L, electricity ₹{ELECTRICITY_PRICE_PER_UNIT}/unit,
              petrol mileage of {PETROL_MILEAGE_KM_PER_LITER} km/L, and EV efficiency of {EV_EFFICIENCY_KM_PER_UNIT} km/unit.
              Actual savings may vary based on riding conditions and local rates.
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </Section>
  );
}

export default SavingsCalculator;
