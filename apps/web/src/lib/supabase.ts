import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://uzdydylqfikpajlomvyx.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV6ZHlkeWxxZmlrcGFqbG9tdnl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNTEzNTIsImV4cCI6MjEwNTYyNzM1Mn0.cl7riAgxri6SZ99joYZ7X5CpvuqbNEcbZ3hVd6tH7zc";

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}

export function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;
}

export const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());

export function getSupabaseServerClient(accessToken?: string) {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  });
}
