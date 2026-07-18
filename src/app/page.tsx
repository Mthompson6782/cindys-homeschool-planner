import Calendar from "@/components/Calendar";

export default function Home() {
  return (
    <div className="animate-fade-in">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Welcome to Cindy's Home School Planner. Select a day to view or edit assignments.</p>
      </div>
      <Calendar />
    </div>
  );
}
