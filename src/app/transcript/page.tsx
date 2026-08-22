"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase, Task } from '@/lib/supabase';
import { useUserPreferences, UserProfile } from '@/components/UserProvider';
import styles from './Transcript.module.css';

const COURSE_CATALOG: Record<string, { subject: string; description: string }> = {
  "10th Grade English Literature": {
    subject: "Language Arts / English",
    description: "A comprehensive high school English literature survey exploring classic and modern works (Wells, Vonnegut, Poe, Adams, and Shakespeare's Macbeth). Emphasizes literary analysis, thematic deconstruction, vocabulary in context, and critical writing."
  },
  "Oak Meadow World History": {
    subject: "Social Studies / History",
    description: "A rigorous high school World History curriculum exploring global developments from 1450 CE to the modern era. Topics include the Age of Discovery, Atlantic Revolutions, Industrialization, Global Imperialism, the World Wars, Cold War geopolitics, and global sustainability."
  },
  "Easy Grammar Plus": {
    subject: "Language Arts / Grammar",
    description: "An intensive mastery-based study of English grammar and mechanics. Focuses on the prepositional approach to sentence structure, parts of speech, complex verb tenses, subject-verb agreement, punctuation rules, capitalization, and formal correspondence."
  },
  "ACT English Prep (The Official ACT English Guide)": {
    subject: "Test Preparation & Applied English",
    description: "Specialized standardized test preparation emphasizing grammar conventions, sentence structure, punctuation mastery, rhetorical skills, topic development, and timed strategy sets from official ACT practice exams."
  },
  "Pre-Algebra Curriculum Schedule": {
    subject: "Mathematics",
    description: "Foundational mathematics bridging arithmetic and algebraic reasoning. Covers operations with integers, rational numbers, multi-step linear equations, inequalities, ratios, proportions, percentage applications, and introductory coordinate geometry."
  },
  "Intro to CS: AI (Business & Real-World Focus)": {
    subject: "STEM / Computer Science",
    description: "An AI-first introduction to computer science aligned with Arkansas state standards. Covers traditional vs. machine learning algorithms, computational thinking, data privacy and cybersecurity, Python programming with AI APIs, and real-world business case studies."
  }
};

function getCourseDetails(title: string) {
  const match = Object.entries(COURSE_CATALOG).find(([key]) => 
    title.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(title.toLowerCase())
  );
  if (match) return match[1];

  if (title.toLowerCase().includes("math") || title.toLowerCase().includes("algebra") || title.toLowerCase().includes("geometry")) {
    return { subject: "Mathematics", description: "Comprehensive study of mathematical concepts, problem solving, and analytical reasoning." };
  }
  if (title.toLowerCase().includes("history") || title.toLowerCase().includes("social") || title.toLowerCase().includes("geography")) {
    return { subject: "Social Studies", description: "In-depth historical inquiry, source analysis, and chronological study of civilizations and cultures." };
  }
  if (title.toLowerCase().includes("english") || title.toLowerCase().includes("literature") || title.toLowerCase().includes("grammar")) {
    return { subject: "Language Arts", description: "Focus on reading comprehension, textual analysis, composition, and language mechanics." };
  }
  if (title.toLowerCase().includes("science") || title.toLowerCase().includes("cs") || title.toLowerCase().includes("ai") || title.toLowerCase().includes("coding")) {
    return { subject: "Science & Technology", description: "Foundational concepts, scientific inquiry, computational thinking, and modern technology applications." };
  }

  return { subject: "Academic Elective", description: "Structured homeschool coursework focusing on core subject mastery, independent study, and practical application." };
}

