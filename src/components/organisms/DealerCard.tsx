'use client';

import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Navigation } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';

export interface DealerData {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email?: string | null;
  latitude: number;
  longitude: number;
  timings?: string | null;
}

interface DealerCardProps {
  dealer: DealerData;
  isSelected?: boolean;
  onSelect?: (dealer: DealerData) => void;
  onNavigate?: (dealer: DealerData) => void;
  index?: number;
}

export function DealerCard({
  dealer,
  isSelected = false,
  onSelect,
  onNavigate,
  index = 0,
}: DealerCardProps) {
  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate(dealer);
    } else {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${dealer.latitude},${dealer.longitude}`,
        '_blank'
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        variant={isSelected ? 'default' : 'outlined'}
        className={`cursor-pointer transition-all ${
          isSelected ? 'ring-2 ring-primary shadow-lg' : 'hover:shadow-md'
        }`}
        onClick={() => onSelect?.(dealer)}
      >
        <div className="p-5">
          <h3 className="font-heading font-semibold text-text-primary mb-3">
            {dealer.name}
          </h3>

          <div className="space-y-2 mb-4">
            <div className="flex items-start gap-2 text-sm">
              <MapPin size={16} className="text-primary mt-0.5 shrink-0" />
              <span className="text-text-secondary">
                {dealer.address}, {dealer.city}, {dealer.state} - {dealer.pincode}
              </span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Phone size={16} className="text-primary shrink-0" />
              <a
                href={`tel:${dealer.phone}`}
                className="text-text-secondary hover:text-primary transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {dealer.phone}
              </a>
            </div>

            {dealer.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail size={16} className="text-primary shrink-0" />
                <a
                  href={`mailto:${dealer.email}`}
                  className="text-text-secondary hover:text-primary transition-colors truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {dealer.email}
                </a>
              </div>
            )}

            {dealer.timings && (
              <div className="flex items-start gap-2 text-sm">
                <Clock size={16} className="text-primary mt-0.5 shrink-0" />
                <span className="text-text-muted">{dealer.timings}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              leftIcon={<Navigation size={14} />}
              onClick={(e) => {
                e.stopPropagation();
                handleNavigate();
              }}
              className="flex-1"
            >
              Get Directions
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/test-ride?dealer=${dealer.id}`;
              }}
              className="flex-1"
            >
              Book Test Ride
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default DealerCard;
