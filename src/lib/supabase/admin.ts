import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

/**
 * Create a Supabase admin client that bypasses RLS
 * ⚠️ WARNING: Only use this on the server-side for admin operations
 * NEVER expose this client or the service role key to the frontend
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing Supabase admin credentials. Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.'
    );
  }

  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export default createAdminClient;
