import { createClient } from '@supabase/supabase-js';

// Fallback placeholders prevent a crash at module-load time during SSR when
// env vars haven't been injected yet. Real values must be set in Vercel's
// Environment Variables settings — API calls will fail gracefully otherwise.
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key'
);
