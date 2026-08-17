import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ibohtpnrmuehzwkrktvz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlib2h0cG5ybXVlaHp3a3JrdHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcyNTc2NTgsImV4cCI6MjA5MjgzMzY1OH0.zrIGOD9psgIlrFeaBvIgneiBsGseXwGykshnsOLYU_c";


export const db = createClient(supabaseUrl, supabaseKey);