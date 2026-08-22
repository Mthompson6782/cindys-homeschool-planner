import React from 'react';
import Link from 'next/link';

export default function CoursesPage() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-primary)' }}>📚 Digital Academy &amp; Courses</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Interactive lessons, readings, and activities for independent study.</p>
      </header>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        <div style={{ 
          background: 'var(--bg-glass)', 
          border: '1px solid var(--border-light)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '1.5rem',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <span className="tag tag-leo" style={{ marginRight: '8px' }}>Leo</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-primary)', marginTop: '0.5rem' }}>
                Intro to Computer Science: Artificial Intelligence
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                Business &amp; Real-World Practical Focus (Arkansas State Standards Aligned)
              </p>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>Available Units:</h3>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-card)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Week 1: The AI Revolution</strong>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Traditional Coding vs. AI &amp; Hospital/Auto Case Studies</div>
                </div>
                <Link 
                  href="/courses/ai/week-1"
                  style={{ 
                    background: 'var(--accent-primary)', 
                    color: 'white', 
                    padding: '6px 14px', 
                    borderRadius: '6px', 
                    textDecoration: 'none', 
                    fontWeight: 'bold',
                    fontSize: '0.9rem' 
                  }}
                >
                  📖 Open Lesson
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
