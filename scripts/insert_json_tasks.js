require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const jsonStr = `{
  "course": "Oak Meadow World History",
  "academic_year": "2026-2027",
  "schedule_days": ["Monday", "Wednesday"],
  "schedule": [
    {
      "date": "2026-08-19",
      "day": "Wednesday",
      "lesson": "Lesson 13: Contact, Colonization, and Catastrophe in the Americas (1450-1600 CE)",
      "part": "Part 1 - Introduction & Reading"
    },
    {
      "date": "2026-08-24",
      "day": "Monday",
      "lesson": "Lesson 13: Contact, Colonization, and Catastrophe in the Americas (1450-1600 CE)",
      "part": "Part 2 - Guided Questions & Primary Sources"
    },
    {
      "date": "2026-08-26",
      "day": "Wednesday",
      "lesson": "Lesson 13: Contact, Colonization, and Catastrophe in the Americas (1450-1600 CE)",
      "part": "Part 3 - Assignment & Review"
    },
    {
      "date": "2026-08-31",
      "day": "Monday",
      "lesson": "Lesson 14: Prosperity and Conflict in Early Modern Afro-Eurasia (1450-1600 CE)",
      "part": "Part 1 - Reading & Notes"
    },
    {
      "date": "2026-09-02",
      "day": "Wednesday",
      "lesson": "Lesson 14: Prosperity and Conflict in Early Modern Afro-Eurasia (1450-1600 CE)",
      "part": "Part 2 - Textual Analysis & Discussion"
    },
    {
      "date": "2026-09-09",
      "day": "Wednesday",
      "lesson": "Lesson 14: Prosperity and Conflict in Early Modern Afro-Eurasia (1450-1600 CE)",
      "part": "Part 3 - Lesson Assignment"
    },
    {
      "date": "2026-09-14",
      "day": "Monday",
      "lesson": "Lesson 15: Climate and Violence in the Global Network (1600-1750 CE)",
      "part": "Part 1 - Reading & Vocabulary"
    },
    {
      "date": "2026-09-16",
      "day": "Wednesday",
      "lesson": "Lesson 15: Climate and Violence in the Global Network (1600-1750 CE)",
      "part": "Part 2 - Document Analysis"
    },
    {
      "date": "2026-09-21",
      "day": "Monday",
      "lesson": "Lesson 15: Climate and Violence in the Global Network (1600-1750 CE)",
      "part": "Part 3 - Synthesis & Assignment"
    },
    {
      "date": "2026-09-23",
      "day": "Wednesday",
      "lesson": "Lesson 16: Global Cultures of Early Modernity (1500-1780 CE)",
      "part": "Part 1 - Reading & Overview"
    },
    {
      "date": "2026-09-28",
      "day": "Monday",
      "lesson": "Lesson 16: Global Cultures of Early Modernity (1500-1780 CE)",
      "part": "Part 2 - Cultural Case Studies"
    },
    {
      "date": "2026-09-30",
      "day": "Wednesday",
      "lesson": "Lesson 16: Global Cultures of Early Modernity (1500-1780 CE)",
      "part": "Part 3 - Lesson Assignment"
    },
    {
      "date": "2026-10-05",
      "day": "Monday",
      "lesson": "Lesson 17/18: First Semester Review",
      "part": "Part 1 - Reviewing Core Themes & Concepts"
    },
    {
      "date": "2026-10-07",
      "day": "Wednesday",
      "lesson": "Lesson 17/18: First Semester Review",
      "part": "Part 2 - Assessment / Portfolio Wrap-up"
    },
    {
      "date": "2026-10-12",
      "day": "Monday",
      "lesson": "Lesson 19: The Age of Revolutions (1775-1850 CE)",
      "part": "Part 1 - Atlantic Revolutions Overview"
    },
    {
      "date": "2026-10-14",
      "day": "Wednesday",
      "lesson": "Lesson 19: The Age of Revolutions (1775-1850 CE)",
      "part": "Part 2 - Comparative Analysis"
    },
    {
      "date": "2026-10-19",
      "day": "Monday",
      "lesson": "Lesson 19: The Age of Revolutions (1775-1850 CE)",
      "part": "Part 3 - Lesson Assignment"
    },
    {
      "date": "2026-10-21",
      "day": "Wednesday",
      "lesson": "Lesson 20: The Industrial and Consumer Revolutions",
      "part": "Part 1 - Technological & Social Shifts"
    },
    {
      "date": "2026-10-26",
      "day": "Monday",
      "lesson": "Lesson 20: The Industrial and Consumer Revolutions",
      "part": "Part 2 - Global Impacts & Economic Shifts"
    },
    {
      "date": "2026-10-28",
      "day": "Wednesday",
      "lesson": "Lesson 20: The Industrial and Consumer Revolutions",
      "part": "Part 3 - Lesson Assignment"
    },
    {
      "date": "2026-11-02",
      "day": "Monday",
      "lesson": "Lesson 21: Competition and Reform in Afro-Eurasia (1750-1850)",
      "part": "Part 1 - Reading & Context"
    },
    {
      "date": "2026-11-04",
      "day": "Wednesday",
      "lesson": "Lesson 21: Competition and Reform in Afro-Eurasia (1750-1850)",
      "part": "Part 2 - Reform Movements & Case Studies"
    },
    {
      "date": "2026-11-09",
      "day": "Monday",
      "lesson": "Lesson 21: Competition and Reform in Afro-Eurasia (1750-1850)",
      "part": "Part 3 - Lesson Assignment"
    },
    {
      "date": "2026-11-11",
      "day": "Wednesday",
      "lesson": "Lesson 22: Socialism and Anti-Colonialism in the Nineteenth Century",
      "part": "Part 1 - Ideologies & Key Concepts"
    },
    {
      "date": "2026-11-16",
      "day": "Monday",
      "lesson": "Lesson 22: Socialism and Anti-Colonialism in the Nineteenth Century",
      "part": "Part 2 - Primary Source Analysis"
    },
    {
      "date": "2026-11-18",
      "day": "Wednesday",
      "lesson": "Lesson 22: Socialism and Anti-Colonialism in the Nineteenth Century",
      "part": "Part 3 - Lesson Assignment"
    },
    {
      "date": "2026-11-30",
      "day": "Monday",
      "lesson": "Lesson 23: The High Tide of the European Triad (c. 1850-1914)",
      "part": "Part 1 - New Imperialism & Expansion"
    },
    {
      "date": "2026-12-02",
      "day": "Wednesday",
      "lesson": "Lesson 23: The High Tide of the European Triad (c. 1850-1914)",
      "part": "Part 2 - Global Resistance & Responses"
    },
    {
      "date": "2026-12-07",
      "day": "Monday",
      "lesson": "Lesson 23: The High Tide of the European Triad (c. 1850-1914)",
      "part": "Part 3 - Lesson Assignment"
    },
    {
      "date": "2026-12-09",
      "day": "Wednesday",
      "lesson": "Lesson 24: Anxiety and Disruption at the Turn of the Century (c. 1890-1914)",
      "part": "Part 1 - Social & Political Unrest"
    },
    {
      "date": "2026-12-14",
      "day": "Monday",
      "lesson": "Lesson 24: Anxiety and Disruption at the Turn of the Century (c. 1890-1914)",
      "part": "Part 2 - Document Exploration"
    },
    {
      "date": "2026-12-16",
      "day": "Wednesday",
      "lesson": "Lesson 24: Anxiety and Disruption at the Turn of the Century (c. 1890-1914)",
      "part": "Part 3 - Lesson Assignment"
    },
    {
      "date": "2027-01-06",
      "day": "Wednesday",
      "lesson": "Lesson 25: Modernism and Nationalism in Art, Literature, and Science (c. 1890-1914)",
      "part": "Part 1 - Cultural Shifts & Modernism"
    },
    {
      "date": "2027-01-11",
      "day": "Monday",
      "lesson": "Lesson 25: Modernism and Nationalism in Art, Literature, and Science (c. 1890-1914)",
      "part": "Part 2 - Document Exploration & Science"
    },
    {
      "date": "2027-01-13",
      "day": "Wednesday",
      "lesson": "Lesson 25: Modernism and Nationalism in Art, Literature, and Science (c. 1890-1914)",
      "part": "Part 3 - Lesson Assignment"
    },
    {
      "date": "2027-01-20",
      "day": "Wednesday",
      "lesson": "Lesson 26: World War I",
      "part": "Part 1 - Causes & Global Alliance Systems"
    },
    {
      "date": "2027-01-25",
      "day": "Monday",
      "lesson": "Lesson 26: World War I",
      "part": "Part 2 - Total War & Trench Warfare"
    },
    {
      "date": "2027-01-27",
      "day": "Wednesday",
      "lesson": "Lesson 26: World War I",
      "part": "Part 3 - Outcomes & Peace Treaties"
    },
    {
      "date": "2027-02-01",
      "day": "Monday",
      "lesson": "Lesson 27: Mass Culture and Mass Politics in the Early Twentieth Century",
      "part": "Part 1 - Interwar Media & Political Shifts"
    },
    {
      "date": "2027-02-03",
      "day": "Wednesday",
      "lesson": "Lesson 27: Mass Culture and Mass Politics in the Early Twentieth Century",
      "part": "Part 2 - Rise of Totalitarianism"
    },
    {
      "date": "2027-02-08",
      "day": "Monday",
      "lesson": "Lesson 27: Mass Culture and Mass Politics in the Early Twentieth Century",
      "part": "Part 3 - Lesson Assignment"
    },
    {
      "date": "2027-02-10",
      "day": "Wednesday",
      "lesson": "Lesson 28: World War II",
      "part": "Part 1 - Aggression & Escalation in Europe & Asia"
    },
    {
      "date": "2027-02-17",
      "day": "Wednesday",
      "lesson": "Lesson 28: World War II",
      "part": "Part 2 - The Holocaust & Total War Economy"
    },
    {
      "date": "2027-02-22",
      "day": "Monday",
      "lesson": "Lesson 28: World War II",
      "part": "Part 3 - Post-War Realignment & Assignment"
    },
    {
      "date": "2027-02-24",
      "day": "Wednesday",
      "lesson": "Lesson 29: Mid-Semester Review",
      "part": "Part 1 - Key Concepts & Unit Syntheses"
    },
    {
      "date": "2027-03-01",
      "day": "Monday",
      "lesson": "Lesson 29: Mid-Semester Review",
      "part": "Part 2 - Assessment / Project Check-in"
    },
    {
      "date": "2027-03-03",
      "day": "Wednesday",
      "lesson": "Lesson 30: Decolonization and the Cold War, Part 1 (East, Southeast, and South Asia)",
      "part": "Part 1 - Asian Decolonization Movements"
    },
    {
      "date": "2027-03-08",
      "day": "Monday",
      "lesson": "Lesson 30: Decolonization and the Cold War, Part 1 (East, Southeast, and South Asia)",
      "part": "Part 2 - Cold War Proxy Conflicts in Asia"
    },
    {
      "date": "2027-03-10",
      "day": "Wednesday",
      "lesson": "Lesson 30: Decolonization and the Cold War, Part 1 (East, Southeast, and South Asia)",
      "part": "Part 3 - Lesson Assignment"
    },
    {
      "date": "2027-03-15",
      "day": "Monday",
      "lesson": "Lesson 31: Decolonization and the Cold War, Part 2 (Africa and the Middle East)",
      "part": "Part 1 - African Independence Movements"
    },
    {
      "date": "2027-03-17",
      "day": "Wednesday",
      "lesson": "Lesson 31: Decolonization and the Cold War, Part 2 (Africa and the Middle East)",
      "part": "Part 2 - Middle East Geopolitics"
    },
    {
      "date": "2027-03-29",
      "day": "Monday",
      "lesson": "Lesson 31: Decolonization and the Cold War, Part 2 (Africa and the Middle East)",
      "part": "Part 3 - Lesson Assignment"
    },
    {
      "date": "2027-03-31",
      "day": "Wednesday",
      "lesson": "Lesson 32: Decolonization and the Cold War, Part 3 (Europe and the Americas)",
      "part": "Part 1 - Superpower Rivalries & Latin America"
    },
    {
      "date": "2027-04-05",
      "day": "Monday",
      "lesson": "Lesson 32: Decolonization and the Cold War, Part 3 (Europe and the Americas)",
      "part": "Part 2 - Fall of the Soviet Union & End of Cold War"
    },
    {
      "date": "2027-04-07",
      "day": "Wednesday",
      "lesson": "Lesson 32: Decolonization and the Cold War, Part 3 (Europe and the Americas)",
      "part": "Part 3 - Lesson Assignment"
    },
    {
      "date": "2027-04-12",
      "day": "Monday",
      "lesson": "Lesson 33: Globalization",
      "part": "Part 1 - Global Trade, Technology, & Communication"
    },
    {
      "date": "2027-04-14",
      "day": "Wednesday",
      "lesson": "Lesson 33: Globalization",
      "part": "Part 2 - Cultural Exchange & Economic Interdependence"
    },
    {
      "date": "2027-04-19",
      "day": "Monday",
      "lesson": "Lesson 33: Globalization",
      "part": "Part 3 - Lesson Assignment"
    },
    {
      "date": "2027-04-21",
      "day": "Wednesday",
      "lesson": "Lesson 34: Global Challenges and the Anthropocene Era",
      "part": "Part 1 - Environmental & Demographic Trends"
    },
    {
      "date": "2027-04-26",
      "day": "Monday",
      "lesson": "Lesson 34: Global Challenges and the Anthropocene Era",
      "part": "Part 2 - Human Rights & Modern Global Issues"
    },
    {
      "date": "2027-04-28",
      "day": "Wednesday",
      "lesson": "Lesson 34: Global Challenges and the Anthropocene Era",
      "part": "Part 3 - Final Reflection & Course Wrap-Up"
    }
  ]
}`;

