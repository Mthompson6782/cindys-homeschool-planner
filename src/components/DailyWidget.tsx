"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { format } from 'date-fns';
import { supabase, Task } from '@/lib/supabase';
import { useUserPreferences } from './UserProvider';
import styles from './DailyWidget.module.css';

export default function DailyWidget({ forcedUser }: { forcedUser?: string }) {
  const { activeUser } = useUserPreferences();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  const userToFetch = forcedUser || activeUser;
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    
    let query = supabase.from('tasks').select('*').eq('date', todayStr);
    
    if (userToFetch !== 'admin' && userToFetch !== 'all') {
      query = query.eq('user', userToFetch);
    }
    
    const { data, error } = await query;
    if (data && !error) {
      setTasks(data);
    }
    setLoading(false);
  }, [todayStr, userToFetch]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return (
    <div className={styles.widgetContainer}>
      <div className={styles.widgetHeader}>
        <div className={styles.dateDisplay}>{format(new Date(), 'EEEE, MMM d')}</div>
        {userToFetch !== 'admin' && userToFetch !== 'all' && (
          <div className={styles.userBadge}>{userToFetch}</div>
        )}
      </div>
      
      <div className={styles.taskCount}>
        {loading ? '-' : tasks.length}
      </div>
      <div className={styles.taskSubtitle}>
        {tasks.length === 1 ? 'Task' : 'Tasks'} remaining today
      </div>
      
      {loading ? (
        <div className={styles.loading}>Loading tasks...</div>
      ) : tasks.length === 0 ? (
        <div className={styles.emptyState}>No tasks for today! Enjoy the day.</div>
      ) : (
        <div className={styles.taskList}>
          {tasks.map(task => (
            <div key={task.id} className={styles.taskItem}>
              <div className={styles.taskTitle}>{task.title}</div>
              {task.description && <div className={styles.taskDesc}>{task.description}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
