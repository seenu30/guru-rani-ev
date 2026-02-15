import { createClient as createServerClient } from '@/lib/supabase/server';
import type { Dealer } from '@/types';

export const dealersQueries = {
  /**
   * Get all active dealers
   */
  async getAll(): Promise<Dealer[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('dealers')
      .select('*')
      .eq('is_active', true)
      .order('city', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get dealers by city
   */
  async getByCity(city: string): Promise<Dealer[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('dealers')
      .select('*')
      .eq('is_active', true)
      .ilike('city', `%${city}%`)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Get a single dealer by ID
   */
  async getById(id: string): Promise<Dealer | null> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('dealers')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  /**
   * Get unique cities with dealers
   */
  async getCities(): Promise<string[]> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('dealers')
      .select('city')
      .eq('is_active', true);

    if (error) throw error;

    // Get unique cities - cast to proper type
    const dealers = data as { city: string }[] | null;
    const cities = [...new Set((dealers || []).map((d) => d.city))];
    return cities.sort();
  },

  /**
   * Find dealers near a location (within radius in km)
   * TODO: Implement with PostGIS when RPC function is created
   */
  async findNearby(_lat: number, _lng: number, _radiusKm: number = 50): Promise<Dealer[]> {
    // For now, return all dealers
    // In production, use PostGIS or a proper geospatial query
    return this.getAll();
  },
};

export default dealersQueries;
