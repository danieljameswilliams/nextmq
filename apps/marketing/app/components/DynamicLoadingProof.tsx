'use client'

import { BarChart, Bell, CheckCircle2, Code2, Layout, Monitor } from 'lucide-react'
import { NEXTMQ_EVENT_NAME } from 'nextmq'
import { useState } from 'react'
import { CodeBlock } from './CodeBlock'

export function DynamicLoadingProof() {
  const [triggeredHandlers, setTriggeredHandlers] = useState<Set<string>>(new Set())

  const dispatchJob = (type: string, payload: Record<string, unknown>) => {
    window.dispatchEvent(
      new CustomEvent(NEXTMQ_EVENT_NAME, {
        detail: { type, payload },
      })
    )
    setTriggeredHandlers((prev) => new Set(prev).add(type))
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Code2 className="w-5 h-5" />
          Live Demo: Dynamic Code Loading
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-6">Click the buttons below to dispatch jobs. Each handler is loaded dynamically when first used. Open DevTools → Network tab to see chunks loading in real-time.</p>

        <div className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => dispatchJob('demo.notification', { message: 'Handler loaded dynamically! Check Network tab.' })}
              className="flex flex-col items-center gap-2 p-4 bg-green-50 dark:bg-green-950/30 border-2 border-green-200 dark:border-green-900 rounded-lg hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors"
            >
              <Bell className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div className="text-center">
                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">Notification</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">demo.notification</div>
              </div>
              {triggeredHandlers.has('demo.notification') && <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />}
            </button>

            <button
              type="button"
              onClick={() => dispatchJob('demo.portal', { title: 'Portal Dialog', content: 'This dialog was lazy-loaded! The handler chunk was loaded on-demand.' })}
              className="flex flex-col items-center gap-2 p-4 bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-900 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
            >
              <Layout className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div className="text-center">
                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">Portal Dialog</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">demo.portal</div>
              </div>
              {triggeredHandlers.has('demo.portal') && <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
            </button>

            <button
              type="button"
              onClick={() => dispatchJob('demo.analytics', { event: 'demo_click', data: { source: 'marketing_page' } })}
              className="flex flex-col items-center gap-2 p-4 bg-purple-50 dark:bg-purple-950/30 border-2 border-purple-200 dark:border-purple-900 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-colors"
            >
              <BarChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <div className="text-center">
                <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">Analytics</div>
                <div className="text-xs text-gray-600 dark:text-gray-400">demo.analytics</div>
              </div>
              {triggeredHandlers.has('demo.analytics') && <CheckCircle2 className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
            </button>
          </div>

          {triggeredHandlers.size > 0 && (
            <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-green-900 dark:text-green-100 mb-1">
                    ✓ {triggeredHandlers.size} handler{triggeredHandlers.size > 1 ? 's' : ''} triggered
                  </p>
                  <p className="text-sm text-green-800 dark:text-green-200">Check the Network tab in DevTools to see the chunk files loading dynamically. Each handler is in its own separate chunk file.</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-2">
              <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm text-blue-900 dark:text-blue-100 font-semibold mb-2">How to Verify Dynamic Loading:</p>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm text-blue-800 dark:text-blue-200">
                  <li>Open browser DevTools → Network tab</li>
                  <li>Filter by "JS" to see JavaScript files</li>
                  <li>Clear the network log (optional)</li>
                  <li>Click a button above to dispatch a job</li>
                  <li>
                    Watch new chunk files appear (e.g., <code className="bg-blue-100 dark:bg-blue-900/50 px-1 rounded">handlers_demoNotification.js</code>)
                  </li>
                  <li>Each handler loads only once - subsequent clicks use the cached chunk</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">What's Happening Behind the Scenes:</p>
            <CodeBlock
              code={`// 1. You click a button, which dispatches:
window.dispatchEvent(
  new CustomEvent('nextmq', {
    detail: { type: 'demo.notification', payload: {...} }
  })
);

// 2. Processor routes to handler (dynamic import)
const handler = await import('./handlers/demoNotification');
// ↑ This triggers Next.js to load the chunk file

// 3. Handler chunk loads (visible in Network tab)
// File: _next/static/chunks/handlers_demoNotification-[hash].js

// 4. Handler executes and returns JSX (rendered automatically)
return handler.default(job);`}
              language="javascript"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <h3 className="text-xl font-semibold mb-4">Third-Party Script Integration</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">NextMQ can be called from anywhere, even external scripts and partner integrations. No React context needed - just dispatch a CustomEvent.</p>

        <CodeBlock
          code={`// Example: Third-party analytics script
// Uses your configured event name (default: 'nextmq')
(function() {
  // This script can trigger NextMQ handlers from anywhere
  window.dispatchEvent(
    new CustomEvent('nextmq', { // or your custom event name
      detail: {
        type: 'analytics.track',
        payload: {
          event: 'page_view',
          url: window.location.href
        }
      }
    })
  );
})();

// Example: Partner widget integration
// Partner's script can trigger your portal dialogs
// Works with any event name you configure
window.dispatchEvent(
  new CustomEvent('nextmq', { // matches your NextMQRootClientEventBridge config
    detail: {
      type: 'portal.show',
      payload: {
        title: 'Special Offer',
        content: 'Get 20% off today!'
      }
    }
  })
);`}
          language="javascript"
        />
      </div>
    </div>
  )
}
