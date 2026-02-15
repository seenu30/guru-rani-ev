'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Search } from 'lucide-react';
import { Input } from '@/components/atoms/Input';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface FAQCategory {
  category: string;
  items: FAQItem[];
}

interface FAQAccordionProps {
  categories: FAQCategory[];
  showSearch?: boolean;
}

export function FAQAccordion({ categories, showSearch = true }: FAQAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = useMemo(() => {
    if (!searchQuery && !selectedCategory) return categories;

    return categories
      .filter((cat) => !selectedCategory || cat.category === selectedCategory)
      .map((cat) => ({
        ...cat,
        items: cat.items.filter(
          (item) =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      }))
      .filter((cat) => cat.items.length > 0);
  }, [categories, searchQuery, selectedCategory]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const totalQuestions = categories.reduce((acc, cat) => acc + cat.items.length, 0);
  const filteredCount = filteredCategories.reduce((acc, cat) => acc + cat.items.length, 0);

  return (
    <div className="space-y-6">
      {/* Search and Category Filter */}
      {showSearch && (
        <div className="space-y-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <Input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-primary text-white'
                  : 'bg-surface text-text-secondary hover:bg-primary/10'
              }`}
            >
              All ({totalQuestions})
            </button>
            {categories.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat.category
                    ? 'bg-primary text-white'
                    : 'bg-surface text-text-secondary hover:bg-primary/10'
                }`}
              >
                {cat.category} ({cat.items.length})
              </button>
            ))}
          </div>

          {searchQuery && (
            <p className="text-sm text-text-muted">
              Found {filteredCount} result{filteredCount !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
            </p>
          )}
        </div>
      )}

      {/* FAQ Categories */}
      <div className="space-y-8">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <div key={category.category}>
              <h3 className="font-heading font-semibold text-lg text-text-primary mb-4">
                {category.category}
              </h3>
              <div className="space-y-3">
                {category.items.map((item) => {
                  const isOpen = openItems.has(item.id);
                  return (
                    <div
                      key={item.id}
                      className="border border-surface rounded-lg overflow-hidden bg-white"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-surface/50 transition-colors"
                        aria-expanded={isOpen}
                      >
                        <span className="font-medium text-text-primary pr-4">
                          {item.question}
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-primary shrink-0"
                        >
                          <ChevronDown size={20} />
                        </motion.span>
                      </button>
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="px-4 pb-4 text-text-secondary leading-relaxed">
                              {item.answer}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-text-muted mb-2">No FAQs found</p>
            <p className="text-sm text-text-muted">
              Try adjusting your search terms
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default FAQAccordion;
