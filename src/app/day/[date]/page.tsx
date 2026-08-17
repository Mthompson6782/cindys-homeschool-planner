"use client";

import Link from "next/link";
import { format, parseISO, addDays, subDays, isWeekend, getDay } from "date-fns";
import styles from "./DailyPlanner.module.css";
import { mockSchedule } from "@/lib/mockData";
import { use, useState, useEffect, useCallback } from "react";
import { useUserPreferences } from "@/components/UserProvider";
import { supabase, Task } from "@/lib/supabase";
import confetti from "canvas-confetti";

// Strategic & philosophical quotes
const quotes = [
  { text: "In the midst of chaos, there is also opportunity.", author: "Sun Tzu" },
  { text: "To secure ourselves against defeat lies in our own hands, but the opportunity of defeating the enemy is provided by the enemy himself.", author: "Sun Tzu" },
  { text: "The supreme art of war is to subdue the enemy without fighting.", author: "Sun Tzu" },
  { text: "Appear weak when you are strong, and strong when you are weak.", author: "Sun Tzu" },
  { text: "Let your plans be dark and impenetrable as night, and when you move, fall like a thunderbolt.", author: "Sun Tzu" },
  { text: "There is only one decisive victory: the last.", author: "Carl von Clausewitz" },
  { text: "War is the continuation of politics by other means.", author: "Carl von Clausewitz" },
  { text: "Everything in war is very simple, but the simplest thing is difficult.", author: "Carl von Clausewitz" },
  { text: "Courage, above all things, is the first quality of a warrior.", author: "Carl von Clausewitz" },
  { text: "The backbone of surprise is fusing speed with secrecy.", author: "Carl von Clausewitz" },
  { text: "You have power over your mind - not outside events. Realize this, and you will find strength.", author: "Marcus Aurelius" },
  { text: "Waste no more time arguing about what a good man should be. Be one.", author: "Marcus Aurelius" },
  { text: "The impediment to action advances action. What stands in the way becomes the way.", author: "Marcus Aurelius" },
  { text: "Very little is needed to make a happy life; it is all within yourself, in your way of thinking.", author: "Marcus Aurelius" },
  { text: "When you arise in the morning, think of what a precious privilege it is to be alive.", author: "Marcus Aurelius" },
  { text: "There is nothing outside of yourself that can ever enable you to get better, stronger, richer, quicker, or smarter. Everything is within.", author: "Miyamoto Musashi" },
  { text: "Think lightly of yourself and deeply of the world.", author: "Miyamoto Musashi" },
  { text: "Do not seek to follow in the footsteps of the wise; seek what they sought.", author: "Miyamoto Musashi" },
  { text: "The nation that makes a great distinction between its scholars and its warriors will have its thinking done by cowards and its fighting done by fools.", author: "Thucydides" },
  { text: "The secret of happiness is freedom, and the secret of freedom is courage.", author: "Thucydides" },
  { text: "Everyone sees what you appear to be, few experience what you really are.", author: "Niccolò Machiavelli" },
  { text: "The first method for estimating the intelligence of a ruler is to look at the men he has around him.", author: "Niccolò Machiavelli" },
  { text: "Impossible is a word to be found only in the dictionary of fools.", author: "Napoleon Bonaparte" },
  { text: "It is not that we have a short time to live, but that we waste a great deal of it.", author: "Seneca" },
  { text: "Luck is what happens when preparation meets opportunity.", author: "Seneca" }
];

