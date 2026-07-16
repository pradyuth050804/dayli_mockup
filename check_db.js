import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://ghxyjkghxzqtrxftlvlb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdoeHlqa2doeHpxdHJ4ZnRsdmxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDcyNjYsImV4cCI6MjA4ODM4MzI2Nn0.omzER3-IgvoNeK2PdrP7-ZdcgQp3Em5sV4oFiLwA0ac'
);

async function run() {
  const { data, error } = await supabase.from('user_profiles').select('*');
  console.log('Profiles:', data, 'Error:', error);
}
run();
