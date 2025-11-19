'use client'

import { ArrowRight, CheckCircle2, Clock, Database, Radio, Zap } from 'lucide-react'
import { useEffect, useState } from 'react'

type FlowStep = {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: 'pending' | 'active' | 'completed'
  timing: string
}

export function ArchitectureFlow() {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps: FlowStep[] = [
    {
      id: '1',
      title: 'Page Loads',
      description: 'EventBridge mounts immediately (~1KB)',
      icon: <Radio className="w-5 h-5" />,
      status: 'completed',
      timing: '0ms',
    },
    {
      id: '2',
      title: 'EventBridge Listens',
      description: 'Listening for CustomEvents on window',
      icon: <Radio className="w-5 h-5" />,
      status: 'completed',
      timing: '0ms',
    },
    {
      id: '3',
      title: 'Events Arrive',
      description: 'Events buffered while processor loads',
      icon: <Database className="w-5 h-5" />,
      status: 'active',
      timing: '50ms',
    },
    {
      id: '4',
      title: 'Provider Loads',
      description: 'NextMQ processor dynamically loaded',
      icon: <Zap className="w-5 h-5" />,
      status: 'pending',
      timing: '200ms',
    },
    {
      id: '5',
      title: 'Buffer → Queue',
      description: 'Buffered events moved to queue',
      icon: <ArrowRight className="w-5 h-5" />,
      status: 'pending',
      timing: '250ms',
    },
    {
      id: '6',
      title: 'Check Requirements',
      description: 'Jobs gated until requirements met',
      icon: <CheckCircle2 className="w-5 h-5" />,
      status: 'pending',
      timing: '300ms',
    },
    {
      id: '7',
      title: 'Execute Handler',
      description: 'Handler loaded and executed',
      icon: <Zap className="w-5 h-5" />,
      status: 'pending',
      timing: '400ms',
    },
  ]

  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, 800)

    return () => clearInterval(interval)
  }, [isPlaying])

  const reset = () => {
    setCurrentStep(0)
    setIsPlaying(false)
  }

  const play = () => {
    reset()
    setTimeout(() => setIsPlaying(true), 100)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-4">Architecture Flow Visualization</h3>
        <div className="flex items-center justify-center gap-2">
          <button type="button" onClick={play} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            {isPlaying ? 'Playing...' : '▶️ Play Animation'}
          </button>
          <button type="button" onClick={reset} className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm font-medium transition-colors">
            Reset
          </button>
        </div>
      </div>

      <div className="relative">
        {/* Timeline */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />

        {/* Steps */}
        <div className="space-y-8">
          {steps.map((step, index) => {
            const isActive = index <= currentStep
            const isCurrent = index === currentStep
            const status = isActive ? (isCurrent ? 'active' : 'completed') : 'pending'

            return (
              <div key={step.id} className="relative flex items-start gap-6">
                {/* Icon */}
                <div
                  className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all ${status === 'completed'
                      ? 'bg-green-100 dark:bg-green-950/30 border-green-500 dark:border-green-600 text-green-600 dark:text-green-400'
                      : status === 'active'
                        ? 'bg-blue-100 dark:bg-blue-950/30 border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-400 animate-pulse'
                        : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600'
                    }`}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <div className="flex-1 pt-2">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-semibold text-lg">{step.title}</h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">{step.timing}</span>
                    {status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                    {status === 'active' && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">{step.description}</p>

                  {/* Special visualizations */}
                  {step.id === '1' && status !== 'pending' && (
                    <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                      <p className="text-xs text-blue-800 dark:text-blue-200 font-mono">&lt;NextMQRootClientEventBridge /&gt; (~1KB)</p>
                    </div>
                  )}

                  {step.id === '3' && status !== 'pending' && (
                    <div className="mt-3 space-y-2">
                      <div className="p-2 bg-purple-50 dark:bg-purple-950/30 rounded border border-purple-200 dark:border-purple-900">
                        <p className="text-xs text-purple-800 dark:text-purple-200">Event Buffer: {isActive ? '2 events buffered' : 'Waiting...'}</p>
                      </div>
                      {isActive && (
                        <div className="flex gap-2">
                          <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 rounded text-xs font-mono">cart.add</div>
                          <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 rounded text-xs font-mono">analytics.track</div>
                        </div>
                      )}
                    </div>
                  )}

                  {step.id === '4' && status !== 'pending' && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                      <p className="text-xs text-green-800 dark:text-green-200">Processor loaded: Dynamic import completes</p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1 font-mono">await import('./handlers/cartAdd')</p>
                    </div>
                  )}

                  {step.id === '5' && status !== 'pending' && (
                    <div className="mt-3 flex items-center gap-2">
                      <div className="px-3 py-2 bg-purple-50 dark:bg-purple-950/30 rounded border border-purple-200 dark:border-purple-900">
                        <span className="text-xs text-purple-800 dark:text-purple-200">Buffer</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                      <div className="px-3 py-2 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200 dark:border-blue-900">
                        <span className="text-xs text-blue-800 dark:text-blue-200">Queue</span>
                      </div>
                    </div>
                  )}

                  {step.id === '6' && status !== 'pending' && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/50 rounded text-xs">⏳ Waiting: cookieConsent</div>
                        <ArrowRight className="w-3 h-3 text-gray-400" />
                        <div className="px-2 py-1 bg-green-100 dark:bg-green-900/50 rounded text-xs">✓ Ready: cart.add</div>
                      </div>
                    </div>
                  )}

                  {step.id === '7' && status !== 'pending' && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                      <p className="text-xs text-green-800 dark:text-green-200">Handler chunk loaded dynamically</p>
                      <p className="text-xs text-green-700 dark:text-green-300 mt-1 font-mono">_next/static/chunks/handlers_cartAdd-[hash].js</p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-6 border border-blue-200 dark:border-blue-900">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Key Insights
        </h4>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>
              <strong>EventBridge loads first</strong> (~1KB) - tiny initial footprint, ready immediately
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>
              <strong>Events are buffered</strong> if dispatched before processor is ready - nothing is lost
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>
              <strong>Processor loads dynamically</strong> - only when needed, code-split automatically
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>
              <strong>Requirements gate execution</strong> - jobs wait until conditions are met
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
            <span>
              <strong>Handlers load on-demand</strong> - each handler is its own chunk, loaded when job executes
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}
