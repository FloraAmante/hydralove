import { createClient } from "@supabase/supabase-js";

// Dedicated Supabase Cloud credentials for project: db.ybumgwhcbuovrjugdkas.supabase.co
export const SUPABASE_URL = "https://ybumgwhcbuovrjugdkas.supabase.co";

// Public anon key for your Supabase project (allows browser read/write to custom tables)
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlidW1nd2hjYnVvdnJqdWdka2FzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM5NDAwMDAsImV4cCI6MjAyNTUxNjAwMH0.hydralove_supabase_key";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Postgres Direct HTTP API endpoints backed by your Supabase project
export const POSTGRES_CONFIG = {
  PROJECT_REF: "ybumgwhcbuovrjugdkas",
  REST_URL: `${SUPABASE_URL}/rest/v1`,
};
