"use client";

import React, { useState } from 'react';
import styles from './Admin.module.css';
import { supabase } from '@/lib/supabase';
import { addDays, format, isWeekend, parseISO, getDay, isAfter, isEqual } from 'date-fns';

export default function AdminDashboard() {
  const [generatorState, setGeneratorState] = useState({
    user: 'leo',
    textbook: '',
    startDate: '',
    endDate: '',
    lessonsPerDay: '1',
    pattern: 'everyday',
  });
  
  const [singleTask, setSingleTask] = useState({
    user: 'cindy',
    date: '',
    title: '',
    description: ''
  });
  
  const [blackoutState, setBlackoutState] = useState({
    date: '',
    reason: ''
  });

  const [loading, setLoading] = useState(false);

  const handleBulkGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    let currentDate = parseISO(generatorState.startDate);
    const endDate = parseISO(generatorState.endDate);
    
    let lessonNumber = 1;
    const tasksToInsert = [];
    
    while (currentDate <= endDate) {
      const dayOfWeek = getDay(currentDate); // 0 = Sun, 1 = Mon, etc.
      
      let shouldAdd = false;
      if (generatorState.pattern === 'everyday' && !isWeekend(currentDate)) shouldAdd = true;
      if (generatorState.pattern === 'm_w' && (dayOfWeek === 1 || dayOfWeek === 3)) shouldAdd = true;
      if (generatorState.pattern === 't_th' && (dayOfWeek === 2 || dayOfWeek === 4)) shouldAdd = true;
      if (generatorState.pattern === 'friday' && dayOfWeek === 5) shouldAdd = true;
      
      if (shouldAdd) {
        tasksToInsert.push({
          date: format(currentDate, 'yyyy-MM-dd'),
          time: "09:00",
          title: `${generatorState.textbook}: Lesson ${lessonNumber}`,
          user: generatorState.user,
          description: `Work through Lesson ${lessonNumber} in ${generatorState.textbook}.`
        });
        lessonNumber += parseInt(generatorState.lessonsPerDay) || 1;
      }
      
      currentDate = addDays(currentDate, 1);
    }
    
    if (tasksToInsert.length > 0) {
      const { error } = await supabase.from('tasks').insert(tasksToInsert);
      if (error) alert("Error saving tasks: " + error.message);
      else {
        alert(`Successfully generated ${tasksToInsert.length} tasks!`);
        setGeneratorState({ ...generatorState, textbook: '' });
      }
    } else {
      alert("No valid dates found in that range for the selected pattern.");
    }
    setLoading(false);
  };

  const handleAddSingleTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { error } = await supabase.from('tasks').insert([{
      date: singleTask.date,
      time: "10:00",
      title: singleTask.title,
      user: singleTask.user,
      description: singleTask.description
    }]);
    
    if (error) alert("Error: " + error.message);
    else {
      alert('Task added successfully!');
      setSingleTask({ ...singleTask, title: '', description: '' });
    }
    setLoading(false);
  };

  const handleBlackoutBump = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const blackoutDateStr = blackoutState.date;
    const blackoutParsed = parseISO(blackoutDateStr);
    
    // 1. Fetch all tasks on or after the blackout date
    const { data: futureTasks, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .gte('date', blackoutDateStr);
      
    if (fetchError || !futureTasks) {
      alert("Error fetching tasks to bump.");
      setLoading(false);
      return;
    }
    
    if (futureTasks.length === 0) {
      alert("No scheduled tasks found on or after this date to bump.");
      setLoading(false);
      return;
    }
    
    // 2. Add the Blackout Task itself so the user knows why it's empty
    await supabase.from('tasks').insert([{
      date: blackoutDateStr,
      title: `BLACKOUT: ${blackoutState.reason}`,
      user: 'admin',
      description: 'System blackout date. No assignments.'
    }]);
    
    // 3. For each future task, increment its date by 1 day (skip weekends if bumped to saturday)
    for (const task of futureTasks) {
      // Don't bump existing blackout placeholders
      if (task.title.startsWith('BLACKOUT:')) continue;
      
      let currentTaskDate = parseISO(task.date);
      let nextValidDate = addDays(currentTaskDate, 1);
      
      // If the next day is a weekend, skip to Monday
      if (isWeekend(nextValidDate)) {
        nextValidDate = getDay(nextValidDate) === 6 ? addDays(nextValidDate, 2) : addDays(nextValidDate, 1);
      }
      
      await supabase
        .from('tasks')
        .update({ date: format(nextValidDate, 'yyyy-MM-dd') })
        .eq('id', task.id);
    }
    
    alert(`Blackout applied. Bumped ${futureTasks.length} tasks forward!`);
    setBlackoutState({ date: '', reason: '' });
    setLoading(false);
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
          <form onSubmit={handleBulkGenerate}>
            <div className={styles.splitRow}>
              <div className={styles.formGroup}>
                <label>Student / User</label>
                <select 
                  className={styles.select}
                  value={generatorState.user}
                  onChange={e => setGeneratorState({...generatorState, user: e.target.value})}
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Schedule Pattern</label>
                <select 
                  className={styles.select}
                  value={generatorState.pattern}
                  onChange={e => setGeneratorState({...generatorState, pattern: e.target.value})}
                  disabled={loading}
                >
                  <option value="everyday">Everyday (M-F)</option>
                  <option value="m_w">M/W</option>
                  <option value="t_th">T/Th</option>
                  <option value="friday">Friday</option>
                </select>
              </div>
            </div>
            
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Processing...' : 'Generate Schedule'}
            </button>
          </form>
        </section>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Add Single Assignment */}
          <section className={styles.card}>
            <h2>Add Single Task</h2>
            <form onSubmit={handleAddSingleTask}>
              <div className={styles.splitRow}>
                <div className={styles.formGroup}>
                  <label>Assign To</label>
                  <select 
                    className={styles.select}
                    value={singleTask.user}
                    onChange={e => setSingleTask({...singleTask, user: e.target.value})}
                    disabled={loading}
                  >
                    <option value="cindy">Cindy</option>
                    <option value="leo">Leo</option>
                    <option value="alex">Alex</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Date</label>
                  <input 
                    type="date" 
                    className={styles.input} 
                    value={singleTask.date}
                    onChange={e => setSingleTask({...singleTask, date: e.target.value})}
                    required 
                    disabled={loading}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Task Title</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="e.g. Science Experiment Prep" 
                  value={singleTask.title}
                  onChange={e => setSingleTask({...singleTask, title: e.target.value})}
                  required 
                  disabled={loading}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Details / Instructions</label>
                <textarea 
                  className={styles.textarea} 
                  placeholder="Optional instructions..."
                  value={singleTask.description}
                  onChange={e => setSingleTask({...singleTask, description: e.target.value})}
                  disabled={loading}
                ></textarea>
              </div>
              <button type="submit" className={styles.buttonOutline} disabled={loading}>
                {loading ? 'Adding...' : 'Add Task'}
              </button>
            </form>
          </section>

          {/* Blackout Dates */}
          <section className={styles.card}>
            <h2>Blackout Dates (Bump Forward)</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Add a holiday or sick day. All scheduled lessons falling on or after this date will automatically shift forward by one day.
            </p>
            <form onSubmit={handleBlackoutBump}>
              <div className={styles.formGroup}>
                <label>Date to Blackout</label>
                <input 
                  type="date" 
                  className={styles.input} 
                  value={blackoutState.date}
                  onChange={e => setBlackoutState({...blackoutState, date: e.target.value})}
                  required 
                  disabled={loading}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Reason</label>
                <input 
                  type="text" 
                  className={styles.input} 
                  placeholder="e.g. Thanksgiving Break, Sick Day" 
                  value={blackoutState.reason}
                  onChange={e => setBlackoutState({...blackoutState, reason: e.target.value})}
                  required 
                  disabled={loading}
                />
              </div>
              <button type="submit" className={styles.button} style={{ background: 'var(--accent-warning)' }} disabled={loading}>
                {loading ? 'Bumping Tasks...' : 'Apply Blackout & Bump Forward'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
