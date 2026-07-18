"use client";

import React, { useState } from 'react';
import styles from './Admin.module.css';

export default function AdminDashboard() {
  const [generatorState, setGeneratorState] = useState({
    user: 'leo',
    textbook: '',
    startDate: '',
    endDate: '',
    lessonsPerDay: '1',
    pattern: 'everyday',
  });

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`This would generate assignments for ${generatorState.user} starting on ${generatorState.startDate} based on your pattern!`);
  };

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1>Command Center</h1>
        <p>Manage curriculum patterns, individual assignments, and schedule adjustments.</p>
      </header>

      <div className={styles.grid}>
        {/* Bulk Pattern Generator */}
        <section className={styles.card}>
          <h2>Bulk Pattern Generator</h2>
          <form onSubmit={handleGenerate}>
            <div className={styles.splitRow}>
              <div className={styles.formGroup}>
                <label>Student / User</label>
                <select 
                  className={styles.select}
                  value={generatorState.user}
                  onChange={e => setGeneratorState({...generatorState, user: e.target.value})}
                >
                  <option value="leo">Leo</option>
                  <option value="alex">Alex</option>
                  <option value="cindy">Cindy</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Textbook / Subject Name</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="e.g. Easy Grammar Plus" 
                  value={generatorState.textbook}
                  onChange={e => setGeneratorState({...generatorState, textbook: e.target.value})}
                  required
                />
              </div>
            </div>
            
            <div className={styles.splitRow}>
              <div className={styles.formGroup}>
                <label>Start Date</label>
                <input 
                  type="date" 
                  className={styles.input} 
                  value={generatorState.startDate}
                  onChange={e => setGeneratorState({...generatorState, startDate: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Target End Date</label>
                <input 
                  type="date" 
                  className={styles.input} 
                  value={generatorState.endDate}
                  onChange={e => setGeneratorState({...generatorState, endDate: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className={styles.splitRow}>
              <div className={styles.formGroup}>
                <label>Lessons / Pages Per Day</label>
                <input 
                  type="number" 
                  className={styles.input} 
                  min="1" 
                  value={generatorState.lessonsPerDay}
                  onChange={e => setGeneratorState({...generatorState, lessonsPerDay: e.target.value})}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Schedule Pattern</label>
                <select 
                  className={styles.select}
                  value={generatorState.pattern}
                  onChange={e => setGeneratorState({...generatorState, pattern: e.target.value})}
                >
                  <option value="everyday">Everyday (M-F)</option>
                  <option value="m_w">M/W</option>
                  <option value="t_th">T/Th</option>
                  <option value="friday">Friday</option>
                </select>
              </div>
            </div>
            
            <button type="submit" className={styles.button}>Generate Schedule</button>
          </form>
        </section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Add Single Assignment */}
          <section className={styles.card}>
            <h2>Add Single Task</h2>
            <form onSubmit={e => { e.preventDefault(); alert('Task added!'); }}>
              <div className={styles.splitRow}>
                <div className={styles.formGroup}>
                  <label>Assign To</label>
                  <select className={styles.select}>
                    <option value="cindy">Cindy</option>
                    <option value="leo">Leo</option>
                    <option value="alex">Alex</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Date</label>
                  <input type="date" className={styles.input} required />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Task Title</label>
                <input type="text" className={styles.input} placeholder="e.g. Science Experiment Prep" required />
              </div>
              <div className={styles.formGroup}>
                <label>Details / Instructions</label>
                <textarea className={styles.textarea} placeholder="Optional instructions..."></textarea>
              </div>
              <button type="submit" className={styles.buttonOutline}>Add Task</button>
            </form>
          </section>

          {/* Blackout Dates */}
          <section className={styles.card}>
            <h2>Blackout Dates (Bump Forward)</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Add a holiday or sick day. All scheduled lessons falling on or after this date will automatically shift forward by one day.
            </p>
            <form onSubmit={e => { e.preventDefault(); alert('Blackout date saved. Schedule adjusted!'); }}>
              <div className={styles.formGroup}>
                <label>Date to Blackout</label>
                <input type="date" className={styles.input} required />
              </div>
              <div className={styles.formGroup}>
                <label>Reason</label>
                <input type="text" className={styles.input} placeholder="e.g. Thanksgiving Break, Sick Day" required />
              </div>
              <button type="submit" className={styles.button} style={{ background: 'var(--accent-warning)' }}>
                Apply Blackout & Bump Forward
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
