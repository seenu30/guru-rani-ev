import { NextResponse } from 'next/server';
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
    const today = new Date().toISOString().split('T')[0];
    const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString();

    // Fetch counts
    const [
      { count: leadsCount },
      { count: bookingsCount },
      { count: convertedCount },
      { count: newThisMonth },
    ] = await Promise.all([
      supabase.from('leads').select('*', { count: 'exact', head: true }),
      supabase.from('test_ride_bookings').select('*', { count: 'exact', head: true }),
      supabase.from('leads').select('*', { count: 'exact', head: true }).eq('status', 'converted'),
      supabase.from('leads').select('*', { count: 'exact', head: true }).gte('created_at', firstOfMonth),
    ]);

    // Fetch recent leads (last 5)
    const { data: leadsData } = await supabase
      .from('leads')
      .select(`*, scooter_models(name)`)
      .order('created_at', { ascending: false })
      .limit(5);

    // Fetch upcoming bookings
    const { data: bookingsData } = await supabase
      .from('test_ride_bookings')
      .select(`*, dealers(name), scooter_models(name)`)
      .gte('booking_date', today)
      .in('status', ['pending', 'confirmed'])
      .order('booking_date', { ascending: true })
      .limit(5);

    return NextResponse.json({
      stats: {
        totalLeads: leadsCount || 0,
        totalBookings: bookingsCount || 0,
        convertedLeads: convertedCount || 0,
        newLeadsThisMonth: newThisMonth || 0,
      },
      recentLeads: leadsData || [],
      upcomingBookings: bookingsData || [],
    });
  } catch (error) {
    console.error('Error in admin dashboard API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
