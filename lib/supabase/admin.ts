import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase admin client using the service role key.
 * Bypasses Row Level Security — use only in trusted server-side contexts.
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
