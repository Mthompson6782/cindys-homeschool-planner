import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export type Task = {
  id?: string;
  created_at?: string;
  date: string; // YYYY-MM-DD
  time?: string;
  title: string;
  user: string;
  description?: string;
  status?: string; // 'pending' | 'completed'
};
