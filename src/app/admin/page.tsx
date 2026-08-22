"use client";

import React, { useState } from 'react';
import styles from './Admin.module.css';
import { supabase } from '@/lib/supabase';
import { addDays, format, isWeekend, parseISO, getDay, isAfter, isEqual } from 'date-fns';
import { useUserPreferences, UserProfile } from '@/components/UserProvider';

export default function AdminDashboard() {
  const { points, setPointBalance, grandPrize, setGrandPrize, activeUser } = useUserPreferences();
  
  const [generatorState, setGeneratorState] = useState({
    user: 'leo',
    textbook: '',
    description: '',
    startDate: '',
    endDate: '',
    pattern: 'everyday',
  });
  
  const [uploadedSchedules, setUploadedSchedules] = useState<any[]>([]);
  
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setUploadedSchedules([]);
      return;
    }

    if (file.name.endsWith('.zip')) {
      try {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        const contents = await zip.loadAsync(file);
        
        const schedules = [];
        for (const [filename, fileData] of Object.entries(contents.files)) {
          if (!fileData.dir && filename.endsWith('.json')) {
            const text = await fileData.async('text');
            try {
              schedules.push(JSON.parse(text));
            } catch (err) {
              console.error(`Invalid JSON in zip file: ${filename}`);
            }
          }
        }
        
        if (schedules.length > 0) {
          setUploadedSchedules(schedules);
        } else {
          alert("No valid JSON files found in the ZIP.");
          setUploadedSchedules([]);
        }
      } catch (err) {
        alert("Error reading ZIP file");
        setUploadedSchedules([]);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          setUploadedSchedules([json]);
        } catch (err) {
          alert("Invalid JSON file");
          setUploadedSchedules([]);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleBulkGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const tasksToInsert = [];
    
    if (uploadedSchedules.length > 0) {
      for (const scheduleObj of uploadedSchedules) {
        if (!scheduleObj.schedule || !Array.isArray(scheduleObj.schedule)) {
          console.warn("Skipping invalid schedule object:", scheduleObj);
          continue;
        }
        
        for (const session of scheduleObj.schedule) {
          const defaultTitle = scheduleObj.metadata?.title || scheduleObj.course || "Assignment";
          const prefix = generatorState.textbook ? generatorState.textbook : defaultTitle;
          const title = prefix;
          
          let desc = "";
          if (session.lessons && Array.isArray(session.lessons) && session.lessons.length > 0) {
            desc = `Lessons: ${session.lessons.join(", ")}`;
          } else {
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
      }
      
      if (tasksToInsert.length === 0) {
        alert("No valid tasks found in the uploaded file(s).");
        setLoading(false);
        return;
      }
    } else {
      let currentDate = parseISO(generatorState.startDate);
      const endDate = parseISO(generatorState.endDate);
      
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
            title: generatorState.textbook,
            user: generatorState.user,
            description: generatorState.description
          });
        }
        
        currentDate = addDays(currentDate, 1);
      }
    }
    
    if (tasksToInsert.length > 0) {
      const { error } = await supabase.from('tasks').insert(tasksToInsert);
      if (error) alert("Error saving tasks: " + error.message);
      else {
        alert(`Successfully generated ${tasksToInsert.length} tasks!`);
        setGeneratorState({ ...generatorState, textbook: '', description: '' });
        setUploadedSchedules([]);
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

  const handleDownloadTemplate = () => {
    const template = {
      course: "Example Course Name",
      academic_year: "2026-2027",
      schedule_days: ["Monday", "Wednesday"],
      schedule: [
        {
          date: "2026-08-19",
          day: "Wednesday",
          lesson: "Lesson 1: Introduction",
          part: "Part 1 - Reading"
        },
        {
          date: "2026-08-24",
          day: "Monday",
          lesson: "Lesson 1: Introduction",
          part: "Part 2 - Assignment"
        }
      ]
    };
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schedule_template.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.adminContainer}>
      <header className={styles.header}>
        <h1>Command Center</h1>
        <p>Manage curriculum patterns, individual assignments, and schedule adjustments.</p>
      </header>

      <div className={styles.grid}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Bulk Pattern Generator */}
          <section className={styles.card}>
          <h2>Bulk Pattern Generator</h2>
          <form onSubmit={handleBulkGenerate}>
            <div className={styles.formGroup}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ margin: 0 }}>Upload JSON Schedule (Optional)</label>
                <button 
                  type="button" 
                  onClick={handleDownloadTemplate} 
                  className={styles.buttonOutline}
                  style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', width: 'auto', margin: 0 }}
                >
                  Download Template
                </button>
              </div>
              <input 
                type="file" 
                accept=".json,application/json,text/plain,.zip,application/zip"
                className={styles.input} 
                onChange={handleFileUpload}
                onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
                disabled={loading}
              />
              {uploadedSchedules.length > 0 && (
                <small style={{color: 'var(--accent-success)', marginTop: '0.5rem', display: 'block'}}>
                  Loaded {uploadedSchedules.length} schedule(s): {uploadedSchedules.map(s => s.metadata?.title || s.course).filter(Boolean).join(', ') || 'Ready to import'}. Other fields below will be ignored.
                </small>
              )}
            </div>

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
                <label>Schedule Pattern</label>
                <select 
                  className={styles.select}
                  value={generatorState.pattern}
                  onChange={e => setGeneratorState({...generatorState, pattern: e.target.value})}
                  disabled={loading || uploadedSchedules.length > 0}
                >
                  <option value="everyday">Everyday (M-F)</option>
                  <option value="m_w">M/W</option>
                  <option value="t_th">T/Th</option>
                  <option value="friday">Friday</option>
                </select>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Subject / Task Title</label>
              <input 
                type="text" 
                className={styles.input} 
                placeholder={uploadedSchedules.length > 0 ? "Optional subject prefix..." : "e.g. Japanese"}
                value={generatorState.textbook}
                onChange={e => setGeneratorState({...generatorState, textbook: e.target.value})}
                required={uploadedSchedules.length === 0}
                disabled={loading}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Details / Instructions</label>
              <textarea 
                className={styles.textarea} 
                placeholder="e.g. Study Hiragana..."
                value={generatorState.description}
                onChange={e => setGeneratorState({...generatorState, description: e.target.value})}
                disabled={loading || uploadedSchedules.length > 0}
              ></textarea>
            </div>
            
            <div className={styles.splitRow}>
              <div className={styles.formGroup}>
                <label>Start Date</label>
                <input 
                  type="date" 
                  className={styles.input} 
                  value={generatorState.startDate}
                  onChange={e => setGeneratorState({...generatorState, startDate: e.target.value})}
                  required={uploadedSchedules.length === 0}
                  disabled={loading || uploadedSchedules.length > 0}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Target End Date</label>
                <input 
                  type="date" 
                  className={styles.input} 
                  value={generatorState.endDate}
                  onChange={e => setGeneratorState({...generatorState, endDate: e.target.value})}
                  required={uploadedSchedules.length === 0}
                  disabled={loading || uploadedSchedules.length > 0}
                />
              </div>
            </div>
            
            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? 'Processing...' : 'Generate Schedule'}
            </button>
          </form>
        </section>

        {/* Manage Knowledge Points */}
        {(activeUser === 'admin' || activeUser === 'cindy') && (
          <section className={styles.card}>
            <h2>Manage Knowledge Points</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
            Adjust the daily wisdom reward points for each student.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg-glass)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            {(['leo', 'alex', 'cindy'] as UserProfile[]).map(student => (
              <div key={student} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ textTransform: 'capitalize', fontWeight: '600', color: 'var(--text-primary)' }}>{student}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <input 
                    type="number" 
                    value={points?.[student] || 0} 
                    onChange={(e) => setPointBalance(student, parseInt(e.target.value) || 0)}
                    style={{ 
                      width: '70px', 
                      padding: '6px', 
                      borderRadius: 'var(--radius-sm)', 
                      border: '1px solid var(--border-dark)', 
                      background: 'var(--bg-main)', 
                      color: 'var(--text-primary)',
                      textAlign: 'right',
                      fontWeight: '600'
                    }}
                  />
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 'bold' }}>PTS</span>
                </div>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.2rem' }}>Grand Prize Settings</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
            Set the text that appears when a student wins the 20% random Grand Prize on the daily wisdom tiles.
          </p>
          <div className={styles.formGroup}>
            <label>Current Grand Prize</label>
            <input 
              type="text" 
              className={styles.input} 
              value={grandPrize || ''}
              onChange={(e) => setGrandPrize(e.target.value)}
              placeholder="e.g. Pick Dinner Tonight!"
            />
          </div>
        </section>
        )}
        </div>

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