const uploadedJson = JSON.parse(jsonStr);
const tasksToInsert = [];
// Assuming the tasks are for Leo since the last request was to delete his old tasks
const generatorState = { textbook: '', user: 'leo' };

for (const session of uploadedJson.schedule) {
    const defaultTitle = uploadedJson.metadata?.title || uploadedJson.course || "Assignment";
    const prefix = generatorState.textbook ? generatorState.textbook : defaultTitle;
    const title = prefix;
    
    let desc = "";
    if (session.lessons && Array.isArray(session.lessons) && session.lessons.length > 0) {
        desc = `Lessons: ${session.lessons.join(", ")}`;
    } 
    else {
        const parts = [];
        if (session.lesson) parts.push(session.lesson);
        if (session.part) parts.push(session.part);
        if (session.topic) parts.push(`Topic: ${session.topic}`);
        if (session.description) parts.push(session.description);
        
        desc = parts.join('\n');
    }
    
    tasksToInsert.push({
        date: session.date,
        time: "09:00",
        title: title,
        user: generatorState.user,
        description: desc
    });
}

async function insertTasks() {
    console.log(`Inserting ${tasksToInsert.length} tasks into Supabase for ${generatorState.user}...`);
    const { error } = await supabase.from('tasks').insert(tasksToInsert);
    if (error) {
        console.error("Error inserting tasks:", error);
    } else {
        console.log("Tasks successfully inserted!");
    }
}

insertTasks();
