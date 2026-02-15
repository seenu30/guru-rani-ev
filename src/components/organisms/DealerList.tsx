'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown } from 'lucide-react';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { DealerCard, type DealerData } from './DealerCard';

interface DealerListProps {
  dealers: DealerData[];
  selectedDealer?: DealerData | null;
  onSelectDealer?: (dealer: DealerData) => void;
}

export function DealerList({
  dealers,
  selectedDealer,
  onSelectDealer,
}: DealerListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const cities = useMemo(() => {
    const uniqueCities = [...new Set(dealers.map((d) => d.city))];
    return uniqueCities.sort();
  }, [dealers]);

  const filteredDealers = useMemo(() => {
    return dealers.filter((dealer) => {
      const matchesSearch =
        searchQuery === '' ||
        dealer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dealer.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dealer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dealer.pincode.includes(searchQuery);

      const matchesCity = selectedCity === '' || dealer.city === selectedCity;

      return matchesSearch && matchesCity;
    });
  }, [dealers, searchQuery, selectedCity]);

  return (
    <div className="flex flex-col h-full">
      {/* Filters */}
      <div className="p-4 border-b border-surface space-y-3">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <Input
            type="text"
            placeholder="Search by name, address, or pincode..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full"
        >
          <option value="">All Cities</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </Select>
      </div>

      {/* Results count */}
      <div className="px-4 py-3 bg-surface/50 border-b border-surface">
        <p className="text-sm text-text-muted">
          {filteredDealers.length} dealer{filteredDealers.length !== 1 ? 's' : ''} found
          {selectedCity && ` in ${selectedCity}`}
        </p>
      </div>

      {/* Dealer list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredDealers.length > 0 ? (
          filteredDealers.map((dealer, index) => (
            <DealerCard
              key={dealer.id}
              dealer={dealer}
              isSelected={selectedDealer?.id === dealer.id}
              onSelect={onSelectDealer}
              index={index}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-text-muted mb-2">No dealers found</p>
            <p className="text-sm text-text-muted">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default DealerList;
