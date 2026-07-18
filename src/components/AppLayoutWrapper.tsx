"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../app/layout.module.css";
import FeedbackModal from "./FeedbackModal";

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  
  // Hide sidebar on the daily planner view
  const isDailyView = pathname?.startsWith("/day/");

  return (
    <div className={styles.appContainer}>
      {!isDailyView && (
        <nav className={styles.sidebar}>
          <div className={styles.logo}>
            <h2>Home School</h2>
          </div>
          <ul className={styles.navLinks}>
            <li>
              <Link href="/" className={styles.navLink}>
                <span className={styles.icon}>📅</span> Calendar
              </Link>
            </li>
            <li>
              <Link href="/admin" className={styles.navLink}>
                <span className={styles.icon}>⚙️</span> Admin & Setup
              </Link>
            </li>
            <li>
              <button 
                onClick={() => setIsFeedbackModalOpen(true)} 
                className={styles.navLink}
                style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: '1rem' }}
              >
                <span className={styles.icon}>💡</span> Suggest Feature
              </button>
            </li>
          </ul>
        </nav>
      )}
      <main className={styles.mainContent} style={isDailyView ? { padding: 0 } : {}}>
        {children}
      </main>
      
      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onClose={() => setIsFeedbackModalOpen(false)} 
      />
    </div>
  );
}
