//const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://gftqmcqjqwssdobgochh.supabase.co";
//const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_70Kf5aQPvPDt9H6m7n8Lg_PM356-e1";

//import { createClient } from "@supabase/supabase-js";

//const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
//const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

//export const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { createClient } from "@supabase/supabase-js";

// Directly use your project URL and your copied legacy 'anon' JWT key
const supabaseUrl = "https://gftqmcqjqwssdobgochh.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmdHFtY3FqcXdzc2RvYmdvY2hoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0OTc3MjYsImV4cCI6MjEwMTA3MzcyNn0.GU6CjxmnMqZZwRpwiO6uEboL4Npr6gAgQGrl9qA6dVE"; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);