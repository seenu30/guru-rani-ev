import { createClient as createServerClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Lead } from '@/types';
import type { CreateLeadInput, QueryLeadsInput, UpdateLeadStatusInput } from './leads.validation';

export const leadsQueries = {
  /**
   * Create a new lead (uses admin client to bypass RLS for public form)
   */
  async create(data: CreateLeadInput): Promise<Lead> {
    const supabase = createAdminClient();

    const insertData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city,
      model_id: data.modelId,
      message: data.message,
      source: data.source || 'website',
      status: 'new',
    };

    const { data: lead, error } = await supabase
      .from('leads')
      .insert(insertData as never)
      .select()
      .single();

    if (error) throw error;
    return lead as unknown as Lead;
  },

  /**
   * Get leads with pagination and filtering
   */
  async getAll(params: QueryLeadsInput) {
    const supabase = await createServerClient();
    const { page, limit, status, search, sortBy, sortOrder } = params;

    const offset = (page - 1) * limit;

    let query = supabase
      .from('leads')
      .select('*, scooter_models(name)', { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`);
    }

    // Apply sorting
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) throw error;

    return {
      data: data || [],
      total: count || 0,
      page,
      limit,
    };
  },

  /**
   * Get a single lead by ID
   */
  async getById(id: string): Promise<Lead | null> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('leads')
      .select('*, scooter_models(name)')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  /**
   * Update lead status
   */
  async updateStatus(id: string, data: UpdateLeadStatusInput): Promise<Lead> {
    const supabase = await createServerClient();

    const updateData = {
      status: data.status,
      notes: data.notes,
    };

    const { data: lead, error } = await supabase
      .from('leads')
      .update(updateData as never)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return lead as unknown as Lead;
  },

  /**
   * Delete a lead
   */
  async delete(id: string): Promise<void> {
    const supabase = await createServerClient();

    const { error } = await supabase.from('leads').delete().eq('id', id);

    if (error) throw error;
  },
};

export default leadsQueries;