// Latin proverbs — original, English translation, and how it's used
const latinSayings = [
  { latin: "Carpe diem.", english: "Seize the day.", usage: "A reminder to make the most of the present moment rather than worrying about the future." },
  { latin: "Dum spiro, spero.", english: "While I breathe, I hope.", usage: "Expresses unwavering optimism — as long as you are alive, there is reason to keep going." },
  { latin: "Fortis fortuna adiuvat.", english: "Fortune favors the bold.", usage: "Used to encourage taking decisive action instead of hesitating when opportunity arises." },
  { latin: "Per aspera ad astra.", english: "Through hardships to the stars.", usage: "Encouragement that struggle and difficulty are the path to achieving something great." },
  { latin: "Scientia potentia est.", english: "Knowledge is power.", usage: "Emphasizes that education and understanding give you real strength in the world." },
  { latin: "Memento mori.", english: "Remember that you will die.", usage: "Not morbid — it's a Stoic reminder to live fully and not waste time on trivial things." },
  { latin: "Veni, vidi, vici.", english: "I came, I saw, I conquered.", usage: "Julius Caesar's famous declaration of swift, decisive victory — used to celebrate total success." },
  { latin: "Alea iacta est.", english: "The die has been cast.", usage: "Said when a decision has been made and there's no turning back — commit fully to the path." },
  { latin: "Non scholae, sed vitae discimus.", english: "We learn not for school, but for life.", usage: "A reminder that the purpose of education is to prepare you for real life, not just pass tests." },
  { latin: "Audentes fortuna iuvat.", english: "Fortune favors the daring.", usage: "Similar to 'fortis fortuna adiuvat' — encourages courage and boldness in the face of uncertainty." },
  { latin: "Amor vincit omnia.", english: "Love conquers all.", usage: "From Virgil — used to express that love and compassion are the most powerful forces in the world." },
  { latin: "Cogito, ergo sum.", english: "I think, therefore I am.", usage: "Descartes' foundation of philosophy — the act of thinking proves your own existence." },
  { latin: "Tempus fugit.", english: "Time flies.", usage: "A reminder not to waste time — the hours pass faster than you think." },
  { latin: "Acta, non verba.", english: "Deeds, not words.", usage: "Actions speak louder than words — prove yourself through what you do, not what you say." },
  { latin: "Ad astra per aspera.", english: "To the stars through difficulties.", usage: "The reverse phrasing of 'per aspera ad astra' — the destination is emphasized over the struggle." },
  { latin: "Dulce et decorum est pro patria mori.", english: "It is sweet and fitting to die for one's country.", usage: "From Horace — often quoted seriously and ironically, sparking debate about duty and sacrifice." },
  { latin: "Errare humanum est.", english: "To err is human.", usage: "Nobody is perfect — making mistakes is part of being human, so learn from them and move on." },
  { latin: "Festina lente.", english: "Make haste slowly.", usage: "Move quickly but carefully — speed without thought leads to mistakes." },
  { latin: "Homo sum, humani nihil a me alienum puto.", english: "I am human, and nothing human is alien to me.", usage: "From Terence — a call for empathy and understanding of all people, regardless of difference." },
  { latin: "In vino veritas.", english: "In wine, there is truth.", usage: "People tend to speak honestly when their guard is down — used humorously and seriously." },
  { latin: "Labor omnia vincit.", english: "Hard work conquers all.", usage: "From Virgil — persistence and effort will overcome any obstacle." },
  { latin: "Mens sana in corpore sano.", english: "A healthy mind in a healthy body.", usage: "From Juvenal — physical health and mental health are deeply connected." },
  { latin: "Ars longa, vita brevis.", english: "Art is long, life is short.", usage: "From Hippocrates — mastering a craft takes longer than a single lifetime, so start now." },
  { latin: "Veritas lux mea.", english: "Truth is my light.", usage: "A motto meaning that truth guides your path — honesty is the foundation of a good life." },
  { latin: "Sic parvis magna.", english: "Greatness from small beginnings.", usage: "Even the greatest achievements started as something tiny — never despise humble origins." }
];

