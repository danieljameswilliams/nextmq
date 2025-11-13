import type { Job } from 'nextmq';
import type { ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { useState, useEffect } from 'react';

function PortalDialog({ title, content }: { title: string; content: string }) {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      // Auto-remove after animation
      setTimeout(() => {
        const element = document.querySelector('[data-portal-dialog]');
        if (element) {
          element.remove();
        }
      }, 200);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      data-portal-dialog
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={() => setIsOpen(false)}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '0.5rem',
          padding: '1.5rem',
          maxWidth: '500px',
          margin: '1rem',
          boxShadow: '0 20px 25px rgba(0, 0, 0, 0.15)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.5rem', color: '#111827' }}>{title}</h2>
        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>{content}</p>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer',
            fontWeight: '500',
          }}
        >
          Close
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default async function demoPortalHandler(
  job: Job<{ title: string; content: string }>,
): Promise<ReactElement> {
  // Simulate some async work
  await new Promise((resolve) => setTimeout(resolve, 100));
  
  return <PortalDialog title={job.payload.title} content={job.payload.content} />;
}

