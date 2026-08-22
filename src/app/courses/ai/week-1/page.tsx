import React from 'react';
import Link from 'next/link';

export default function Week1Lesson() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif', lineHeight: '1.6', color: 'var(--text-primary)' }}>
      <header style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-light)', paddingBottom: '1rem' }}>
        <Link href="/" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 'bold' }}>&larr; Back to Planner</Link>
        <h1 style={{ marginTop: '1rem', color: 'var(--text-primary)' }}>Week 1: The AI Revolution</h1>
        <p style={{ color: 'var(--text-secondary)' }}><strong>Course:</strong> Intro to Computer Science: Artificial Intelligence</p>
      </header>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ color: 'var(--accent-secondary)' }}>Day 1: Traditional Coding vs. Artificial Intelligence</h2>
        <p>For the last 50 years, computers have run the world. But until recently, they were actually quite "dumb." They only did exactly what a human programmer told them to do.</p>
        
        <h3>What is Traditional Coding?</h3>
        <p>Traditional programming is <strong>rules-based</strong>. A programmer writes step-by-step instructions (an algorithm) for the computer to follow. Think of it like a recipe:</p>
        <ol>
          <li>Crack two eggs.</li>
          <li>Whisk them in a bowl.</li>
          <li>Cook on medium heat for 3 minutes.</li>
        </ol>
        <p>If a computer encounters a situation that isn't in the rules, it crashes or gives an error. For example, if you ask a traditional program to identify a picture of a cat, a programmer would have to write rules like:</p>
        <ul>
          <li><em>IF the image has two pointy triangles on top...</em></li>
          <li><em>AND IF the image has long thin lines on the face (whiskers)...</em></li>
          <li><em>THEN it is a cat.</em></li>
        </ul>
        <p>But what if the cat in the picture is facing away? What if it's a hairless cat? The rules break, and the traditional program fails.</p>

        <h3>What is Artificial Intelligence?</h3>
        <p>Instead of giving the computer a list of rules, <strong>Artificial Intelligence (specifically Machine Learning) gives the computer a massive amount of data and lets it figure out the rules on its own.</strong></p>
        <p>To teach an AI to recognize a cat, a programmer doesn't write any rules about ears or whiskers. Instead, they feed the computer 10,000 pictures of cats and 10,000 pictures of dogs. The AI analyzes the pixels, finds the mathematical patterns that make a cat a cat, and "learns" the difference.</p>
        <ul>
          <li><strong>Traditional Code:</strong> "Here are the rules to solve the problem."</li>
          <li><strong>Artificial Intelligence:</strong> "Here are the answers. Figure out the rules yourself."</li>
        </ul>

        <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', marginTop: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>📝 Day 1 Activity: The "Rule-Breaker" Challenge</h3>
          <p>Try to act like a traditional programmer. Your task is to write a strict, rules-based definition for a <strong>"Chair"</strong>.</p>
          <ol>
            <li>Write down 3 strict rules that define what a chair is. (e.g., <em>It must have 4 legs.</em>)</li>
            <li>Once you have your rules, try to break them! Think of an object that is definitely a chair, but violates your rules (like a bean bag chair, or a hanging egg chair).</li>
            <li>Think of an object that fits all of your rules, but is <em>not</em> a chair (like a small table, or a dog).</li>
            <li><strong>Reflection:</strong> Write 2-3 sentences explaining why it would be nearly impossible to write traditional code to identify a chair, and why giving an AI 10,000 pictures of chairs is a better approach.</li>
          </ol>
        </div>
      </section>

      <section>
        <h2 style={{ color: 'var(--accent-secondary)' }}>Day 2: Real-World Business Applications</h2>
        <p>Because AI is so good at finding patterns in massive amounts of data—far better and faster than a human brain can—it is completely transforming the business world.</p>
        
        <h3>Case Study 1: Healthcare & Diagnostic Imaging</h3>
        <p>Radiologists are doctors who look at X-rays and MRI scans to find diseases like cancer. This is a tough job because early-stage cancer might just look like a tiny, blurry cluster of pixels on a screen.</p>
        <p><strong>How AI is changing it:</strong> Hospitals are now using AI vision models that have been trained on millions of historical X-rays. Because the AI has "seen" more lungs than a human doctor could see in 1,000 lifetimes, it can instantly highlight suspicious patterns on a scan, catching diseases months earlier than human doctors might.</p>
        
        <h3>Case Study 2: Autonomous Vehicles (Self-Driving Cars)</h3>
        <p>Companies like Tesla and Waymo are putting self-driving cars on the road. Why couldn't we do this with traditional code in the 1990s? Because driving is too complex. A programmer cannot possibly write an <em>IF/THEN</em> rule for every single scenario (e.g., <em>IF a kid kicks a red bouncy ball into the street on a rainy Tuesday, THEN hit the brakes</em>).</p>
        <p><strong>How AI is changing it:</strong> Cars are equipped with cameras and sensors that feed data into a neural network. The AI has been trained on millions of hours of driving footage. It recognizes the "pattern" of a pedestrian or a red light in real-time and makes split-second decisions based on its training.</p>

        <div style={{ background: 'var(--bg-glass)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-light)', marginTop: '2rem' }}>
          <h3 style={{ marginTop: 0 }}>📝 Day 2 Activity: The Startup Pitch</h3>
          <p>You are an entrepreneur founding a brand-new AI startup. Your goal is to use AI (pattern recognition, learning from data) to solve a major problem in a specific industry.</p>
          <ol>
            <li><strong>Pick an industry:</strong> Agriculture/Farming, Retail, Professional Sports, or Music.</li>
            <li><strong>Identify a problem:</strong> What is something difficult, expensive, or inefficient in that industry?</li>
            <li><strong>The AI Solution:</strong> Write a 1-paragraph pitch for your new AI product. 
              <ul>
                <li><em>What data will your AI learn from?</em></li>
                <li><em>What patterns is it looking for?</em></li>
                <li><em>How does it solve the problem better than a human or traditional computer program could?</em></li>
              </ul>
            </li>
          </ol>
        </div>
      </section>
    </div>
  );
}
