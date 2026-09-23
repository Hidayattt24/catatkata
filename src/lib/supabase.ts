import { createClient } from "@supabase/supabase-js";

export function getSupabaseUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "https://placeholder.supabase.co";
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return `https://${url}`;
  }
  return url;
}

export function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "placeholder-anon-key"
  );
}

export function getAuthRedirectUrl(): string {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/`;
  }
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://catatkata-web.vercel.app/";
  const formatted = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
  return formatted.endsWith("/") ? formatted : `${formatted}/`;
}

export const supabase = createClient(getSupabaseUrl(), getSupabaseAnonKey());

export function getSupabaseServerClient(accessToken?: string) {
  return createClient(getSupabaseUrl(), getSupabaseAnonKey(), {
    global: {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
    },
  });
}
