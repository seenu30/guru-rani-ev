'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Zap } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card } from '@/components/molecules/Card';
import { Modal } from '@/components/molecules/Modal';

interface Color {
  id: string;
  name: string;
  hex_code: string;
  image_url: string | null;
}

interface Variant {
  id: string;
  name: string;
  price: number;
  range_km: number;
  top_speed: number;
  battery: string;
  charging_time: string;
  motor_power: string;
  boot_space: number | null;
  colors: Color[];
}

interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  image_url: string | null;
  variants: Variant[];
}

interface CompareSelectorProps {
  products: Product[];
  maxSlots?: number;
  onSelectionChange: (selections: CompareSelection[]) => void;
}

export interface CompareSelection {
  product: Product;
  variant: Variant;
}

export function CompareSelector({
  products,
  maxSlots = 3,
  onSelectionChange,
}: CompareSelectorProps) {
  const [selections, setSelections] = useState<(CompareSelection | null)[]>(
    Array(maxSlots).fill(null)
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSlot, setActiveSlot] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleOpenModal = (slotIndex: number) => {
    setActiveSlot(slotIndex);
    setSelectedProduct(null);
    setModalOpen(true);
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleSelectVariant = (variant: Variant) => {
    if (activeSlot === null || !selectedProduct) return;

    const newSelections = [...selections];
    newSelections[activeSlot] = { product: selectedProduct, variant };
    setSelections(newSelections);
    onSelectionChange(newSelections.filter(Boolean) as CompareSelection[]);
    setModalOpen(false);
    setSelectedProduct(null);
    setActiveSlot(null);
  };

  const handleRemove = (slotIndex: number) => {
    const newSelections = [...selections];
    newSelections[slotIndex] = null;
    setSelections(newSelections);
    onSelectionChange(newSelections.filter(Boolean) as CompareSelection[]);
  };

  const isProductSelected = (productId: string, variantId: string) => {
    return selections.some(
      (s) => s?.product.id === productId && s?.variant.id === variantId
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {selections.map((selection, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {selection ? (
              <Card variant="outlined" className="relative h-full min-h-[200px]">
                <button
                  onClick={() => handleRemove(index)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-surface hover:bg-error/10 hover:text-error transition-colors"
                  aria-label="Remove selection"
                >
                  <X size={16} />
                </button>
                <div className="p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center">
                    <Zap size={32} className="text-primary" />
                  </div>
                  <h3 className="font-heading font-semibold text-text-primary">
                    {selection.product.name}
                  </h3>
                  <p className="text-sm text-text-muted mt-1">
                    {selection.variant.name}
                  </p>
                  <p className="text-lg font-semibold text-accent mt-2">
                    ₹{selection.variant.price.toLocaleString('en-IN')}
                  </p>
                </div>
              </Card>
            ) : (
              <button
                onClick={() => handleOpenModal(index)}
                className="w-full h-full min-h-[200px] border-2 border-dashed border-surface hover:border-primary rounded-lg flex flex-col items-center justify-center gap-3 transition-colors group"
              >
                <div className="w-12 h-12 rounded-full bg-surface group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                  <Plus size={24} className="text-text-muted group-hover:text-primary" />
                </div>
                <span className="text-text-muted group-hover:text-primary font-medium">
                  Add Scooter
                </span>
              </button>
            )}
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Select a Scooter"
        size="lg"
      >
        <AnimatePresence mode="wait">
          {!selectedProduct ? (
            <motion.div
              key="products"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelectProduct(product)}
                  className="p-4 border border-surface hover:border-primary rounded-lg text-left transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-surface group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                      <Zap size={24} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary group-hover:text-primary">
                        {product.name}
                      </h4>
                      <p className="text-sm text-text-muted">{product.tagline}</p>
                    </div>
                  </div>
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="variants"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedProduct(null)}
                className="mb-4"
              >
                Back to models
              </Button>
              <h4 className="font-semibold text-text-primary mb-4">
                Select {selectedProduct.name} variant
              </h4>
              <div className="space-y-3">
                {selectedProduct.variants.map((variant) => {
                  const isSelected = isProductSelected(selectedProduct.id, variant.id);
                  return (
                    <button
                      key={variant.id}
                      onClick={() => !isSelected && handleSelectVariant(variant)}
                      disabled={isSelected}
                      className={`w-full p-4 border rounded-lg text-left transition-colors ${
                        isSelected
                          ? 'border-surface bg-surface/50 opacity-50 cursor-not-allowed'
                          : 'border-surface hover:border-primary'
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h5 className="font-medium text-text-primary">
                            {variant.name}
                          </h5>
                          <p className="text-sm text-text-muted">
                            {variant.range_km} km range | {variant.top_speed} km/h
                          </p>
                        </div>
                        <span className="font-semibold text-accent">
                          ₹{variant.price.toLocaleString('en-IN')}
                        </span>
                      </div>
                      {isSelected && (
                        <p className="text-xs text-text-muted mt-2">Already selected</p>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Modal>
    </>
  );
}

export default CompareSelector;
