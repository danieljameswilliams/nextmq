'use client';

import { useState, useEffect } from 'react';
import { Radio, Database, Zap, ArrowRight, CheckCircle2, Clock, Package, PlayCircle, RotateCcw } from 'lucide-react';

type Phase = {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'pending' | 'active' | 'completed';
  timing: string;
  details?: React.ReactNode;
};

export function EventFlowVisualization() {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [eventBufferCount, setEventBufferCount] = useState(0);
  const [queueCount, setQueueCount] = useState(0);
  const [executedCount, setExecutedCount] = useState(0);

  const phases: Phase[] = [
    {
      id: '1',
      title: 'Page Loads - Event Bridge Active',
      description: 'Tiny Event Bridge (~1KB) loads in first bytes, listening for events',
      icon: <Radio className="w-5 h-5" />,
      status: 'pending',
      timing: '0ms',
      details: (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
          <p className="text-xs text-blue-800 dark:text-blue-200 font-mono mb-1">
            &lt;NextMQRootClientEventBridge /&gt;
          </p>
          <p className="text-xs text-blue-700 dark:text-blue-300">
            ~1KB • Listening for 'nextmq' CustomEvents
          </p>
        </div>
      ),
    },
    {
      id: '2',
      title: 'Events Arrive Early',
      description: 'Events dispatched before processor is ready are buffered',
      icon: <Database className="w-5 h-5" />,
      status: 'active',
      timing: '50ms',
      details: (
        <div className="mt-3 space-y-2">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-900">
            <p className="text-xs font-semibold text-purple-900 dark:text-purple-100 mb-2">
              Event Buffer ({eventBufferCount} events)
            </p>
            {eventBufferCount > 0 && (
              <div className="space-y-1">
                <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 rounded text-xs font-mono">
                  cart.add
                </div>
                <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 rounded text-xs font-mono">
                  analytics.track
                </div>
              </div>
            )}
            <p className="text-xs text-purple-700 dark:text-purple-300 mt-2">
              Waiting for processor...
            </p>
          </div>
        </div>
      ),
    },
    {
      id: '3',
      title: 'Processor Loads Dynamically',
      description: 'NextMQ processor and listener code-split and load on-demand',
      icon: <Package className="w-5 h-5" />,
      status: 'pending',
      timing: '200ms',
      details: (
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
          <p className="text-xs text-green-800 dark:text-green-200 mb-1">
            &lt;NextMQClientProvider processor={'{processor}'} /&gt;
          </p>
          <p className="text-xs text-green-700 dark:text-green-300 font-mono">
            Dynamic import: processor chunk loads
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            Code-split • Only loads when needed
          </p>
        </div>
      ),
    },
    {
      id: '4',
      title: 'Buffer → Queue Transfer',
      description: 'Buffered events moved to queue when processor is ready',
      icon: <ArrowRight className="w-5 h-5" />,
      status: 'pending',
      timing: '250ms',
      details: (
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-900">
            <p className="text-xs font-semibold text-purple-900 dark:text-purple-100 mb-1">
              Event Buffer
            </p>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              {eventBufferCount} events → moving
            </p>
          </div>
          <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <div className="flex-1 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
            <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-1">
              Job Queue
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              {queueCount} jobs ready
            </p>
          </div>
        </div>
      ),
    },
    {
      id: '5',
      title: 'Requirements Check',
      description: 'Jobs gated until requirements are met',
      icon: <CheckCircle2 className="w-5 h-5" />,
      status: 'pending',
      timing: '300ms',
      details: (
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/50 rounded text-xs">
              ⏳ Waiting: necessaryConsent
            </div>
            <ArrowRight className="w-3 h-3 text-gray-400" />
            <div className="px-2 py-1 bg-green-100 dark:bg-green-900/50 rounded text-xs">
              ✓ Ready: cart.add
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            Only jobs with met requirements execute
          </p>
        </div>
      ),
    },
    {
      id: '6',
      title: 'Handler Executes',
      description: 'Handler loaded dynamically and executed',
      icon: <Zap className="w-5 h-5" />,
      status: 'pending',
      timing: '400ms',
      details: (
        <div className="mt-3 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
          <p className="text-xs text-green-800 dark:text-green-200 mb-1">
            Handler chunk loads dynamically
          </p>
          <p className="text-xs text-green-700 dark:text-green-300 font-mono">
            _next/static/chunks/handlers_cartAdd-[hash].js
          </p>
          <p className="text-xs text-green-600 dark:text-green-400 mt-1">
            {executedCount} job{executedCount !== 1 ? 's' : ''} executed
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentPhase((prev) => {
        if (prev >= phases.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        const next = prev + 1;

        // Update counts based on phase index
        if (next === 1) {
          // Phase 1: Events arrive - buffer them
          setEventBufferCount(2);
        } else if (next === 3) {
          // Phase 3: Buffer → Queue transfer
          setQueueCount(2);
          setEventBufferCount(0);
        } else if (next === 4) {
          // Phase 4: Requirements check - one job ready, one waiting
          // (queue still has 2, but we show one ready)
        } else if (next === 5) {
          // Phase 5: Handler executes - one job executed
          setExecutedCount(1);
          setQueueCount(1); // One job executed, one still waiting
        }

        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, phases.length]);

  const reset = () => {
    setCurrentPhase(0);
    setIsPlaying(false);
    setEventBufferCount(0);
    setQueueCount(0);
    setExecutedCount(0);
  };

  const play = () => {
    reset();
    setTimeout(() => setIsPlaying(true), 100);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold mb-4">First Bytes Flow</h3>
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={play}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <PlayCircle className="w-4 h-4" />
            {isPlaying ? 'Playing...' : 'Play Animation'}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg text-sm font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative max-w-3xl w-full">
          {/* Timeline */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-800" />

          {/* Phases */}
          <div className="space-y-8">
            {phases.map((phase, index) => {
              const isActive = index <= currentPhase;
              const isCurrent = index === currentPhase;
              const status = isActive ? (isCurrent ? 'active' : 'completed') : 'pending';

              return (
                <div key={phase.id} className="relative flex items-start gap-6">
                  {/* Icon */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all shrink-0 ${status === 'completed'
                      ? 'bg-green-100 dark:bg-green-950/30 border-green-500 dark:border-green-600 text-green-600 dark:text-green-400'
                      : status === 'active'
                        ? 'bg-blue-100 dark:bg-blue-950/30 border-blue-500 dark:border-blue-600 text-blue-600 dark:text-blue-400 animate-pulse'
                        : 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-400 dark:text-gray-600'
                      }`}
                  >
                    {phase.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h4 className="font-semibold text-lg">{phase.title}</h4>
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded">
                        {phase.timing}
                      </span>
                      {status === 'completed' && (
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                      )}
                      {status === 'active' && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-2">{phase.description}</p>
                    {phase.details && phase.status !== 'pending' && phase.details}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-xl p-6 border border-blue-200 dark:border-blue-900">
        <h4 className="font-semibold mb-4 flex items-center gap-2 text-lg">
          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Key Benefits
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h5 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              ⚡ First Bytes Optimization
            </h5>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Event Bridge is only ~1KB and loads immediately. It starts listening for events right away, ensuring no events are lost.
            </p>
          </div>
          <div className="space-y-2">
            <h5 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              📦 Smart Buffering
            </h5>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Events dispatched before the processor loads are automatically buffered and moved to the queue when ready.
            </p>
          </div>
          <div className="space-y-2">
            <h5 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              🚀 Dynamic Loading
            </h5>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Processor and handlers load on-demand via code-splitting. Only what you need, when you need it.
            </p>
          </div>
          <div className="space-y-2">
            <h5 className="font-semibold text-sm text-gray-900 dark:text-gray-100">
              ✅ Requirements Gating
            </h5>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Jobs wait until their requirements are met. Perfect for consent, authentication, or feature flags.
            </p>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="bg-gray-950 rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h4 className="font-semibold text-gray-100">How It Works in Code</h4>
        </div>
        <div className="p-6">
          <div className="space-y-4 text-sm font-mono text-gray-300">
            <div>
              <p className="text-gray-500 mb-1">{'// 1. Event Bridge loads first (~1KB)'}</p>
              <p className="text-green-400">&lt;NextMQRootClientEventBridge /&gt;</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">{'// 2. Events arrive early - buffered automatically'}</p>
              <p className="text-blue-400">window.dispatchEvent(new CustomEvent('nextmq', ...))</p>
              <p className="text-xs text-gray-500 mt-1">{'// (or your custom event name)'}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">{'// 3. Processor loads dynamically (code-split)'}</p>
              <p className="text-green-400">&lt;NextMQClientProvider processor={'{processor}'} /&gt;</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">{'// 4. Buffered events → Queue (automatic)'}</p>
              <p className="text-purple-400">setProcessEventCallback() processes buffer</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">{'// 5. Requirements checked, handlers load on-demand'}</p>
              <p className="text-yellow-400">await import('./handlers/cartAdd')</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

