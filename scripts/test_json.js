const fs = require('fs');

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
    }
  ]
}`;

const uploadedJson = JSON.parse(jsonStr);
const tasksToInsert = [];
const generatorState = { textbook: '', user: 'leo' };

for (const session of uploadedJson.schedule) {
    const defaultTitle = uploadedJson.metadata?.title || uploadedJson.course || "Assignment";
    const prefix = generatorState.textbook ? generatorState.textbook : defaultTitle;
    const title = prefix;
    
    let desc = "";
    // Support old format (array of lessons)
    if (session.lessons && Array.isArray(session.lessons) && session.lessons.length > 0) {
        desc = \`Lessons: \${session.lessons.join(", ")}\`;
    } 
    // Support new format (lesson and part strings)
    else {
        const parts = [];
        if (session.lesson) parts.push(session.lesson);
        if (session.part) parts.push(session.part);
        if (session.topic) parts.push(\`Topic: \${session.topic}\`);
        if (session.description) parts.push(session.description);
        
        desc = parts.join('\\n');
    }
    
    tasksToInsert.push({
        date: session.date,
        time: "09:00",
        title: title,
        user: generatorState.user,
        description: desc
    });
}

console.log(JSON.stringify(tasksToInsert, null, 2));
