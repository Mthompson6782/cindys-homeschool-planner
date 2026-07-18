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
  // We'll just generate from July 1st to September 30th to ensure we have coverage for the 10 week plan
  let currentDate = new Date('2026-07-01T00:00:00');
  const endDate = new Date('2026-09-30T00:00:00');

  let leoLessonIndex = 0;
  const leoLessons = [
    { title: "Intro to Prepositions", description: "Prepositions Definition & List, Object of the Preposition, Deleting Prepositional Phrases, Compound Object, Infinitive vs. Prepositional Phrase (Pages 1-16)" },
    { title: "Advanced Prepositions & Direct Objects", description: "Prepositional Phrases in Imperative Sentences, Adverb vs. Preposition, Preposition Review, Direct Objects, Compound Direct Objects (Pages 17-37)" },
    { title: "Verb Fundamentals", description: "Action Verbs, Linking Verbs, Helping Verbs, Verb Phrases, Regular & Irregular Verbs (Pages 38-58)" },
    { title: "Confusing Verbs & Agreement", description: "Sit/Set, Rise/Raise, Lie/Lay, To Be & Linking, Subject-Verb Agreement (Pages 59-77)" },
    { title: "Tenses & Transitive Verbs", description: "Present & Past, Future, Perfect, Progressive, Transitive vs. Intransitive & Indirect Objects (Pages 82-104)" },
    { title: "Noun Basics", description: "Definition, Concrete/Abstract, Common/Proper, Determiners, Noun vs. Adjective/Verb (Pages 112-124)" },
    { title: "Advanced Nouns", description: "Singular/Plural, Possessive, Appositives, Predicate Nominatives, Gerunds (Pages 125-139)" },
    { title: "Interjections, Conjunctions & Adjectives", description: "Interjections, Conjunctions, Limiting/Descriptive Adjectives, Proper Adjectives, Predicate Adjectives (Pages 147-164)" },
    { title: "Sentences & Clauses", description: "Degrees of Adjectives, Sentence Types, Fragments, Run-ons, Phrases vs. Clauses (Pages 165-184)" },
    { title: "Adverb Basics", description: "How & Where, When, To What Extent, Adverb vs Preposition, Adverb vs Adjective (Pages 188-202)" },
    { title: "Advanced Adverbs", description: "Good vs. Well, Double Negatives, Degrees of Adverbs, Review, Personal Pronouns (Pages 203-220)" },
    { title: "Pronoun Cases", description: "Nominative, Objective, Direct vs Indirect, Possessive, Its/It's & You're/Your (Pages 221-233)" },
    { title: "Pronoun Types", description: "There/Their/They're, Reflexive, Antecedents, Demonstrative, Interrogative (Pages 234-248)" },
    { title: "Indefinite Pronouns & Review", description: "Indefinite Pronouns, Pronoun vs Adjective, Agreement, Pronoun Review Parts 1 & 2 (Pages 249-263)" },
    { title: "Punctuation Part 1", description: "Periods, Commas in Series/Addresses, Commas in Quotes/Letters, Commas with Appositives/Clauses, Semicolons & Colons (Pages 264-278)" },
    { title: "Punctuation Part 2", description: "Question Marks & Exclamation Points, Hyphens, Quotation Marks, Underlining Titles, Punctuation Review (Pages 279-290)" },
    { title: "Capitalization Part 1", description: "First Words & Titles, Proper Nouns & Places, Historical Events & Documents, Organizations & Languages, Religions & Proper Adjectives (Pages 291-303)" },
    { title: "Capitalization Part 2 & Letters", description: "Do Not Capitalize Rules, Capitalization Review, Friendly Letters, Envelopes, Business Letters (Pages 304-316)" },
    { title: "Clauses Part 1", description: "Coordinate Clauses, Subordinate Clauses, Adverb Clauses, Adjective Clauses, Noun Clauses (Pages 317-326)" },
    { title: "Clauses Part 2 & Final Review", description: "Essential vs Nonessential, Elliptical, Complex Sentences, Clauses Review, Final Course Assessment (Pages 327-330)" }
  ];

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
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    // Skip weekends and blackout dates for assignments
    if (!isWeekendDay && !isBlackout) {
      
      // Leo: Easy Grammar Plus - Schedule only on Mondays (1) and Wednesdays (3)
      if ((dayOfWeek === 1 || dayOfWeek === 3) && leoLessonIndex < leoLessons.length) {
        assignments.push({
          id: idCounter++,
          date: dateStr,
          time: "09:00",
          title: `Easy Grammar Plus: ${leoLessons[leoLessonIndex].title}`,
          user: "leo",
          description: leoLessons[leoLessonIndex].description
        });
        leoLessonIndex++;
      }

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
      
      // Cindy: Daily planning (Removed per request)
    }

    currentDate = addDays(currentDate, 1);
  }

  return assignments;
}

export const mockSchedule = generateCurriculum();
