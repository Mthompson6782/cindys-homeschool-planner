"use client";

import React, { useRef } from 'react';
import { useUserPreferences, UserProfile, ThemePreference } from './UserProvider';
import styles from './UserSettingsModal.module.css';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UserSettingsModal({ isOpen, onClose }: UserSettingsModalProps) {
  const { activeUser, setActiveUser, theme, setTheme, avatars, setAvatar, points, setPointBalance } = useUserPreferences();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingFor, setUploadingFor] = React.useState<UserProfile | null>(null);

  if (!isOpen) return null;

  const users: UserProfile[] = ['admin', 'leo', 'alex', 'cindy'];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingFor) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          // In a real app we'd resize this via canvas, but for MVP Base64 is fine
          setAvatar(uploadingFor, event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = (user: UserProfile) => {
    setUploadingFor(user);
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        <h2 className={styles.title}>Settings & Customization</h2>
        
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Who is using this device?</h3>
          <div className={styles.userGrid}>
            {users.map((user) => (
              <div 
                key={user}
                className={`${styles.userCard} ${activeUser === user ? styles.active : ''}`}
                onClick={() => setActiveUser(user)}
              >
                <div 
                  className={styles.avatarContainer}
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerUpload(user);
                  }}
                >
                  {avatars[user] ? (
                    <img src={avatars[user]!} alt={user} className={styles.avatarImage} />
                  ) : (
                    <span>{user === 'admin' ? '⚙️' : '👤'}</span>
                  )}
                  <div className={styles.avatarUploadOverlay}>📷</div>
                </div>
                <span className={styles.userName}>{user}</span>
              </div>
            ))}
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className={styles.hiddenInput} 
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
        </div>

        {activeUser === 'admin' && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Manage Knowledge Points</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg-glass)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
              {(['leo', 'alex', 'cindy'] as UserProfile[]).map(student => (
                <div key={student} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ textTransform: 'capitalize', fontWeight: '600', color: 'var(--text-primary)' }}>{student}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input 
                      type="number" 
                      value={points[student] || 0} 
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
          </div>
        )}

        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>App Theme</h3>
          <div className={styles.themeSelector}>
            <div 
              className={`${styles.themeOption} ${theme === 'light' ? styles.active : ''}`}
              onClick={() => setTheme('light')}
            >
              ☀️ Light
            </div>
            <div 
              className={`${styles.themeOption} ${theme === 'dark' ? styles.active : ''}`}
              onClick={() => setTheme('dark')}
            >
              🌙 Dark
            </div>
            <div 
              className={`${styles.themeOption} ${theme === 'system' ? styles.active : ''}`}
              onClick={() => setTheme('system')}
            >
              💻 System
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
