import Link from "next/link";
import { format, parseISO } from "date-fns";
import styles from "./DailyPlanner.module.css";
import { mockSchedule } from "@/lib/mockData";

// A selection of quotes requested by the user
const quotes = [
  { text: "In the midst of chaos, there is also opportunity.", author: "Sun Tzu" },
  { text: "To secure ourselves against defeat lies in our own hands, but the opportunity of defeating the enemy is provided by the enemy himself.", author: "Sun Tzu" },
  { text: "There is only one decisive victory: the last.", author: "Carl von Clausewitz" },
  { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" }
];

export default async function DailyPlanner({ params, searchParams }: { params: Promise<{ date: string }>, searchParams: Promise<{ user?: string }> }) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  
  const dateStr = resolvedParams.date;
  const userFilter = resolvedSearch.user || "all";
  
  let displayDate = "Unknown Date";
  
  try {
    const parsedDate = parseISO(dateStr);
    displayDate = format(parsedDate, "EEEE, MMMM do, yyyy");
  } catch (e) {
    displayDate = dateStr;
  }

  // Pick a random quote based on the day string so it's consistent for that day
  const quoteIndex = dateStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % quotes.length;
  const dailyQuote = quotes[quoteIndex];

  const dayAssignments = mockSchedule.filter(a => 
    a.date === dateStr && (userFilter === "all" || a.user === userFilter)
  );

  let missionBlurb = "No specific mission parameters for today.";
  if (dayAssignments.length > 0) {
    if (userFilter === "all") {
      const leoTasks = dayAssignments.filter(a => a.user === "leo").map(a => a.title);
      const alexTasks = dayAssignments.filter(a => a.user === "alex").map(a => a.title);
      const parts = [];
      if (leoTasks.length) parts.push(`Leo is working on ${leoTasks.join(" and ")}`);
      if (alexTasks.length) parts.push(`Alex is focusing on ${alexTasks.join(" and ")}`);
      if (parts.length) {
        missionBlurb = parts.join(". ") + ". Ensure all tasks are completed before 3 PM.";
      }
    } else {
      const tasks = dayAssignments.map(a => a.title);
      const name = userFilter.charAt(0).toUpperCase() + userFilter.slice(1);
      missionBlurb = `${name}'s focus today is on ${tasks.join(" and ")}. Ensure all tasks are completed before 3 PM.`;
    }
  }

  return (
    <div className={styles.plannerContainer}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          &larr;
        </Link>
        <div className={styles.headerContent}>
          <h1>{displayDate}</h1>
          <p>Daily Operations & Lesson Plan</p>
        </div>
      </header>

      <div className={styles.quoteSection}>
        <p className={styles.quoteText}>"{dailyQuote.text}"</p>
        <p className={styles.quoteAuthor}>— {dailyQuote.author}</p>
      </div>

      <div className={styles.assignmentsBlurb}>
        <h3>Today's Mission</h3>
        <p>{missionBlurb}</p>
      </div>

      <div className={styles.schedule}>
        {dayAssignments.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '1.1rem', fontStyle: 'italic', padding: '2rem', textAlign: 'center' }}>
            No scheduled tasks for today.
          </div>
        ) : (
          dayAssignments.map(assignment => (
            <div key={assignment.id} className={`${styles.assignmentCard} ${styles[assignment.user]}`}>
              <div className={styles.assignmentInfo}>
                <h4>
                  <span className={`tag tag-${assignment.user}`} style={{ marginRight: '12px' }}>
                    {assignment.user}
                  </span>
                  {assignment.title}
                </h4>
                <p>{assignment.description}</p>
              </div>
              <div className={styles.assignmentActions}>
                <button className={styles.actionButton}>Complete</button>
                <button className={`${styles.actionButton} ${styles.bumpButton}`}>Bump Forward</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
