import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  try {
    // Check if user is authenticated
    const serverClient = await createClient();
    const { data: { user } } = await serverClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Use admin client to bypass RLS
    const supabase = createAdminClient();

    // Fetch bookings with relations
    const { data: bookingsData, error: bookingsError } = await supabase
      .from('test_ride_bookings')
      .select(`*, dealers(name, city), scooter_models(name)`)
      .order('booking_date', { ascending: true });

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      return NextResponse.json({ error: bookingsError.message }, { status: 500 });
    }

    // Fetch dealers for filter dropdown
    const { data: dealersData } = await supabase
      .from('dealers')
      .select('*')
      .eq('is_active', true)
      .order('name');

    return NextResponse.json({
      bookings: bookingsData || [],
      dealers: dealersData || [],
    });
  } catch (error) {
    console.error('Error in admin bookings API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check if user is authenticated
    const serverClient = await createClient();
    const { data: { user } } = await serverClient.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'Missing id or status' }, { status: 400 });
    }

    // Use admin client to bypass RLS
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('test_ride_bookings')
      .update({ status, updated_at: new Date().toISOString() } as never)
      .eq('id', id);

    if (error) {
      console.error('Error updating booking:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in admin bookings PATCH:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
