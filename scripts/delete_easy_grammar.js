require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteEasyGrammarTasks() {
    console.log("Deleting tasks related to 'Easy Grammar Plus'...");
    const { data, error } = await supabase
        .from('tasks')
        .delete()
        .ilike('title', '%Easy Grammar Plus%')
        .select();
        
    if (error) {
        console.error("Error deleting tasks:", error);
    } else {
        const count = data ? data.length : 0;
        console.log("Successfully deleted " + count + " tasks named 'Easy Grammar Plus'.");
    }
}

deleteEasyGrammarTasks();
