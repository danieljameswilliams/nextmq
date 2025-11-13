import type { Job } from 'nextmq';
import type { ReactElement } from 'react';

function Notification({ message }: { message: string }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        backgroundColor: '#10b981',
        color: 'white',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 9999,
        maxWidth: '400px',
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>✓ Notification</div>
      <div style={{ fontSize: '0.875rem' }}>{message}</div>
    </div>
  );
}

export default async function demoNotificationHandler(
  job: Job<{ message: string }>,
): Promise<ReactElement> {
  // Simulate some async work
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  return <Notification message={job.payload.message} />;
}

