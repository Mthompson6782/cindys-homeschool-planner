"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { useUserPreferences } from '@/components/UserProvider';

export default function Week1InteractiveLesson() {
  const { activeUser, addPoints } = useUserPreferences();
  const [currentStep, setCurrentStep] = useState(1);

  // Simulation 1: Cat Detector
  const [catSimState, setCatSimState] = useState<{ mode: 'idle' | 'traditional' | 'ai'; result: string | null; success: boolean | null }>({
    mode: 'idle',
    result: null,
    success: null
  });

  // Simulation 2: Rule Breaker Lab
  const [rules, setRules] = useState({ rule1: 'Has 4 legs', rule2: 'Has a backrest', rule3: 'Made of wood' });
  const [testedItems, setTestedItems] = useState<Record<string, boolean>>({});
  const [reflection, setReflection] = useState('');
  const [xpClaimed, setXpClaimed] = useState(false);

  // Simulation 3: Hospital & Car Scanner
  const [hospitalScan, setHospitalScan] = useState<'idle' | 'scanning' | 'done'>('idle');
  const [carScan, setCarScan] = useState<'idle' | 'scanning' | 'done'>('idle');

  const runCatSim = (type: 'traditional' | 'ai') => {
    setCatSimState({ mode: type, result: 'Scanning pixels...', success: null });
    setTimeout(() => {
      if (type === 'traditional') {
        setCatSimState({
          mode: 'traditional',
          result: '❌ ERROR: Rule "IF has_fur == true" failed on hairless Sphynx cat! System crashed.',
          success: false
        });
      } else {
        setCatSimState({
          mode: 'ai',
          result: '✅ SUCCESS: Neural Network detected Cat with 99.4% confidence based on facial structure pattern!',
          success: true
        });
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
    }, 600);
  };

  const handleTestItem = (itemId: string) => {
    setTestedItems(prev => ({ ...prev, [itemId]: true }));
  };

  const handleClaimXp = () => {
    if (xpClaimed) return;
    if (addPoints) {
      addPoints(activeUser, 15);
    }
    setXpClaimed(true);
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 }
    });
  };

  const runHospitalScan = () => {
    setHospitalScan('scanning');
    setTimeout(() => setHospitalScan('done'), 800);
  };

  const runCarScan = () => {
    setCarScan('scanning');
    setTimeout(() => setCarScan('done'), 800);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.5rem', fontFamily: 'system-ui, sans-serif', color: 'var(--text-primary)' }}>
      {/* Top Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <Link href="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
          &larr; Back to Daily Planner
        </Link>
        <span style={{ 
          background: 'rgba(59, 130, 246, 0.15)', 
          color: '#3b82f6', 
          padding: '4px 12px', 
          borderRadius: '999px', 
          fontWeight: 'bold', 
          fontSize: '0.85rem',
          border: '1px solid rgba(59, 130, 246, 0.3)'
        }}>
          Intro to CS: AI • Week 1
        </span>
      </div>

      {/* Hero Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(147, 51, 234, 0.15))', 
        border: '1px solid var(--border-light)', 
        borderRadius: '16px', 
        padding: '1.5rem 2rem', 
        marginBottom: '2rem' 
      }}>
        <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.8rem', fontWeight: 800 }}>⚡ Week 1: The AI Revolution</h1>
        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Explore how computers evolved from dumb recipe-followers to self-learning intelligent machines.
        </p>
      </div>

      {/* Progress Tabs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '2rem' }}>
        {[
          { step: 1, title: '1. The Battle', icon: '⚔️' },
          { step: 2, title: '2. Cat Test', icon: '🐱' },
          { step: 3, title: '3. Rule-Breaker Lab', icon: '🪑' },
          { step: 4, title: '4. Real World Apps', icon: '🚀' },
        ].map(item => (
          <button
            key={item.step}
            onClick={() => setCurrentStep(item.step)}
            style={{
              background: currentStep === item.step ? 'var(--accent-primary)' : 'var(--bg-glass)',
              color: currentStep === item.step ? '#ffffff' : 'var(--text-secondary)',
              border: currentStep === item.step ? '1px solid var(--accent-primary)' : '1px solid var(--border-light)',
              borderRadius: '10px',
              padding: '10px',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{item.icon}</span>
            <span>{item.title}</span>
          </button>
        ))}
      </div>

      {/* STEP 1: The Battle */}
      {currentStep === 1 && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>How Do Computers Actually "Think"?</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
              For 50 years, computers were basically blind calculators. They followed human rules blindly. AI flips this completely upside down.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Card 1: Traditional */}
            <div style={{ 
              background: 'var(--bg-card)', 
              border: '2px solid rgba(239, 68, 68, 0.4)', 
              borderRadius: '14px', 
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.8rem' }}>📜</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#f87171' }}>Traditional Coding</h3>
                  <small style={{ color: 'var(--text-secondary)' }}>"The Recipe Approach"</small>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                A human programmer writes rigid, step-by-step <code>IF / THEN</code> rules.
              </p>
              <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid var(--border-dark)' }}>
                1. Crack 2 eggs<br/>
                2. Whisk in bowl<br/>
                3. IF pan == hot THEN cook
              </div>
              <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600 }}>
                ⚠️ Flaw: If anything unexpected happens (e.g. an egg shell drops in), the system breaks.
              </div>
            </div>

            {/* Card 2: AI */}
            <div style={{ 
              background: 'var(--bg-card)', 
              border: '2px solid rgba(59, 130, 246, 0.5)', 
              borderRadius: '14px', 
              padding: '1.5rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '1.8rem' }}>🧠</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#60a5fa' }}>Artificial Intelligence</h3>
                  <small style={{ color: 'var(--text-secondary)' }}>"The Pattern Discovery Approach"</small>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Humans provide massive datasets. The computer discovers the mathematical patterns on its own.
              </p>
              <div style={{ background: 'var(--bg-main)', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem', marginBottom: '1rem', border: '1px solid var(--border-dark)' }}>
                Input: 100,000 cooked omelets<br/>
                AI detects: Temperature &amp; timing patterns<br/>
                Output: Perfect cooking logic
              </div>
              <div style={{ color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
                ✨ Superpower: Adapts to chaos, variations, and messy real-world data.
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button 
              onClick={() => setCurrentStep(2)}
              style={{
                background: 'var(--accent-primary)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Next: Try the Cat Test &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: The Cat Test Simulation */}
      {currentStep === 2 && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Interactive Experiment: The Cat Detector</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Let's see why traditional code fails on visual tasks, while Machine Learning thrives.
            </p>
          </div>

          <div style={{ 
            background: 'var(--bg-card)', 
            border: '1px solid var(--border-light)', 
            borderRadius: '16px', 
            padding: '2rem', 
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>🐱‍👤</div>
            <h3 style={{ margin: '0 0 0.25rem 0' }}>Target: Hairless Sphynx Cat</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              (No fur, big bat-like ears, wrinkles. Will the computer know it's a cat?)
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
              <button
                onClick={() => runCatSim('traditional')}
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444',
                  color: '#f87171',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🛑 Test with Traditional Rules
              </button>
              <button
                onClick={() => runCatSim('ai')}
                style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid #10b981',
                  color: '#34d399',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                🧠 Test with AI Neural Network
              </button>
            </div>

            {/* Simulation Feedback Display */}
            {catSimState.result && (
              <div style={{
                background: catSimState.success === null ? 'var(--bg-glass)' : catSimState.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${catSimState.success === null ? 'var(--border-light)' : catSimState.success ? '#10b981' : '#ef4444'}`,
                borderRadius: '10px',
                padding: '1rem',
                color: catSimState.success === null ? 'var(--text-primary)' : catSimState.success ? '#10b981' : '#ef4444',
                fontWeight: 600,
                fontSize: '0.95rem'
              }}>
                {catSimState.result}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={() => setCurrentStep(1)}
              style={{ background: 'transparent', border: '1px solid var(--border-dark)', color: 'var(--text-secondary)', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}
            >
              &larr; Back
            </button>
            <button 
              onClick={() => setCurrentStep(3)}
              style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Next: Rule-Breaker Lab &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Rule-Breaker Mini-Lab */}
      {currentStep === 3 && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>🪑 The "Rule-Breaker" Challenge</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
              Your mission: Try to define a "Chair" with strict programming rules, and watch how easily reality breaks them!
            </p>
          </div>

          {/* Rules Inputs */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>Step 1: Your Programmed Rules for a "Chair"</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rule 1:</label>
                <input 
                  type="text" 
                  value={rules.rule1} 
                  onChange={e => setRules({ ...rules, rule1: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-dark)', background: 'var(--bg-main)', color: 'var(--text-primary)' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Rule 2:</label>
                <input 
                  type="text" 
                  value={rules.rule2} 
                  onChange={e => setRules({ ...rules, rule2: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-dark)', background: 'var(--bg-main)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
          </div>

          {/* Test Objects */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Step 2: Test Your Rules Against the Real World</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Click each object below to see how traditional rules break down:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
              {[
                { id: 'beanbag', icon: '🛋️', name: 'Bean Bag Chair', result: '💥 BROKEN! 0 legs and 0 backrest, but it IS a chair!' },
                { id: 'dog', icon: '🐕', name: 'A Dog', result: '💥 BROKEN! Has 4 legs and a back, but it is NOT a chair!' },
                { id: 'stump', icon: '🪵', name: 'Tree Stump Stool', result: '💥 BROKEN! 1 solid wood piece, no backrest, but functions as a chair!' },
              ].map(obj => (
                <div 
                  key={obj.id}
                  onClick={() => handleTestItem(obj.id)}
                  style={{
                    background: testedItems[obj.id] ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-glass)',
                    border: `1px solid ${testedItems[obj.id] ? '#ef4444' : 'var(--border-light)'}`,
                    borderRadius: '10px',
                    padding: '1rem',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>{obj.icon}</div>
                  <strong style={{ fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem' }}>{obj.name}</strong>
                  {testedItems[obj.id] ? (
                    <small style={{ color: '#f87171', fontWeight: 600 }}>{obj.result}</small>
                  ) : (
                    <small style={{ color: 'var(--accent-primary)', fontWeight: 'bold' }}>👉 Click to Test Rule</small>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Reflection & Reward */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '1.5rem', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Step 3: Quick Takeaway &amp; Claim XP</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
              Why is showing an AI 10,000 photos of chairs better than writing 100 <code>IF/THEN</code> rules?
            </p>
            <textarea
              rows={2}
              placeholder="e.g. Because the AI learns all the weird variations that human rules can't predict..."
              value={reflection}
              onChange={e => setReflection(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border-dark)', background: 'var(--bg-main)', color: 'var(--text-primary)', marginBottom: '1rem' }}
            />
            <button
              onClick={handleClaimXp}
              disabled={xpClaimed}
              style={{
                background: xpClaimed ? '#10b981' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: xpClaimed ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              {xpClaimed ? '🎉 +15 Knowledge Points Claimed!' : '✨ Submit Lab & Claim +15 Knowledge Points'}
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={() => setCurrentStep(2)}
              style={{ background: 'transparent', border: '1px solid var(--border-dark)', color: 'var(--text-secondary)', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' }}
            >
              &larr; Back
            </button>
            <button 
              onClick={() => setCurrentStep(4)}
              style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Next: Real-World Business Apps &rarr;
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Real-World Business Applications */}
      {currentStep === 4 && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>🚀 Real-World Business Power</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '650px', margin: '0 auto' }}>
              Why are billion-dollar industries replacing traditional software with AI models?
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {/* Case Study 1: Hospital */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>🏥</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Healthcare: AI Diagnostics</h3>
                  <small style={{ color: 'var(--text-secondary)' }}>Hospital Imaging &amp; Early Detection</small>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                Human radiologists get fatigued after inspecting hundreds of X-rays. AI vision models trained on millions of historical scans highlight micro-fractures and early tumor tissue in milliseconds.
              </p>
              <button
                onClick={runHospitalScan}
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid #3b82f6',
                  color: '#60a5fa',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                {hospitalScan === 'idle' && '🔬 Simulate AI Lung Scan'}
                {hospitalScan === 'scanning' && '⚡ Processing 5,000,000 training patterns...'}
                {hospitalScan === 'done' && '✅ 99.8% Match: Suspicious Nodule Identified'}
              </button>
            </div>

            {/* Case Study 2: Tesla / Waymo */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: '16px', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2rem' }}>🚗</span>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem' }}>Autonomy: Self-Driving Cars</h3>
                  <small style={{ color: 'var(--text-secondary)' }}>Real-Time Sensor Fusion</small>
                </div>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                You cannot write an <code>IF/THEN</code> rule for every possible road event. Neural networks process 8 camera feeds simultaneously to predict pedestrian trajectories.
              </p>
              <button
                onClick={runCarScan}
                style={{
                  background: 'rgba(147, 51, 234, 0.15)',
                  border: '1px solid #9333ea',
                  color: '#c084fc',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  width: '100%'
                }}
              >
                {carScan === 'idle' && '📡 Simulate Road Camera AI'}
                {carScan === 'scanning' && '🚗 Processing 60 frames/sec...'}
                {carScan === 'done' && '🛑 Pedestrian detected 40ft ahead: Braking'}
              </button>
            </div>
          </div>

          <div style={{ background: 'var(--bg-glass)', border: '1px solid var(--border-light)', borderRadius: '14px', padding: '1.5rem', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>🎓 Week 1 Complete!</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              You understand the fundamental difference between traditional algorithms and modern AI models.
            </p>
            <Link
              href="/"
              style={{
                display: 'inline-block',
                background: 'var(--accent-primary)',
                color: 'white',
                padding: '10px 24px',
                borderRadius: '8px',
                fontWeight: 700,
                textDecoration: 'none'
              }}
            >
              Return to Planner &amp; Mark Task Complete
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
