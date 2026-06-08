import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loud in dev if env is missing — never silently point at the wrong project.
  console.warn(
    'Supabase env vars missing: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local',
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

/**
 * One lightweight HTTP call to confirm the cloud project is reachable
 * (Week 1 verification gate, item 6). Hits the GoTrue health endpoint —
 * no schema or auth required.
 */
export async function cloudHealthcheck(): Promise<boolean> {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
    headers: { apikey: supabaseAnonKey },
  });
  return res.ok;
}
