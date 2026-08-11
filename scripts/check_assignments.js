require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTasks() {
    console.log("Fetching tasks named 'Assignment'...");
    const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('title', 'Assignment');
        
    if (error) {
        console.error("Error fetching tasks:", error);
    } else {
        console.log(\`Found \${data.length} tasks named 'Assignment'.\`);
        console.log("Sample:", data.slice(0, 3));
    }
}

checkTasks();
