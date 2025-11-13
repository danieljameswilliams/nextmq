import type { Job } from 'nextmq';
import type { ReactElement } from 'react';

// Simulate adding to cart with a delay
export default async function cartAddHandler(
  job: Job<{ ean: string; quantity: number }>,
): Promise<ReactElement | void> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Simulate success (in real app, this would call your API)
  console.log('[Cart] Added to cart:', job.payload);

  // Return JSX notification (optional)
  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem',
        backgroundColor: '#10b981',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 9999,
      }}
    >
      <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
        Added to Cart!
      </div>
      <div style={{ fontSize: '0.875rem' }}>
        Product: {job.payload.ean} × {job.payload.quantity}
      </div>
    </div>
  );
}

