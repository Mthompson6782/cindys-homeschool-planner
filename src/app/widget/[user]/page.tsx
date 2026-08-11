import React from 'react';
import DailyWidget from '@/components/DailyWidget';

export default async function WidgetPage({ params }: { params: Promise<{ user: string }> }) {
  const resolvedParams = await params;
  
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      padding: '1rem'
    }}>
      <DailyWidget forcedUser={resolvedParams.user} />
    </div>
  );
}
