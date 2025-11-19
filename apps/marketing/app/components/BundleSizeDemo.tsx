'use client'

import { Download, Package, TrendingDown, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

export function BundleSizeDemo() {
  const [nextmqSize, _setNextmqSize] = useState({ raw: 60, gzip: 20 })
  const [handlerSizes, setHandlerSizes] = useState<Array<{ name: string; raw: number; gzip: number }>>([])

  useEffect(() => {
    // Realistic handler sizes - showing a typical app with multiple handlers
    setHandlerSizes([
      { name: 'cart.add handler', raw: 2.5, gzip: 1.2 },
      { name: 'cart.remove handler', raw: 1.8, gzip: 0.9 },
      { name: 'portal.dialog handler', raw: 12.5, gzip: 4.8 },
      { name: 'portal.modal handler', raw: 8.3, gzip: 3.2 },
      { name: 'analytics.track handler', raw: 3.2, gzip: 1.5 },
      { name: 'analytics.pageview handler', raw: 2.1, gzip: 1.0 },
      { name: 'notification.toast handler', raw: 5.4, gzip: 2.3 },
      { name: 'user.profile handler', raw: 7.8, gzip: 3.1 },
      { name: 'checkout.process handler', raw: 15.2, gzip: 6.2 },
      { name: 'search.autocomplete handler', raw: 9.6, gzip: 4.1 },
    ])
  }, [])

  const totalHandlerSize = handlerSizes.reduce((sum, h) => sum + h.gzip, 0)
  // Traditional approach: all handlers loaded upfront
  const traditionalApproach = totalHandlerSize
  // With NextMQ: core + handlers loaded on-demand (0KB initial for handlers)
  const withNextmqInitial = nextmqSize.gzip
  const savings = traditionalApproach - withNextmqInitial

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-50 dark:bg-red-950/30 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Traditional Approach</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">All handlers upfront</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Initial Bundle</span>
              <span className="font-mono font-semibold text-xl text-red-600 dark:text-red-400">~{traditionalApproach.toFixed(1)} KB</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500 space-y-1 max-h-48 overflow-y-auto">
              {handlerSizes.map((h) => (
                <div key={h.name} className="flex justify-between">
                  <span className="truncate mr-2">{h.name}</span>
                  <span className="flex-shrink-0">{h.gzip.toFixed(1)} KB</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
              <p className="text-xs text-red-600 dark:text-red-400 font-medium">⚠️ All {handlerSizes.length} handlers loaded upfront, even if never used</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-xl border-2 border-green-500 dark:border-green-600 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">SAVES {savings.toFixed(0)} KB</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-green-50 dark:bg-green-950/30 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">With NextMQ</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Dynamic loading</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Initial Bundle</span>
              <span className="font-mono font-semibold text-xl text-green-600 dark:text-green-400">~{withNextmqInitial.toFixed(1)} KB</span>
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-500">
              <div className="flex justify-between mb-1">
                <span>NextMQ core (one-time)</span>
                <span className="font-semibold">{nextmqSize.gzip.toFixed(1)} KB</span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-800 mt-2">
                <p className="text-green-600 dark:text-green-400 font-semibold mb-1">✓ Handlers: 0 KB initial</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Loaded on-demand when needed</p>
              </div>
            </div>
            <div className="pt-2 border-t border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 rounded p-2">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-600 dark:text-green-400" />
                <p className="text-xs text-green-700 dark:text-green-300 font-semibold">{((savings / traditionalApproach) * 100).toFixed(0)}% smaller initial bundle</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-xl p-6 border border-green-200 dark:border-green-900">
        <div className="flex items-start gap-4">
          <Download className="w-6 h-6 text-green-600 dark:text-green-400 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-semibold mb-3 text-lg">Why This Matters</h4>
            <div className="space-y-3 text-sm">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-green-200 dark:border-green-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Total Handler Size</span>
                  <span className="font-mono font-semibold text-green-600 dark:text-green-400">{totalHandlerSize.toFixed(1)} KB</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{handlerSizes.length} handlers that would normally load upfront</p>
              </div>
              <div className="bg-white dark:bg-gray-900 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-700 dark:text-gray-300 font-medium">NextMQ Core (gzipped)</span>
                  <span className="font-mono font-semibold">~{nextmqSize.gzip} KB</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">One-time cost, enables dynamic loading</p>
              </div>
              <div className="pt-2 border-t border-green-200 dark:border-green-800">
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">💡 Key Insight:</p>
                <p className="text-gray-600 dark:text-gray-400">
                  With NextMQ, you pay <strong>~{nextmqSize.gzip} KB</strong> once, but save <strong>{totalHandlerSize.toFixed(1)} KB</strong> on initial load. As you add more handlers, the savings grow even larger. Handlers are loaded <strong>only when needed</strong>, not upfront.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
