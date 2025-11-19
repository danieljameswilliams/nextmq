'use client'

import { NEXTMQ_EVENT_NAME, NextMQDevTools } from 'nextmq'

// Example requirement key - in real app this would come from requirements.ts
const _REQ = {
  cookieConsent: 'cookieConsent',
} as const

export default function Home() {
  const handleAddToCart = () => {
    const ean = '1234567890123' // Example EAN
    console.log('[page] Dispatching cart.add event:', ean)
    window.dispatchEvent(
      new CustomEvent(NEXTMQ_EVENT_NAME, {
        detail: {
          type: 'cart.add',
          payload: { ean, quantity: 1 },
          requirements: [],
        },
      })
    )
  }

  const handleRemoveFromCart = () => {
    const ean = '1234567890123' // Example EAN
    window.dispatchEvent(
      new CustomEvent(NEXTMQ_EVENT_NAME, {
        detail: {
          type: 'cart.remove',
          payload: { ean },
          requirements: [],
        },
      })
    )
  }

  return (
    <>
      <NextMQDevTools />
      <div style={{ padding: '2rem' }}>
        <h1>NextMQ Demo</h1>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="button"
            onClick={handleAddToCart}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={handleRemoveFromCart}
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              cursor: 'pointer',
              backgroundColor: '#ff4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
            }}
          >
            Remove from Cart
          </button>
        </div>
      </div>
    </>
  )
}
