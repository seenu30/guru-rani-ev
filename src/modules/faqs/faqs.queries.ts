import { createClient as createServerClient } from '@/lib/supabase/server';
import type { FAQ } from '@/types';

export interface FAQsByCategory {
  category: string;
  items: FAQ[];
}

export const faqsQueries = {
  /**
   * Get all active FAQs
   */
  async getAll(): Promise<FAQ[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get FAQs grouped by category
   */
  async getByCategory(): Promise<FAQsByCategory[]> {
    const faqs = await this.getAll();

    // Group by category
    const grouped = faqs.reduce(
      (acc, faq) => {
        const category = faq.category;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(faq);
        return acc;
      },
      {} as Record<string, FAQ[]>
    );

    // Convert to array format
    return Object.entries(grouped).map(([category, items]) => ({
      category,
      items,
    }));
  },

  /**
   * Get FAQs for a specific category
   */
  async getForCategory(category: string): Promise<FAQ[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .ilike('category', category)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Search FAQs
   */
  async search(query: string): Promise<FAQ[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .or(`question.ilike.%${query}%,answer.ilike.%${query}%`)
      .order('sort_order', { ascending: true })
      .limit(10);

    if (error) throw error;
    return data || [];
  },

  /**
   * Get unique categories
   */
  async getCategories(): Promise<string[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('faqs')
      .select('category')
      .eq('is_active', true);

    if (error) throw error;

    // Cast to proper type
    const faqs = data as { category: string }[] | null;
    const categories = [...new Set((faqs || []).map((f) => f.category))];
    return categories;
  },
};

export default faqsQueries;