// Japanese sayings — hiragana, romaji, and English meaning
const japaneseSayings = [
  { hiragana: "なないころびやおき", romaji: "Nana korobi ya oki", english: "Fall seven times, stand up eight.", usage: "Perseverance — no matter how many times you fail, you always get back up one more time." },
  { hiragana: "いちごいちえ", romaji: "Ichi-go ichi-e", english: "One time, one meeting.", usage: "Every encounter is unique and can never be repeated, so treasure each moment fully." },
  { hiragana: "さるもきからおちる", romaji: "Saru mo ki kara ochiru", english: "Even monkeys fall from trees.", usage: "Everyone makes mistakes, even experts — it's a gentle reminder that nobody is perfect." },
  { hiragana: "がまんづよいものがかつ", romaji: "Gaman-zuyoi mono ga katsu", english: "The patient one wins.", usage: "Success comes to those who can endure and persist through difficulty." },
  { hiragana: "せんりのみちもいっぽから", romaji: "Senri no michi mo ippo kara", english: "A journey of a thousand miles begins with a single step.", usage: "Don't be overwhelmed by big goals — just start, and the rest will follow." },
  { hiragana: "じごうじとく", romaji: "Jigō jitoku", english: "You reap what you sow.", usage: "Your actions have consequences — good effort brings good results, and vice versa." },
  { hiragana: "のうあるたかはつめをかくす", romaji: "Nō aru taka wa tsume wo kakusu", english: "The hawk with talent hides its claws.", usage: "Truly skilled people don't need to show off — real strength is quiet and confident." },
  { hiragana: "けいぞくはちからなり", romaji: "Keizoku wa chikara nari", english: "Continuity is power.", usage: "Consistent effort over time is more powerful than bursts of intensity — keep showing up." },
  { hiragana: "にどあることはさんどある", romaji: "Nido aru koto wa sando aru", english: "What happens twice will happen a third time.", usage: "Patterns repeat — learn from what keeps happening so you can prepare or change course." },
  { hiragana: "ちりもつもればやまとなる", romaji: "Chiri mo tsumoreba yama to naru", english: "Even dust, piled up, becomes a mountain.", usage: "Small efforts add up over time — never underestimate the power of doing a little every day." },
  { hiragana: "いしのうえにもさんねん", romaji: "Ishi no ue ni mo san nen", english: "Three years on a stone.", usage: "Even sitting on a cold stone, patience will warm it — stick with something long enough and you will succeed." },
  { hiragana: "みざるきかざるいわざる", romaji: "Mizaru, kikazaru, iwazaru", english: "See no evil, hear no evil, speak no evil.", usage: "The famous three wise monkeys — a reminder to avoid dwelling on negativity." },
  { hiragana: "はなよりだんご", romaji: "Hana yori dango", english: "Dumplings over flowers.", usage: "Practicality over beauty — substance matters more than appearance." },
  { hiragana: "あめふってじかたまる", romaji: "Ame futte ji katamaru", english: "After rain, the ground hardens.", usage: "Adversity makes you stronger — going through hard times solidifies your foundation." },
  { hiragana: "いちにちいちぜん", romaji: "Ichi nichi ichi zen", english: "One day, one good deed.", usage: "Do at least one good thing every day — small acts of kindness accumulate." },
  { hiragana: "まけるがかち", romaji: "Makeru ga kachi", english: "To lose is to win.", usage: "Sometimes stepping back or conceding is the wiser, more strategic choice." },
  { hiragana: "くちはわざわいのもと", romaji: "Kuchi wa wazawai no moto", english: "The mouth is the source of disaster.", usage: "Careless words cause trouble — think before you speak." },
  { hiragana: "じゅうにんといろ", romaji: "Jūnin toiro", english: "Ten people, ten colors.", usage: "Everyone is different — respect that people have their own perspectives and preferences." },
  { hiragana: "ばかにつけるくすりはない", romaji: "Baka ni tsukeru kusuri wa nai", english: "There is no medicine for a fool.", usage: "You can't help someone who refuses to learn — humorous but pointed." },
  { hiragana: "かえるのこはかえる", romaji: "Kaeru no ko wa kaeru", english: "A frog's child is a frog.", usage: "Like parent, like child — children often follow in their parents' footsteps." },
  { hiragana: "おもいたったがきちじつ", romaji: "Omoitatta ga kichijitsu", english: "The day you decide is the lucky day.", usage: "Don't wait for the perfect moment — the best time to start is when you decide to." },
  { hiragana: "わらうかどにはふくきたる", romaji: "Warau kado ni wa fuku kitaru", english: "Fortune comes to the house that laughs.", usage: "A positive, joyful attitude attracts good luck and good things." },
  { hiragana: "さんにんよればもんじゅのちえ", romaji: "Sannin yoreba Monju no chie", english: "Three people together have the wisdom of Monju.", usage: "Teamwork produces better ideas — collaboration is more powerful than working alone." },
  { hiragana: "ねこにこばん", romaji: "Neko ni koban", english: "Gold coins to a cat.", usage: "Don't waste valuable things on those who can't appreciate them — like casting pearls before swine." },
  { hiragana: "なくこはそだつ", romaji: "Naku ko wa sodatsu", english: "The crying child grows.", usage: "Expressing your needs — even through struggle — is how you grow stronger." }
];

