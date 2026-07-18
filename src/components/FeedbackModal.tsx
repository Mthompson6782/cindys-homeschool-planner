"use client";

import React, { useState } from 'react';
import styles from './FeedbackModal.module.css';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to send request');
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setTitle('');
        setDescription('');
        onClose();
      }, 2500);
    } catch (err) {
      setError('Uh oh! Something went wrong sending the suggestion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        
        {isSuccess ? (
          <div className={styles.successMessage}>
            <span className={styles.successIcon}>🎉</span>
            <h2 className={styles.title}>Suggestion Sent!</h2>
            <p className={styles.subtitle}>Thanks! Your idea has been sent directly to the engineering team.</p>
          </div>
        ) : (
          <>
            <h2 className={styles.title}>Suggest a Feature</h2>
            <p className={styles.subtitle}>Have an idea for Cindy's Home School Planner? Let us know!</p>
            
            {error && <p className={styles.error}>{error}</p>}
            
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="title">Feature Title</label>
                <input
                  id="title"
                  type="text"
                  className={styles.input}
                  placeholder="E.g., Add a dark mode toggle"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label} htmlFor="description">How would it work?</label>
                <textarea
                  id="description"
                  className={styles.textarea}
                  placeholder="Describe the feature and how you would use it..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              
              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isSubmitting || !title.trim() || !description.trim()}
              >
                {isSubmitting ? 'Sending...' : 'Send Suggestion'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
