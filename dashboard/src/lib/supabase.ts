import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function buildClient(): SupabaseClient {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!url || !anonKey) {
    throw new Error(
      "Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local",
    );
  }

  return createClient(url, anonKey);
}

let _client: SupabaseClient | null = null;

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    if (!_client) _client = buildClient();
    return _client[prop as keyof SupabaseClient];
  },
  set(_target, prop, value) {
    if (!_client) _client = buildClient();
    (_client as Record<string | symbol, unknown>)[prop] = value;
    return true;
  },
});
