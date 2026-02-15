import { createClient } from '@/lib/supabase/client';

/**
 * Sign out the current user (client-side)
 */
export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
}
