// src/NextMQDevTools.tsx
/**
 * NextMQ DevTools - Development tool for debugging NextMQ jobs and events
 *
 * Displays:
 * - Event buffer state (events waiting for processor)
 * - Job queue state (jobs waiting to be processed)
 * - Requirement status for each job
 *
 * @example
 * ```tsx
 * import { NextMQDevTools } from 'nextmq';
 *
 * export default function Page() {
 *   return (
 *     <>
 *       <NextMQDevTools />
 *       <YourPageContent />
 *     </>
 *   );
 * }
 * ```
 */

'use client'

import { useContext, useEffect, useState } from 'react'
import { getEventBufferState } from './event-bridge'
import { NextmqContext } from './provider'
import { getRequirement } from './requirements'

/** Debug state structure for job queue */
type QueueDebugState = {
  queue: Array<{
    id: string
    type: string
    payload: unknown
    requirements?: string[]
    createdAt: number
    requirementsMet: boolean
    hasProcessor: boolean
  }>
  isProcessing: boolean
  processorReady: boolean
}

/**
 * NextMQ DevTools Component
 *
 * Provides a floating panel for debugging NextMQ jobs and events.
 * Only renders on the client to avoid hydration mismatches.
 */
export function NextMQDevTools() {
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const queue = useContext(NextmqContext)

  const [debugState, setDebugState] = useState<{
    eventBuffer: ReturnType<typeof getEventBufferState>
    queue: QueueDebugState | null
  }>({
    eventBuffer: getEventBufferState(),
    queue: null,
  })

  // Only render on client to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const updateDebugState = () => {
      setDebugState({
        eventBuffer: getEventBufferState(),
        queue: queue ? queue.getDebugState() : null,
      })
    }

    // Update immediately
    updateDebugState()

    // Update every 500ms when open
    const interval = setInterval(updateDebugState, 500)

    return () => clearInterval(interval)
  }, [isOpen, queue])

  // Don't render anything on server to avoid hydration mismatch
  if (!isMounted) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: '16px',
        right: '16px',
        zIndex: 9999,
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontSize: '12px',
      }}
    >
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '8px 12px',
          backgroundColor: '#0070f3',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}
      >
        NextMQ {isOpen ? '▼' : '▲'}
      </button>

      {/* DevTools Panel */}
      {isOpen && (
        <div
          style={{
            marginTop: '8px',
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            maxWidth: '400px',
            maxHeight: '600px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid #e5e7eb',
              backgroundColor: '#f9fafb',
              fontWeight: '600',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>NextMQ DevTools</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '18px',
                lineHeight: 1,
                padding: 0,
                width: '20px',
                height: '20px',
              }}
            >
              ×
            </button>
          </div>

          {/* Scrollable Content */}
          <div
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: '12px 16px',
            }}
          >
            {/* Event Buffer Section */}
            <div style={{ marginBottom: '20px' }}>
              <div
                style={{
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Event Buffer</span>
                <span
                  style={{
                    backgroundColor: debugState.eventBuffer.processorReady ? '#10b981' : '#f59e0b',
                    color: 'white',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '600',
                  }}
                >
                  {debugState.eventBuffer.processorReady ? 'READY' : 'WAITING'}
                </span>
              </div>
              {debugState.eventBuffer.bufferLength === 0 ? (
                <div
                  style={{
                    color: '#9ca3af',
                    fontStyle: 'italic',
                    padding: '8px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '4px',
                  }}
                >
                  No events in buffer
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {debugState.eventBuffer.buffer.map((event) => (
                    <div
                      key={`${event.type}-${event.timestamp}`}
                      style={{
                        padding: '8px',
                        backgroundColor: '#f9fafb',
                        borderRadius: '4px',
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>{event.type}</div>
                      <div style={{ fontSize: '11px', color: '#6b7280' }}>Requirements: {event.requirements?.length ? event.requirements.join(', ') : 'none'}</div>
                      <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>{new Date(event.timestamp).toLocaleTimeString()}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Queue Section */}
            <div>
              <div
                style={{
                  fontWeight: '600',
                  marginBottom: '8px',
                  color: '#374151',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <span>Job Queue</span>
                {debugState.queue && (
                  <span
                    style={{
                      backgroundColor: debugState.queue.isProcessing ? '#3b82f6' : '#6b7280',
                      color: 'white',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: '600',
                    }}
                  >
                    {debugState.queue.isProcessing ? 'PROCESSING' : 'IDLE'}
                  </span>
                )}
              </div>
              {!debugState.queue ? (
                <div
                  style={{
                    color: '#9ca3af',
                    fontStyle: 'italic',
                    padding: '8px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '4px',
                  }}
                >
                  Queue not initialized
                </div>
              ) : debugState.queue.queue.length === 0 ? (
                <div
                  style={{
                    color: '#9ca3af',
                    fontStyle: 'italic',
                    padding: '8px',
                    backgroundColor: '#f9fafb',
                    borderRadius: '4px',
                  }}
                >
                  No jobs in queue
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {debugState.queue.queue.map((job: QueueDebugState['queue'][0]) => (
                    <div
                      key={job.id}
                      style={{
                        padding: '8px',
                        backgroundColor: job.requirementsMet ? (job.hasProcessor ? '#ecfdf5' : '#fef3c7') : '#fee2e2',
                        borderRadius: '4px',
                        border: `1px solid ${job.requirementsMet ? (job.hasProcessor ? '#10b981' : '#f59e0b') : '#ef4444'}`,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: '600',
                          marginBottom: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>{job.type}</span>
                        {!job.requirementsMet && (
                          <span
                            style={{
                              backgroundColor: '#ef4444',
                              color: 'white',
                              padding: '1px 4px',
                              borderRadius: '3px',
                              fontSize: '9px',
                            }}
                          >
                            WAITING PERMISSIONS
                          </span>
                        )}
                        {job.requirementsMet && !job.hasProcessor && (
                          <span
                            style={{
                              backgroundColor: '#f59e0b',
                              color: 'white',
                              padding: '1px 4px',
                              borderRadius: '3px',
                              fontSize: '9px',
                            }}
                          >
                            PROCESSOR NOT READY
                          </span>
                        )}
                      </div>
                      {job.requirements && job.requirements.length > 0 && (
                        <div style={{ fontSize: '11px', color: '#6b7280', marginBottom: '4px' }}>
                          Requirements:{' '}
                          {job.requirements.map((req: string) => (
                            <span
                              key={req}
                              style={{
                                display: 'inline-block',
                                marginRight: '4px',
                                padding: '1px 4px',
                                backgroundColor: getRequirement(req) ? '#10b981' : '#ef4444',
                                color: 'white',
                                borderRadius: '3px',
                                fontSize: '9px',
                              }}
                            >
                              {req}: {getRequirement(req) ? '✓' : '✗'}
                            </span>
                          ))}
                        </div>
                      )}
                      <div style={{ fontSize: '10px', color: '#9ca3af', marginTop: '4px' }}>
                        ID: {job.id.slice(0, 8)}... | {new Date(job.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