export default function TranscriptPage() {
  const { activeUser, avatars } = useUserPreferences();
  const [selectedStudent, setSelectedStudent] = useState<string>(activeUser === 'admin' || activeUser === 'cindy' ? 'leo' : activeUser);
  const [allTasks, setAllTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'official'>('dashboard');
  const [grades, setGrades] = useState<Record<string, string>>({});

  // Load saved grades from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('homeschool_grades');
      if (saved) {
        setGrades(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load grades from localStorage", e);
    }
  }, []);

  const handleGradeChange = (courseKey: string, newGrade: string) => {
    const updated = { ...grades, [courseKey]: newGrade };
    setGrades(updated);
    localStorage.setItem('homeschool_grades', JSON.stringify(updated));
  };

  const fetchStudentData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user', selectedStudent)
      .order('date', { ascending: true });

    if (data && !error) {
      setAllTasks(data);
    }
    setLoading(false);
  }, [selectedStudent]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  // Group tasks by course
  const coursesMap: Record<string, { total: Task[]; completed: Task[]; pending: Task[] }> = {};

  allTasks.forEach(task => {
    const courseTitle = task.title || "General Assignment";
    if (!coursesMap[courseTitle]) {
      coursesMap[courseTitle] = { total: [], completed: [], pending: [] };
    }
    coursesMap[courseTitle].total.push(task);
    if (task.status === 'completed') {
      coursesMap[courseTitle].completed.push(task);
    } else {
      coursesMap[courseTitle].pending.push(task);
    }
  });

  const totalLessons = allTasks.length;
  const completedLessons = allTasks.filter(t => t.status === 'completed').length;
  const overallPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const courseCount = Object.keys(coursesMap).length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={styles.container}>
      {/* Non-printing Header Controls */}
      <div className={styles.noPrint}>
        <header className={styles.header}>
          <div>
            <Link href="/" className={styles.backLink}>&larr; Back to Calendar</Link>
            <h1 className={styles.title}>📜 Grade Book &amp; Transcript</h1>
            <p className={styles.subtitle}>Academic tracking, curriculum course descriptions, and official transcript generation.</p>
          </div>

          <div className={styles.headerActions}>
            <button 
              onClick={() => setActiveTab(activeTab === 'dashboard' ? 'official' : 'dashboard')}
              className={styles.tabToggleBtn}
            >
              {activeTab === 'dashboard' ? '📄 View Official Printable Transcript' : '📊 View Interactive Grade Book'}
            </button>
            {activeTab === 'official' && (
              <button onClick={handlePrint} className={styles.printBtn}>
                🖨️ Print / Save PDF
              </button>
            )}
          </div>
        </header>

        {/* Student Selector */}
        <div className={styles.studentSelectorBar}>
          <span className={styles.selectorLabel}>Select Student:</span>
          {(['leo', 'alex'] as UserProfile[]).map(student => (
            <button
              key={student}
              onClick={() => setSelectedStudent(student)}
              className={`${styles.studentBtn} ${selectedStudent === student ? styles.studentBtnActive : ''} ${styles[student]}`}
            >
              <div className={styles.avatarMini}>
                {avatars[student] ? (
                  <img src={avatars[student]!} alt={student} />
                ) : (
                  <span>👤</span>
                )}
              </div>
              <span style={{ textTransform: 'capitalize' }}>{student}</span>
            </button>
          ))}
        </div>
      </div>

      {/* DASHBOARD VIEW */}
      {activeTab === 'dashboard' && (
        <div className={styles.dashboardView}>
          {/* Summary Metric Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>📚</div>
              <div>
                <div className={styles.statValue}>{courseCount}</div>
                <div className={styles.statLabel}>Enrolled Courses</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>✅</div>
              <div>
                <div className={styles.statValue}>{completedLessons} <span className={styles.statSub}>/ {totalLessons}</span></div>
                <div className={styles.statLabel}>Lessons Mastered</div>
              </div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statIcon}>📈</div>
              <div>
                <div className={styles.statValue}>{overallPercentage}%</div>
                <div className={styles.statLabel}>Overall Completion Rate</div>
              </div>
            </div>
          </div>

          {/* Courses List */}
          <h2 className={styles.sectionHeading}>Enrolled Courses, Descriptions &amp; Grades</h2>
          {loading ? (
            <div className={styles.loading}>Loading student records...</div>
          ) : courseCount === 0 ? (
            <div className={styles.emptyState}>
              No courses or assignments found for {selectedStudent}. Upload courses in the Command Center to begin tracking!
            </div>
          ) : (
            <div className={styles.coursesGrid}>
              {Object.entries(coursesMap).map(([courseTitle, data]) => {
                const courseKey = `${selectedStudent}_${courseTitle}`;
                const currentGrade = grades[courseKey] || 'A';
                const percent = data.total.length > 0 ? Math.round((data.completed.length / data.total.length) * 100) : 0;
                const details = getCourseDetails(courseTitle);

                return (
                  <div key={courseTitle} className={styles.courseCard}>
                    <div className={styles.courseHeader}>
                      <div>
                        <div className={styles.subjectBadge}>{details.subject}</div>
                        <h3 className={styles.courseTitle}>{courseTitle}</h3>
                        <p className={styles.courseDescription}>{details.description}</p>
                        <div className={styles.courseMeta}>
                          📊 {data.completed.length} of {data.total.length} lessons completed ({percent}%)
                        </div>
                      </div>
                      
                      {/* Grade Selector */}
                      <div className={styles.gradeBox}>
                        <label className={styles.gradeLabel}>Grade</label>
                        <select 
                          value={currentGrade} 
                          onChange={(e) => handleGradeChange(courseKey, e.target.value)}
                          className={styles.gradeSelect}
                        >
                          <option value="A+">A+ (97-100%)</option>
                          <option value="A">A (93-96%)</option>
                          <option value="A-">A- (90-92%)</option>
                          <option value="B+">B+ (87-89%)</option>
                          <option value="B">B (83-86%)</option>
                          <option value="B-">B- (80-82%)</option>
                          <option value="Pass">Pass</option>
                          <option value="In Progress">In Progress</option>
                        </select>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className={styles.progressBarBg}>
                      <div 
                        className={styles.progressBarFill} 
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>

                    {/* Mastered Lessons / Things Learned Breakdown */}
                    <div className={styles.masterySection}>
                      <h4 className={styles.masteryHeading}>
                        <span>Curriculum Mastery &amp; Log ({data.completed.length} Completed)</span>
                      </h4>
                      
                      {data.completed.length === 0 ? (
                        <div className={styles.noLessons}>No lessons marked completed yet. Complete assignments on the daily planner to build this log!</div>
                      ) : (
                        <ul className={styles.masteryList}>
                          {data.completed.map(t => (
                            <li key={t.id} className={styles.masteryItem}>
                              <span className={styles.checkmark}>✓</span>
                              <div className={styles.masteryContent}>
                                <div className={styles.masteryDate}>{t.date}</div>
                                <div className={styles.masteryDesc}>{t.description || t.title}</div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* OFFICIAL PRINTABLE TRANSCRIPT VIEW */}
      {activeTab === 'official' && (
        <div className={styles.officialTranscript}>
          <div className={styles.officialHeader}>
            <div className={styles.officialSchoolName}>CINDY&apos;S HOMESCHOOL ACADEMY</div>
            <div className={styles.officialDocTitle}>OFFICIAL HIGH SCHOOL ACADEMIC TRANSCRIPT</div>
            <div className={styles.officialSubtitle}>Academic Year: 2026 – 2027</div>
          </div>

          <div className={styles.studentInfoGrid}>
            <div className={styles.infoRow}>
              <strong>Student Name:</strong> <span style={{ textTransform: 'capitalize' }}>{selectedStudent}</span>
            </div>
            <div className={styles.infoRow}>
              <strong>Grade Level:</strong> 10th Grade
            </div>
            <div className={styles.infoRow}>
              <strong>Administrator / Parent:</strong> Cindy
            </div>
            <div className={styles.infoRow}>
              <strong>Date Generated:</strong> {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>

          {/* Official Course Table with Subject and Descriptions */}
          <table className={styles.transcriptTable}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', width: '35%' }}>Course Title &amp; Department</th>
                <th style={{ textAlign: 'center', width: '15%' }}>Lessons</th>
                <th style={{ textAlign: 'center', width: '15%' }}>Completed</th>
                <th style={{ textAlign: 'center', width: '15%' }}>Progress</th>
                <th style={{ textAlign: 'center', width: '10%' }}>Grade</th>
                <th style={{ textAlign: 'center', width: '10%' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(coursesMap).map(([courseTitle, data]) => {
                const courseKey = `${selectedStudent}_${courseTitle}`;
                const grade = grades[courseKey] || 'A';
                const percent = data.total.length > 0 ? Math.round((data.completed.length / data.total.length) * 100) : 0;
                const status = percent === 100 ? 'Completed' : 'In Progress';
                const details = getCourseDetails(courseTitle);

                return (
                  <tr key={courseTitle}>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{courseTitle}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>{details.subject}</div>
                    </td>
                    <td style={{ textAlign: 'center' }}>{data.total.length}</td>
                    <td style={{ textAlign: 'center' }}>{data.completed.length}</td>
                    <td style={{ textAlign: 'center' }}>{percent}%</td>
                    <td style={{ textAlign: 'center', fontWeight: 'bold' }}>{grade}</td>
                    <td style={{ textAlign: 'center' }}>{status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Detailed Course Descriptions & Scope */}
          <div className={styles.transcriptMasterySection}>
            <h3 className={styles.transcriptMasteryTitle}>Course Descriptions &amp; Academic Scope:</h3>
            {Object.entries(coursesMap).map(([courseTitle]) => {
              const details = getCourseDetails(courseTitle);
              return (
                <div key={courseTitle} style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{courseTitle}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>({details.subject})</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#334155', margin: '0.25rem 0 0 0', lineHeight: 1.45 }}>
                    {details.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Curriculum Mastery Overview */}
          <div className={styles.transcriptMasterySection}>
            <h3 className={styles.transcriptMasteryTitle}>Summary of Curriculum Skills &amp; Concepts Mastered:</h3>
            {Object.entries(coursesMap).map(([courseTitle, data]) => (
              <div key={courseTitle} style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{courseTitle} ({data.completed.length} Completed Lessons):</strong>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: '0.25rem 0 0 0', lineHeight: 1.5 }}>
                  {data.completed.map(t => t.description?.split('\n')[0] || t.title).join(' • ') || 'Curriculum in progress.'}
                </p>
              </div>
            ))}
          </div>

          {/* Signature Line */}
          <div className={styles.signatureSection}>
            <div className={styles.sigBlock}>
              <div className={styles.sigLine}></div>
              <div>Parent / Head Administrator Signature</div>
            </div>
            <div className={styles.sigBlock}>
              <div className={styles.sigLine}></div>
              <div>Date</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
