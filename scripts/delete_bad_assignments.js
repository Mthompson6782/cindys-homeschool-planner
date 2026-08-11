require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteBadAssignments() {
    console.log("Deleting tasks named 'Assignment'...");
    const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('title', 'Assignment')
        .select();
        
    if (error) {
        console.error("Error deleting tasks:", error);
    } else {
        console.log("Successfully deleted " + (data ? data.length : 0) + " tasks named 'Assignment'.");
    }
}

deleteBadAssignments();
