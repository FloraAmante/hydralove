import { createClient } from "@supabase/supabase-js";

// Dedicated Supabase Cloud credentials for project: ybumgwhcbuovrjugdkas
export const SUPABASE_URL = "https://ybumgwhcbuovrjugdkas.supabase.co";

// User provided publishable key for client-side REST queries
export const SUPABASE_ANON_KEY = "sb_publishable_fDhN9zP_IW6UcC_ra_xB2g_KtEk--MX";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
