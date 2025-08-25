import { createClient, SupabaseClient } from '@supabase/supabase-js';

/*
 * This module exports a configured Supabase client if the
 * corresponding environment variables are provided.  When no
 * Supabase URL or key are set the client will be null and the
 * application will fall back to using the sample data defined in
 * sampleData.ts.  Add a `.env.local` file at the project root
 * containing VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable
 * live data fetching.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabaseClient: SupabaseClient | null =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;