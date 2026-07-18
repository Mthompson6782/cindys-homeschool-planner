"use client";

import { useState } from "react";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameMonth, isSameDay, addDays, parseISO } from "date-fns";
import styles from "./Calendar.module.css";
import { useRouter } from "next/navigation";
import { mockSchedule as mockAssignments, blackoutDates } from "@/lib/mockData";

export default function Calendar() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filter, setFilter] = useState("all");

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const onDateClick = (day: Date) => {
    setSelectedDate(day);
    const dateStr = format(day, 'yyyy-MM-dd');
    router.push(`/day/${dateStr}?user=${filter}`);
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "d";
  const rows = [];

  let days = [];
  let day = startDate;
  let formattedDate = "";

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      formattedDate = format(day, dateFormat);
      const cloneDay = day;
      
      const dayAssignments = mockAssignments.filter(
        a => isSameDay(parseISO(a.date), cloneDay) && (filter === "all" || a.user === filter)
      );
      
      const isBlackout = blackoutDates.includes(format(cloneDay, 'yyyy-MM-dd'));

      days.push(
        <div
          className={`${styles.col} ${styles.cell} ${
            !isSameMonth(day, monthStart)
              ? styles.disabled
              : isSameDay(day, selectedDate) ? styles.selected 
              : isBlackout ? styles.blackout : ""
          }`}
          key={day.toString()}
          onClick={() => onDateClick(cloneDay)}
        >
          <span className={styles.number}>{formattedDate}</span>
          {isBlackout && <div className={styles.blackoutLabel}>Holiday / Blackout</div>}
          <div className={styles.assignmentsList}>
            {dayAssignments.map(a => (
              <div key={a.id} className={`${styles.assignmentBadge} ${styles[`badge_${a.user}`]}`}>
                {a.title}
              </div>
            ))}
          </div>
        </div>
      );
      day = addDays(day, 1);
    }
    rows.push(
      <div className={styles.row} key={day.toString()}>
        {days}
      </div>
    );
    days = [];
  }

  return (
    <div className={styles.calendarContainer}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <button onClick={prevMonth} className={styles.navButton}>&larr;</button>
          <h2>{format(currentDate, "MMMM yyyy")}</h2>
          <button onClick={nextMonth} className={styles.navButton}>&rarr;</button>
        </div>
        <div className={styles.filters}>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="input-field" style={{ width: 'auto', padding: '8px 12px' }}>
            <option value="all">All People</option>
            <option value="leo">Leo (Student)</option>
            <option value="alex">Alex (Student)</option>
            <option value="cindy">Cindy (Parent)</option>
          </select>
        </div>
      </header>
      
      <div className={styles.daysHeader}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className={`${styles.col} ${styles.colCenter}`}>
            {d}
          </div>
        ))}
      </div>
      
      <div className={styles.body}>{rows}</div>
    </div>
  );
}
