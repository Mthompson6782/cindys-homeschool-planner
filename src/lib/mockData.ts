import { addDays, format, isWeekend, parseISO } from "date-fns";

export interface Assignment {
  id: number;
  date: string;
  time: string;
  title: string;
  user: string;
  description: string;
}

export const blackoutDates = [
  // August 2026: Teacher Work Days
  "2026-08-03", "2026-08-04", "2026-08-05", "2026-08-06", "2026-08-07", "2026-08-10",
  // September 2026: Labor Day
  "2026-09-07",
  // October 2026: Staff Development & Virtual TWD
  "2026-10-15", "2026-10-16",
  // November 2026: Thanksgiving Break
  "2026-11-23", "2026-11-24", "2026-11-25", "2026-11-26", "2026-11-27",
  // December 2026: Winter Break & Flex TWD
  "2026-12-21", "2026-12-22", "2026-12-23", "2026-12-24", "2026-12-25",
  "2026-12-28", "2026-12-29", "2026-12-30", "2026-12-31",
  // January 2027: Winter Break & MLK Day
  "2027-01-01", "2027-01-18",
  // February 2027: Staff Development
  "2027-02-15",
  // March 2027: Spring Break
  "2027-03-22", "2027-03-23", "2027-03-24", "2027-03-25", "2027-03-26",
  // April 2027: Staff Development
  "2027-04-23",
  // May 2027: TWD & Memorial Day
  "2027-05-24", "2027-05-31"
];

function generateCurriculum() {
  const assignments: Assignment[] = [];
  let idCounter = 1;
  
  // Base start date: July 18, 2026 (Today, for example purposes)
  // We'll just generate from July 1st to August 30th to ensure we have coverage
  let currentDate = new Date('2026-07-01T00:00:00');
  const endDate = new Date('2026-08-30T00:00:00');

  let leoLessonNumber = 1;
  const genkiTopics = [
    "Greetings", "Numbers 1-10", "Numbers 11-100", "Time", "Telephone Numbers", 
    "Hiragana: a, i, u, e, o", "Hiragana: ka, ki, ku, ke, ko", 
    "Hiragana: sa, shi, su, se, so", "Hiragana: ta, chi, tsu, te, to",
    "Hiragana: na, ni, nu, ne, no", "Hiragana: ha, hi, fu, he, ho",
    "Hiragana: ma, mi, mu, me, mo", "Hiragana: ya, yu, yo",
    "Hiragana: ra, ri, ru, re, ro", "Hiragana: wa, wo, n",
    "Hiragana: Voiced Consonants (Dakuten)", "Hiragana: Double Consonants",
    "Hiragana: Contracted Sounds", "Review Hiragana", "Hiragana Quiz Preparation"
  ];
  let alexLessonIndex = 0;

  while (currentDate <= endDate) {
    const isWeekendDay = isWeekend(currentDate);
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const isBlackout = blackoutDates.includes(dateStr);

    // Skip weekends and blackout dates for assignments
    if (!isWeekendDay && !isBlackout) {
      // Leo: Easy Grammar Plus
      assignments.push({
        id: idCounter++,
        date: dateStr,
        time: "09:00",
        title: `Easy Grammar Plus: Lesson ${leoLessonNumber}`,
        user: "leo",
        description: `Work through Lesson ${leoLessonNumber} in the Wanda C. Phillips textbook.`
      });
      leoLessonNumber++;

      // Alex: Genki Third Edition (Until Aug 18th target)
      if (currentDate <= new Date('2026-08-18T00:00:00') && alexLessonIndex < genkiTopics.length) {
        assignments.push({
          id: idCounter++,
          date: dateStr,
          time: "10:00",
          title: `Genki: ${genkiTopics[alexLessonIndex]}`,
          user: "alex",
          description: `Study the Genki Third Edition textbook chapter on ${genkiTopics[alexLessonIndex]}. Master this by Aug 18th.`
        });
        alexLessonIndex++;
      } else if (currentDate > new Date('2026-08-18T00:00:00')) {
         assignments.push({
          id: idCounter++,
          date: dateStr,
          time: "10:00",
          title: `Genki: Chapter 1`,
          user: "alex",
          description: `Begin main textbook Chapter 1 (post-Hiragana).`
        });
      }
      
      // Cindy: Daily planning
      assignments.push({
        id: idCounter++,
        date: dateStr,
        time: "08:00",
        title: `Review Lessons`,
        user: "cindy",
        description: `Review yesterday's work and prepare materials for today.`
      });
    }

    currentDate = addDays(currentDate, 1);
  }

  return assignments;
}

export const mockSchedule = generateCurriculum();
