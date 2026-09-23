import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { fetchAuthConfig } from "@/services/api";

let supabaseClient: SupabaseClient | null = null;
let initPromise: Promise<SupabaseClient | null> | null = null;

export async function getSupabase(): Promise<SupabaseClient | null> {
  if (supabaseClient) return supabaseClient;

  if (!initPromise) {
    initPromise = (async () => {
      try {
        const config = await fetchAuthConfig();
        if (config.supabase_url && config.supabase_anon_key) {
          supabaseClient = createClient(config.supabase_url, config.supabase_anon_key);
          return supabaseClient;
        }
      } catch (err) {
        console.warn("Failed to initialize Supabase client from Go API config:", err);
      }
      return null;
    })();
  }

  return initPromise;
}
