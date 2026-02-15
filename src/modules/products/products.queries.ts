import { createClient as createServerClient } from '@/lib/supabase/server';
import type { ScooterModel, Variant, Color } from '@/types';

export interface ProductWithVariants extends ScooterModel {
  variants: (Variant & { colors: Color[] })[];
}

export interface FeaturedProduct extends ScooterModel {
  variants: {
    id: string;
    name: string;
    price: number;
    range_km: number;
    top_speed: number;
    battery: string;
  }[];
}

export const productsQueries = {
  /**
   * Get all active scooter models
   */
  async getAll(): Promise<ScooterModel[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('scooter_models')
      .select('*')
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return (data || []) as ScooterModel[];
  },

  /**
   * Get a single model by slug with all variants and colors
   */
  async getBySlug(slug: string): Promise<ProductWithVariants | null> {
    const supabase = await createServerClient();

    // Get the model
    const { data: model, error: modelError } = await supabase
      .from('scooter_models')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .is('deleted_at', null)
      .single();

    if (modelError || !model) return null;

    // Cast model to proper type
    const typedModel = model as unknown as ScooterModel;

    // Get variants with colors
    const { data: variants, error: variantsError } = await supabase
      .from('variants')
      .select(`
        *,
        colors (*)
      `)
      .eq('model_id', typedModel.id)
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    if (variantsError) throw variantsError;

    return {
      ...typedModel,
      variants: (variants || []) as unknown as (Variant & { colors: Color[] })[],
    };
  },

  /**
   * Get a single model by ID
   */
  async getById(id: string) {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('scooter_models')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get all models with their variants for comparison
   */
  async getAllForComparison(): Promise<ProductWithVariants[]> {
    const supabase = await createServerClient();

    const { data: models, error: modelsError } = await supabase
      .from('scooter_models')
      .select('*')
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('sort_order', { ascending: true });

    if (modelsError) throw modelsError;
    if (!models) return [];

    // Cast models to proper type
    const typedModels = models as unknown as ScooterModel[];

    // Get all variants for these models
    const modelIds = typedModels.map((m) => m.id);
    const { data: variants, error: variantsError } = await supabase
      .from('variants')
      .select(`
        *,
        colors (*)
      `)
      .in('model_id', modelIds)
      .eq('status', 'active')
      .order('sort_order', { ascending: true });

    if (variantsError) throw variantsError;

    // Cast variants to proper type
    const typedVariants = (variants || []) as unknown as (Variant & { colors: Color[] })[];

    // Map variants to their models
    return typedModels.map((model) => ({
      ...model,
      variants: typedVariants.filter((v) => v.model_id === model.id),
    }));
  },

  /**
   * Get featured models (for homepage)
   */
  async getFeatured(limit: number = 3): Promise<FeaturedProduct[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('scooter_models')
      .select(`
        *,
        variants (
          id,
          name,
          price,
          range_km,
          top_speed,
          battery
        )
      `)
      .eq('status', 'active')
      .is('deleted_at', null)
      .order('sort_order', { ascending: true })
      .limit(limit);

    if (error) throw error;
    return (data || []) as unknown as FeaturedProduct[];
  },
};

export default productsQueries;
