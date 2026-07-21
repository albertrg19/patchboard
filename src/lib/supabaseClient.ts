import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nxnbsrefqhdwzgcwjawz.supabase.co';
const supabaseAnonKey = 'sb_publishable_wv8wjaGaPOlgHY8WPBqtaQ_DsGcBNlu';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
