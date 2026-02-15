import { createAdminClient } from '@/lib/supabase/admin';
import { createClient as createServerClient } from '@/lib/supabase/server';
import type { TestRideBooking } from '@/types';
import type { CreateBookingInput, QueryBookingsInput, UpdateBookingStatusInput } from './bookings.validation';

export const bookingsQueries = {
  /**
   * Create a new test ride booking (uses admin client to bypass RLS for public form)
   */
  async create(data: CreateBookingInput): Promise<TestRideBooking> {
    const supabase = createAdminClient();

    const insertData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      dealer_id: data.dealerId,
      model_id: data.modelId || null,
      booking_date: data.bookingDate,
      time_slot: data.timeSlot,
      status: 'pending',
    };

    const { data: booking, error } = await supabase
      .from('test_ride_bookings')
      .insert(insertData as never)
      .select()
      .single();

    if (error) throw error;
    return booking as unknown as TestRideBooking;
  },

  /**
   * Get bookings with pagination and filtering
   */
  async getAll(params: QueryBookingsInput) {
    const supabase = await createServerClient();
    const { page, limit, status, dealerId, fromDate, toDate } = params;

    const offset = (page - 1) * limit;

    let query = supabase
      .from('test_ride_bookings')
      .select('*, dealers(name, city), scooter_models(name)', { count: 'exact' });

    // Apply filters
    if (status) {
      query = query.eq('status', status);
    }

    if (dealerId) {
      query = query.eq('dealer_id', dealerId);
    }

    if (fromDate) {
      query = query.gte('booking_date', fromDate);
    }

    if (toDate) {
      query = query.lte('booking_date', toDate);
    }

    // Apply sorting and pagination
    query = query.order('booking_date', { ascending: true }).range(offset, offset + limit - 1);

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
   * Get a single booking by ID
   */
  async getById(id: string): Promise<TestRideBooking | null> {
    const supabase = await createServerClient();

    const { data, error } = await supabase
      .from('test_ride_bookings')
      .select('*, dealers(name, city), scooter_models(name)')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  /**
   * Update booking status
   */
  async updateStatus(id: string, data: UpdateBookingStatusInput): Promise<TestRideBooking> {
    const supabase = await createServerClient();

    const updateData = {
      status: data.status,
      notes: data.notes,
      updated_at: new Date().toISOString(),
    };

    const { data: booking, error } = await supabase
      .from('test_ride_bookings')
      .update(updateData as never)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return booking as unknown as TestRideBooking;
  },

  /**
   * Delete a booking
   */
  async delete(id: string): Promise<void> {
    const supabase = await createServerClient();

    const { error } = await supabase.from('test_ride_bookings').delete().eq('id', id);

    if (error) throw error;
  },

  /**
   * Get dealer info for email
   */
  async getDealerById(dealerId: string): Promise<{ name: string; city: string; phone: string; email: string | null; address: string } | null> {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from('dealers')
      .select('name, city, phone, email, address')
      .eq('id', dealerId)
      .single();

    if (error) return null;
    return data as { name: string; city: string; phone: string; email: string | null; address: string } | null;
  },
};

export default bookingsQueries;
