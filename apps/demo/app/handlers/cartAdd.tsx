// app/handlers/cartAdd.tsx
// Code-split handler for cart.add jobs - only loads when needed
// This handler can return JSX components that will be rendered automatically
// All imports (including React components) will be bundled together
import type { Job } from 'nextmq';
import type { ReactElement } from 'react';

// Example: A component that's only loaded when cart.add is processed
// This will be bundled together with the handler
function CartAddedNotification({ ean, quantity }: { ean: string; quantity: number }) {
    return (
        <div
            style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '1rem',
                backgroundColor: '#4CAF50',
                color: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                zIndex: 9999,
                transform: 'translateX(0)',
                opacity: 1,
                transition: 'all 0.3s ease-out',
            }}
        >
            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
                Added to Cart!
            </div>
            <div style={{ fontSize: '0.875rem' }}>
                EAN: {ean} × {quantity}
            </div>
        </div>
    );
}

export default async function cartAddHandler(
    job: Job<{ ean: string; quantity: number }>,
): Promise<ReactElement> {
    console.log('[cart.add] Processing job:', job);

    // Simulate API call or cart operation
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Handler can do whatever it needs:
    // - Make API calls
    // - Update global state
    // - Dispatch custom events
    // - Return JSX to render

    // Example: Dispatch a generic event that any component can listen to
    window.dispatchEvent(
        new CustomEvent('cart:added', {
            detail: {
                ean: job.payload.ean,
                quantity: job.payload.quantity,
            },
        }),
    );

    console.log('[cart.add] Added to cart:', job.payload);

    // Return JSX component - this will be automatically rendered
    // All code in this handler (including CartAddedNotification) will be
    // bundled together in one chunk, only loaded when cart.add is processed
    return <CartAddedNotification ean={job.payload.ean} quantity={job.payload.quantity} />;
}

