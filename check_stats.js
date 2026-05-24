import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'test@example.com', // Let's just try to insert without auth if it fails, or with a known token.
    password: 'password'
  });
  console.log('Auth:', authData, authError);
  
  // Or just try without auth
  const { error } = await supabase.from('user_stats').insert({
    user_id: '00000000-0000-0000-0000-000000000000',
    current_streak: 1,
    longest_streak: 1,
    last_log_date: '2026-05-24',
    total_meals_logged: 1,
  });
  console.log('Insert Error:', error);
}
run();
