import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    fetch: async (input, init) => {
      try {
        return await fetch(input as RequestInfo, init as RequestInit);
      } catch (err) {
        console.error('Supabase network request failed', err);
        throw err as any;
      }
    }
  }
});
