export interface AppConfig {
  supabaseUrl: string;
  supabaseAnonKey: string;
  supabaseServiceRoleKey?: string;
  supabaseJwtSecret?: string;
  databaseUrl?: string;
}

export function loadConfig(): AppConfig {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    "";

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    "";

  const formattedUrl =
    supabaseUrl && !supabaseUrl.startsWith("http")
      ? `https://${supabaseUrl}`
      : supabaseUrl;

  return {
    supabaseUrl: formattedUrl,
    supabaseAnonKey,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseJwtSecret: process.env.SUPABASE_JWT_SECRET,
    databaseUrl: process.env.DATABASE_URL,
  };
}
