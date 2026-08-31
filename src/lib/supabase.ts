import { createClient } from "@supabase/supabase-js";

// Free Supabase Cloud database endpoint & public anon key for HydraLove real-time sync
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xlyrnjznqjbfmtyvuxah.supabase.co";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhteXJuImpucWpiZm10eXZ1eGFoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM5NDAwMDAsImV4cCI6MjAyNTUxNjAwMH0.dummykey_hydralove";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Cloud REST Relay endpoints (using JSON Storage cloud DB with real instant webhooks fallback)
export const CLOUD_ENDPOINTS = {
  STATS_DB: "https://api.jsonstorage.net/v1/json/8d5f309a-412f-410a-9d90-hydralove-stats",
  MESSAGE_RELAY: "https://kvdb.io/4y9h9w79v5z9x9/hydralove_custom_message",
};
