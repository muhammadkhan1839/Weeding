import { createClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const envAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if credentials are valid and not the raw placeholder
export const isSupabaseConfigured = Boolean(
  envUrl &&
  envAnonKey &&
  envUrl !== 'PASTE_YOUR_SUPABASE_URL_HERE' &&
  !envUrl.includes('placeholder-project') &&
  (envUrl.startsWith('https://') || envUrl.startsWith('http://'))
);

// Fallback dummy URL so createClient does not crash if placeholder is active
const activeUrl = isSupabaseConfigured
  ? envUrl
  : 'https://placeholder-project.supabase.co';

const activeKey = isSupabaseConfigured
  ? envAnonKey
  : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.placeholder';

export const supabase = createClient(activeUrl, activeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
