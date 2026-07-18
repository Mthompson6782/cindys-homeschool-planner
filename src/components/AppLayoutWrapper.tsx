"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "../app/layout.module.css";
import FeedbackModal from "./FeedbackModal";
import UserSettingsModal from "./UserSettingsModal";
import { useUserPreferences } from "./UserProvider";

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const { activeUser, avatars } = useUserPreferences();
  
  // Hide sidebar on specific views
  const isDailyView = pathname?.startsWith("/day/");
  const isAdminView = pathname?.startsWith("/admin");
  const hideSidebar = isDailyView || isAdminView;

  return (
    <div className={styles.appContainer}>
      {!hideSidebar && (
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
          
          <div style={{ marginTop: 'auto', padding: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <button 
              onClick={() => setIsSettingsModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--bg-glass)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {avatars[activeUser] ? (
                  <img src={avatars[activeUser]!} alt={activeUser} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span>{activeUser === 'admin' ? '⚙️' : '👤'}</span>
                )}
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Using as</div>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>{activeUser}</div>
              </div>
              <span style={{ color: 'var(--text-muted)' }}>⚙️</span>
            </button>
          </div>
        </nav>
      )}
      <main className={styles.mainContent} style={hideSidebar ? { padding: 0 } : {}}>
        {children}
      </main>
      
      <FeedbackModal 
        isOpen={isFeedbackModalOpen} 
        onClose={() => setIsFeedbackModalOpen(false)} 
      />
      <UserSettingsModal 
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
