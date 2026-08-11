const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteLeoTasks() {
  console.log("Connecting to Supabase to delete Leo's tasks...");
  
  const { data, error } = await supabase
    .from('tasks')
    .delete()
    .eq('user', 'leo')
    .select(); // Select returns the deleted rows so we know how many were deleted

  if (error) {
    console.error("Error deleting tasks:", error);
  } else {
    console.log(`Successfully deleted ${data ? data.length : 0} tasks for user 'leo'.`);
  }
}

deleteLeoTasks();