export default function DailyPlanner({ params, searchParams }: { params: Promise<{ date: string }>, searchParams: Promise<{ user?: string }> }) {
  const resolvedParams = use(params);
  const resolvedSearch = use(searchParams);
  
  const { activeUser, points, addPoints } = useUserPreferences();
  
  const dateStr = resolvedParams.date;
  
  // Use explicit URL parameter if provided, otherwise fallback to activeUser context (or 'all' for admin)
  const userFilter = resolvedSearch.user || (activeUser !== 'admin' ? activeUser : "all");
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [flipped, setFlipped] = useState<Record<string, boolean>>({});
  const [rewards, setRewards] = useState<Record<string, { type: 'points' | 'prize', text: string }>>({});

  const handleFlipCard = (id: string) => {
    if (flipped[id]) return;
    
    // 20% chance for a prize
    const isPrize = Math.random() < 0.2; 
    const rewardType = isPrize ? 'prize' : 'points';
    const rewardText = isPrize ? 'PRIZE: Pick Dinner Tonight!' : '+5 Knowledge Points';
    
    setRewards(prev => ({ ...prev, [id]: { type: rewardType, text: rewardText } }));
    setFlipped(prev => ({ ...prev, [id]: true }));
    
    if (isPrize) {
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
    
    if (!isPrize && addPoints) {
      addPoints(activeUser, 5);
    }
  };

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('date', dateStr);
      
    if (data) {
      setTasks(data);
    }
    setLoading(false);
  }, [dateStr]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const completeTask = async (taskId: string) => {
    // Optimistic UI update — remove from visible list
    setTasks(prev => prev.filter(t => t.id !== taskId));
    
    // Delete the completed task from Supabase
    await supabase.from('tasks').delete().eq('id', taskId);
  };

  const removeTask = async (taskId: string) => {
    // Optimistic UI update
    setTasks(prev => prev.filter(t => t.id !== taskId));
    
    // Delete from Supabase
    await supabase.from('tasks').delete().eq('id', taskId);
  };

  const bumpTask = async (task: Task) => {
    // Move task to the next weekday
    let nextDate = addDays(parseISO(dateStr), 1);
    if (isWeekend(nextDate)) {
      nextDate = getDay(nextDate) === 6 ? addDays(nextDate, 2) : addDays(nextDate, 1);
    }

    // Optimistic UI update — remove from today's list
    setTasks(prev => prev.filter(t => t.id !== task.id));

    // Update the date in Supabase
    await supabase
      .from('tasks')
      .update({ date: format(nextDate, 'yyyy-MM-dd') })
      .eq('id', task.id);
  };
  
  let displayDate = "Unknown Date";
  let prevDateStr = "";
  let nextDateStr = "";
  
  try {
    const parsedDate = parseISO(dateStr);
    displayDate = format(parsedDate, "EEEE, MMMM do, yyyy");
    prevDateStr = format(subDays(parsedDate, 1), 'yyyy-MM-dd');
    nextDateStr = format(addDays(parsedDate, 1), 'yyyy-MM-dd');
  } catch (e) {
    displayDate = dateStr;
    prevDateStr = dateStr;
    nextDateStr = dateStr;
  }
  
  const userQuery = resolvedSearch.user ? `?user=${resolvedSearch.user}` : "";

  const dateHash = dateStr.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const dailyQuote = quotes[dateHash % quotes.length];
  const dailyLatin = latinSayings[(dateHash * 7) % latinSayings.length];
  const dailyJapanese = japaneseSayings[(dateHash * 13) % japaneseSayings.length];


  const dayAssignments = tasks.filter(a => 
    (userFilter === "all" || a.user === userFilter)
  );

  // Removed mission blurb logic per user request

  return (
    <div className={styles.plannerContainer}>
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          &larr;
        </Link>
        <div className={styles.headerContent}>
          <div className={styles.dateNavContainer}>
            <Link href={`/day/${prevDateStr}${userQuery}`} className={styles.dateNavArrow}>
              &larr;
            </Link>
            <h1>{displayDate}</h1>
            <Link href={`/day/${nextDateStr}${userQuery}`} className={styles.dateNavArrow}>
              &rarr;
            </Link>
          </div>
          <p>Daily Operations &amp; Lesson Plan</p>
        </div>
      </header>

      <div className={styles.wisdomSection}>
        <div className={styles.wisdomHeader}>
          <h3 className={styles.wisdomHeading}>Daily Wisdom</h3>
          <div className={styles.pointsDisplay}>
            🧠 {points?.[activeUser] || 0} PTS
          </div>
        </div>

        <div className={styles.wisdomGrid}>
          {[
            { id: 'strategy', label: 'Strategy', content: <><p className={styles.quoteText}>&ldquo;{dailyQuote.text}&rdquo;</p><p className={styles.quoteAuthor}>&mdash; {dailyQuote.author}</p></>, bgClass: styles.strategyBack },
            { id: 'latin', label: 'Latin', content: <><p className={styles.latinOriginal}>{dailyLatin.latin}</p><p className={styles.wisdomTranslation}>{dailyLatin.english}</p><p className={styles.wisdomUsage}>{dailyLatin.usage}</p></>, bgClass: styles.latinBack },
            { id: 'japanese', label: '日本語', content: <><p className={styles.japaneseHiragana}>{dailyJapanese.hiragana}</p><p className={styles.japaneseRomaji}>{dailyJapanese.romaji}</p><p className={styles.wisdomTranslation}>{dailyJapanese.english}</p><p className={styles.wisdomUsage}>{dailyJapanese.usage}</p></>, bgClass: styles.japaneseBack },
          ].map((card) => (
            <div key={card.id} className={`${styles.flipContainer} ${flipped[card.id] ? styles.flipped : ''}`}>
              <div className={styles.flipper}>
                {/* Front (Mystery) */}
                <div className={styles.cardFront} onClick={() => handleFlipCard(card.id)}>
                  <div className={styles.mysteryIcon}>?</div>
                  <div className={styles.mysteryText}>Reveal Daily Wisdom</div>
                </div>
                
                {/* Back (Content) */}
                <div className={`${styles.cardBack} ${card.bgClass}`}>
                  <span className={styles.wisdomLabel}>{card.label}</span>
                  {card.content}
                  
                  {rewards[card.id] && (
                    <div className={styles.rewardBadge}>
                      {rewards[card.id].type === 'points' ? (
                        <div className={styles.rewardPoints}>
                          🧠 {rewards[card.id].text}
                        </div>
                      ) : (
                        <div className={styles.rewardPrize}>
                          🎟️ {rewards[card.id].text}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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
                <button className={styles.actionButton} onClick={() => completeTask(assignment.id!)}>Complete</button>
                <button className={`${styles.actionButton} ${styles.bumpButton}`} onClick={() => bumpTask(assignment)}>Bump</button>
                <button 
                  className={styles.actionButton} 
                  style={{ color: 'var(--accent-warning)', border: '1px solid var(--accent-warning)', background: 'transparent' }}
                  onClick={() => removeTask(assignment.id!)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
