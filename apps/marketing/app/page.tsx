import { ArrowRight, BarChart3, BookOpen, Bug, CheckCircle2, Code2, Github, Package, Wrench, Zap } from 'lucide-react'
import Link from 'next/link'
import { CodeBlock } from './components/CodeBlock'
import { DevToolsActivator } from './components/DevToolsActivator'
import { DynamicLoadingProof } from './components/DynamicLoadingProof'
import { EventFlowVisualization } from './components/EventFlowVisualization'
import { JobStatusDemo } from './components/JobStatusDemo'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">NextMQ</span>
            </div>
            <div className="flex items-center gap-6">
              <Link href="#how-it-works" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                How it works
              </Link>
              <Link href="#features" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                Features
              </Link>
              <Link href="#simply-dispatchevent" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                dispatchEvent
              </Link>
              <Link href="#docs" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                Docs
              </Link>
              <Link href="https://github.com/danieljameswilliams/nextmq" className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors flex items-center gap-1">
                <Github className="w-4 h-4" />
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 mb-8">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-400">Built for Next.js 16+</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-300 dark:to-white bg-clip-text text-transparent">Message Queue</span>
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">for Next.js</span>
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
            A tiny queue + actions runtime for Next.js. <span className="font-semibold text-gray-900 dark:text-gray-100">Simply dispatchEvent</span> with CustomEvent. Small initial load (~1KB), requirements system, job deduplication, and status hooks.
          </p>
          <div className="inline-flex items-center gap-4 px-6 py-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-lg border-2 border-green-200 dark:border-green-900 mb-8 shadow-lg">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400">~1 KB</div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">initial load</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Event Bridge only</div>
            </div>
            <div className="h-12 w-px bg-gray-300 dark:bg-gray-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">~20 KB</div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">total size</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">When fully loaded</div>
            </div>
            <div className="h-12 w-px bg-gray-300 dark:bg-gray-700"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">0 KB</div>
              <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">handlers initial</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                Load <span className="font-semibold">on-demand</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#install" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40">
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="#docs" className="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              View Docs
            </Link>
          </div>
        </div>
      </section>

      {/* TL;DR Quick Navigation */}
      <section className="sticky top-16 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <BookOpen className="w-4 h-4" />
              Quick Navigation:
            </div>
            <nav className="flex items-center gap-2 flex-wrap">
              <QuickNavLink href="#job-status" icon={<BarChart3 className="w-3.5 h-3.5" />}>
                Status Hooks
              </QuickNavLink>
              <QuickNavLink href="#requirements" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                Requirements
              </QuickNavLink>
              <QuickNavLink href="#deduplication" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                Deduplication
              </QuickNavLink>
              <QuickNavLink href="#delay" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                Debouncing
              </QuickNavLink>
              <QuickNavLink href="#install" icon={<Package className="w-3.5 h-3.5" />}>
                Install
              </QuickNavLink>
              <QuickNavLink href="#docs" icon={<Code2 className="w-3.5 h-3.5" />}>
                Quick Start
              </QuickNavLink>
              <QuickNavLink href="#devtools" icon={<Wrench className="w-3.5 h-3.5" />}>
                DevTools
              </QuickNavLink>
            </nav>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why NextMQ?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Built specifically for Next.js with simplicity and developer experience in mind</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard icon={<Zap className="w-6 h-6" />} title="Simply dispatchEvent" description="Just use window.dispatchEvent() with CustomEvent. No complex APIs, no abstractions. The web platform you already know." highlight={true} />
          <FeatureCard icon={<Package className="w-6 h-6" />} title="Small Initial Load" description="Only ~1KB initial load. Event Bridge loads first, processor and handlers load dynamically on-demand." highlight={true} />
          <FeatureCard icon={<CheckCircle2 className="w-6 h-6" />} title="Requirements System" description="Gate jobs until requirements are met. Perfect for user consent, authentication, or feature flags." highlight={true} />
          <FeatureCard icon={<CheckCircle2 className="w-6 h-6" />} title="Job Deduplication" description="Prevent duplicate jobs with dedupeKey. Perfect for analytics, tracking, and one-time actions." highlight={true} />
          <FeatureCard icon={<BarChart3 className="w-6 h-6" />} title="Status Hooks" description="Track job status in real-time with useJobStatus hook. Perfect for updating UI based on job state." highlight={true} />
          <FeatureCard icon={<CheckCircle2 className="w-6 h-6" />} title="Debouncing Built-In" description="Delay + Deduplication = automatic debouncing! Replace previous jobs and wait for inactivity. Perfect for search inputs and analytics." highlight={true} />
          <FeatureCard icon={<Code2 className="w-6 h-6" />} title="Code Splitting" description="Handlers are automatically code-split. Only load what you need, when you need it." />
        </div>
      </section>

      {/* Simply dispatchEvent - Prominent Section */}
      <section id="simply-dispatchevent" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Simply dispatchEvent</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">No complex APIs. No abstractions. Just the standard web platform you already know.</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-lg">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  Standard CustomEvent API
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  NextMQ uses the native <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">CustomEvent</code> API. No learning curve, no vendor lock-in. Just standard web APIs. The event name is configurable - use the default{' '}
                  <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">'nextmq'</code> or choose your own.
                </p>
                <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                  <CodeBlock
                    code={`import { NEXTMQ_EVENT_NAME } from 'nextmq';

// Option 1: Use the default event name (convenience constant)
window.dispatchEvent(
  new CustomEvent(NEXTMQ_EVENT_NAME, {
    detail: {
      type: 'cart.add',
      payload: { ean: '123', quantity: 1 }
    }
  })
);

// Option 2: Use any custom event name you want
// Just configure it in NextMQRootClientEventBridge:
<NextMQRootClientEventBridge eventName="myApp" />

// Then dispatch with the same name:
window.dispatchEvent(
  new CustomEvent('myApp', {
    detail: { type: 'cart.add', payload: { ean: '123' } }
  })
);

// Use any event name: 'nextmq', 'myApp', 'helloMcNerd', 
// 'app:jobs', 'shop:actions', 'analytics:track', or your own!

// Works from anywhere:
// - React components
// - Vanilla JavaScript
// - Third-party scripts
// - Browser extensions
// - Any code that can access window`}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    No Learning Curve
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">Uses standard CustomEvent API you already know. No new concepts to learn.</p>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Works Everywhere
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-200">Dispatch from React, vanilla JS, third-party scripts, or browser extensions.</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Configurable Event Name
                  </h4>
                  <p className="text-sm text-purple-800 dark:text-purple-200">Use default 'nextmq' or choose your own. Perfect for multiple instances or avoiding conflicts.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-lg p-6 border border-purple-200 dark:border-purple-900">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  Why Custom Event Names?
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-300">
                  <div>
                    <p className="font-semibold mb-2 text-purple-900 dark:text-purple-100">Multiple Instances</p>
                    <p className="text-purple-800 dark:text-purple-200">Run multiple NextMQ instances in the same app with different event names. Perfect for micro-frontends or modular architectures.</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Avoid Conflicts</p>
                    <p className="text-blue-800 dark:text-blue-200">Prevent conflicts with other libraries or third-party scripts that might use similar event names. Namespace your events.</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2 text-purple-900 dark:text-purple-100">Integration</p>
                    <p className="text-purple-800 dark:text-purple-200">Integrate with existing systems that have their own event naming conventions. Use their names directly.</p>
                  </div>
                  <div>
                    <p className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Testing & Isolation</p>
                    <p className="text-blue-800 dark:text-blue-200">Isolate event streams for testing, mocking, or staging environments. Each environment can use different event names.</p>
                  </div>
                </div>
                <div className="mt-4 bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                  <CodeBlock
                    code={`// Example: Multiple NextMQ instances with different event names

// Main app events
<NextMQRootClientEventBridge eventName="app:invoke" />
<NextMQClientProvider processor={mainProcessor} />

// Admin panel events (separate instance)
<NextMQRootClientEventBridge eventName="admin:invoke" />
<NextMQClientProvider processor={adminProcessor} />

// Analytics events (separate instance)
<NextMQRootClientEventBridge eventName="analytics:invoke" />
<NextMQClientProvider processor={analyticsProcessor} />

// Each instance listens to its own event name
// No conflicts, complete isolation!`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Small Initial Load - Prominent Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Small Initial Load</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Only ~1KB initial load. Everything else loads dynamically when needed.</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-lg">
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="p-6 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">~1 KB</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Initial Load</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">Event Bridge only</div>
                </div>
                <div className="p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">~20 KB</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Total Size</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">When fully loaded</div>
                </div>
                <div className="p-6 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-900">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">0 KB</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Handlers Initial</div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">Load on-demand</div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/30 dark:to-blue-950/30 rounded-lg p-6 border border-green-200 dark:border-green-900">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600 dark:text-green-400" />
                  How It Works
                </h4>
                <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">1.</span>
                    <span>
                      <strong>Event Bridge (~1KB)</strong> loads immediately and starts listening for events
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">2.</span>
                    <span>
                      <strong>Processor (~19KB)</strong> loads dynamically when NextMQClientProvider mounts
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 mt-1">3.</span>
                    <span>
                      <strong>Handlers (0KB initial)</strong> load on-demand when their job type is dispatched
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                <CodeBlock
                  code={`// 1. Event Bridge loads first (~1KB)
<NextMQRootClientEventBridge />
// ✅ Listening for events immediately

// 2. Processor loads dynamically (~19KB)
<NextMQClientProvider processor={processor} />
// ✅ Code-split, loads when provider mounts

// 3. Handlers load on-demand (0KB initial)
// Only when job type is dispatched
await import('./handlers/cartAdd');
// ✅ Perfect for code splitting`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Requirements System - Prominent Section */}
      <section id="requirements" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gray-50 dark:bg-gray-900/50 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Requirements System</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Gate jobs until requirements are met. Perfect for user consent, authentication, or feature flags.</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-lg">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  Gate Jobs Until Ready
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Jobs with unmet requirements wait in the queue. Once requirements are met, they automatically process.</p>
                <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                  <CodeBlock
                    code={`import { setRequirement } from 'nextmq';

// Dispatch a job with requirements
window.dispatchEvent(
  new CustomEvent('nextmq', {
    detail: {
      type: 'analytics.track',
      payload: { event: 'page_view' },
      requirements: ['necessaryConsent'] // ⏳ Job waits here
    }
  })
);

// Later, when user gives consent
setRequirement('necessaryConsent', true);
// ✅ Job automatically processes!`}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Use Cases
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• User consent (GDPR, CCPA)</li>
                    <li>• Authentication status</li>
                    <li>• Feature flags</li>
                    <li>• API readiness</li>
                    <li>• Any conditional logic</li>
                  </ul>
                </div>
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Benefits
                  </h4>
                  <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    <li>• No lost events</li>
                    <li>• Automatic processing</li>
                    <li>• Type-safe requirements</li>
                    <li>• Multiple requirements per job</li>
                    <li>• Works with deduplication</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Delay - Prominent Section */}
      <section id="delay" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-br from-orange-50 via-yellow-50 to-amber-50 dark:from-orange-950/30 dark:via-yellow-950/30 dark:to-amber-950/30 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Debouncing: Delay + Deduplication</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Combine delay with deduplication to get automatic debouncing. The same <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">dedupeKey</code>
            provides both behaviors: replaces queued jobs (debouncing) and skips completed jobs (deduplication).
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-lg">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  Debouncing Built-In: Delay + Deduplication
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Combine <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">delay</code> with <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">dedupeKey</code> to get automatic debouncing! Here's how it works:
                </p>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    How dedupeKey Works
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="font-bold">If already queued:</span>
                      <span>
                        New job <strong>replaces</strong> the previous one (debouncing) - resets the delay timer
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="font-bold">If already completed:</span>
                      <span>
                        New job is <strong>skipped</strong> (deduplication) - prevents duplicate execution
                      </span>
                    </li>
                  </ul>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mt-3">
                    The same <code className="bg-blue-100 dark:bg-blue-900/50 px-1.5 py-0.5 rounded">dedupeKey</code> provides both behaviors automatically!
                  </p>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Perfect for search inputs, analytics tracking, and any scenario where you want to wait for inactivity.</p>
                <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                  <CodeBlock
                    code={`// True debouncing: delay + dedupeKey
// Multiple rapid calls → only the last one executes after delay
window.dispatchEvent(
  new CustomEvent('nextmq', {
    detail: {
      type: 'analytics.track',
      payload: { event: 'search', query: 'nextjs' },
      dedupeKey: 'search-analytics', // Same key = debounce
      delay: 500 // ⏳ Wait 500ms after last call
    }
  })
);

// Schedule notification for 2 seconds later (no dedupeKey = no debounce)
window.dispatchEvent(
  new CustomEvent('nextmq', {
    detail: {
      type: 'notification.show',
      payload: { message: 'Welcome!' },
      delay: 2000 // ⏳ Wait 2 seconds before processing
    }
  })
);`}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900 rounded-lg p-4">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Use Cases
                  </h4>
                  <ul className="text-sm text-orange-800 dark:text-orange-200 space-y-1">
                    <li>• Debouncing user input</li>
                    <li>• Rate limiting API calls</li>
                    <li>• Scheduled notifications</li>
                    <li>• Delayed animations</li>
                    <li>• Staggered batch processing</li>
                  </ul>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900 rounded-lg p-4">
                  <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    How It Works
                  </h4>
                  <ul className="text-sm text-yellow-800 dark:text-yellow-200 space-y-1">
                    <li>• Delay is calculated from job creation time</li>
                    <li>• Jobs wait in queue until delay elapses</li>
                    <li>• With dedupeKey: replaces previous job (debouncing)</li>
                    <li>• Works seamlessly with requirements</li>
                    <li>• Non-blocking - other jobs can process</li>
                    <li>• Automatic retry scheduling</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30 rounded-lg p-6 border border-orange-200 dark:border-orange-900">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  Example: Debounced Search (Delay + Deduplication)
                </h4>
                <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                  <CodeBlock
                    code={`import { NEXTMQ_EVENT_NAME } from 'nextmq';

function SearchInput() {
  const handleInput = (e) => {
    // Dispatch with delay + dedupeKey = automatic debouncing!
    window.dispatchEvent(
      new CustomEvent(NEXTMQ_EVENT_NAME, {
        detail: {
          type: 'search.perform',
          payload: { query: e.target.value },
          dedupeKey: 'search-query', // Same key = replaces previous job (enables debouncing)
          delay: 300 // Debounce: wait 300ms after last keystroke before processing
        }
      })
    );
  };

  return <input onChange={handleInput} />;
}

// User types "n", "e", "x", "t" rapidly:
// - "n" → queued, waits 300ms (dedupeKey: "search-query")
// - "e" → replaces "n" (debouncing), waits 300ms  
// - "x" → replaces "e" (debouncing), waits 300ms
// - "t" → replaces "x" (debouncing), waits 300ms
// → Only "next" search executes after 300ms of inactivity
// 
// If user types again after search completes:
// - New job with same dedupeKey → skipped (deduplication)
// Perfect debouncing + deduplication! 🎯`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Deduplication - Prominent Section */}
      <section id="deduplication" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Job Deduplication</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Prevent duplicate jobs from executing. Perfect for tracking events, analytics, and one-time actions.</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-lg">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                  Prevent Duplicate Execution
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Use <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">dedupeKey</code> to ensure a job only executes once per page lifecycle. Jobs with the same dedupeKey are automatically skipped if already processed or queued.
                </p>
                <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                  <CodeBlock
                    code={`// Order completion tracking - only execute once
window.dispatchEvent(
  new CustomEvent('nextmq', {
    detail: {
      type: 'analytics.orderCompleted',
      payload: {
        orderId: 'ORD-12345',
        total: 99.99
      },
      dedupeKey: 'order-completed-ORD-12345' // ✅ Unique per order
    }
  })
);

// If called again (page re-render, navigation, etc.)
// The job is automatically skipped ✅`}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    How It Works
                  </h4>
                  <ul className="text-sm text-green-800 dark:text-green-200 space-y-1">
                    <li>• Tracks dedupeKey across full job lifecycle</li>
                    <li>• Checks both queue and completed jobs</li>
                    <li>• Prevents duplicates even if dispatched multiple times</li>
                    <li>• Persists for entire page lifecycle</li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Perfect For
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Analytics events</li>
                    <li>• Tracking pixels</li>
                    <li>• One-time actions</li>
                    <li>• Order completion</li>
                    <li>• Conversion tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gray-50 dark:bg-gray-900/50 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Tiny Event Bridge loads in first bytes (~1KB), then processor and handlers load dynamically</p>
        </div>
        <div className="max-w-5xl mx-auto">
          <EventFlowVisualization />
        </div>
      </section>

      {/* Installation */}
      <section id="install" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Installation</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Get started in minutes</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 dark:bg-gray-950 rounded-xl p-8 border border-gray-800">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="ml-4 text-sm text-gray-400">Terminal</span>
            </div>
            <pre className="text-sm text-gray-100 font-mono">
              <code>npm install nextmq</code>
            </pre>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section id="docs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Quick Start</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Set up NextMQ in your Next.js app in 4 simple steps</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
            💡 Tip: Add <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">&lt;NextMQDevTools /&gt;</code> to debug jobs in real-time
          </p>
        </div>
        <div className="max-w-4xl mx-auto space-y-12">
          <Step
            number={1}
            title="Set up EventBridge and Provider"
            description="Add NextMQ components to your root layout. Optionally customize the event name."
            code={`// app/layout.tsx
import { NextMQRootClientEventBridge, NextMQClientProvider } from 'nextmq';
import processor from './processors';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {/* Default: listens for 'nextmq' */}
        <NextMQRootClientEventBridge />
        
        {/* Or use a custom event name: */}
        {/* <NextMQRootClientEventBridge eventName="myApp" /> */}
        
        <NextMQClientProvider processor={processor}>
          {children}
        </NextMQClientProvider>
      </body>
    </html>
  );
}`}
          />
          <Step
            number={2}
            title="Create a Processor"
            description="Route jobs to code-split handlers"
            code={`// app/processors.ts
import type { Processor } from 'nextmq';

const processor: Processor = async (job) => {
  switch (job.type) {
    case 'cart.add':
      const handler = await import('./handlers/cartAdd');
      return handler.default(job);
    default:
      console.warn('Unknown job type:', job.type);
  }
};

export default processor;`}
          />
          <Step
            number={3}
            title="Create Handlers"
            description="Write handlers that can return JSX"
            code={`// app/handlers/cartAdd.tsx
import type { Job } from 'nextmq';

export default async function cartAddHandler(
  job: Job<{ ean: string; quantity: number }>
) {
  // Your handler logic
  return <div>Added to cart!</div>; // Optional: return JSX
}`}
          />
          <Step
            number={4}
            title="Dispatch Jobs"
            description="Send jobs via CustomEvent. Use NEXTMQ_EVENT_NAME constant or your custom event name."
            code={`import { NEXTMQ_EVENT_NAME } from 'nextmq';

// Option 1: Use the default event name (convenience)
window.dispatchEvent(
  new CustomEvent(NEXTMQ_EVENT_NAME, {
    detail: {
      type: 'cart.add',
      payload: { ean: '123', quantity: 1 },
      requirements: ['necessaryConsent'], // Optional
      dedupeKey: 'cart-add-123', // Optional: prevent duplicates
      delay: 500 // Optional: delay in milliseconds
    }
  })
);

// Option 2: Use your custom event name (if configured)
// window.dispatchEvent(
//   new CustomEvent('myApp', { // matches eventName prop
//     detail: { type: 'cart.add', payload: { ean: '123' } }
//   })
// );`}
          />
        </div>
      </section>

      {/* Status Hooks - Prominent Section */}
      <section id="job-status" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 dark:from-purple-950/30 dark:via-blue-950/30 dark:to-green-950/30 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Status Hooks</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Track job status in real-time with React hooks. Perfect for updating UI based on job state.</p>
        </div>
        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-lg">
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  Real-Time Job Status Tracking
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Use the <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">useJobStatus</code> hook to track job status in your React components. Perfect for showing loading states, success messages, or error handling.
                </p>
                <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                  <CodeBlock
                    code={`import { useJobStatus, useNextmq } from 'nextmq';

function AddToCartButton({ productId }) {
  const [jobId, setJobId] = useState<string | null>(null);
  const { status, result, error } = useJobStatus(jobId);
  const queue = useNextmq();
  
  const handleClick = () => {
    const newJobId = queue.enqueue('cart.add', {
      ean: productId,
      quantity: 1
    });
    if (newJobId) setJobId(newJobId);
  };
  
  if (status === 'processing') return <Spinner />;
  if (status === 'failed') return <Error error={error} />;
  if (status === 'completed') return <Success data={result} />;
  return <button onClick={handleClick}>Add to Cart</button>;
}`}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg p-4">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Status States
                  </h4>
                  <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                    <li>
                      • <code className="bg-purple-100 dark:bg-purple-900/50 px-1 rounded">pending</code> - Job queued
                    </li>
                    <li>
                      • <code className="bg-purple-100 dark:bg-purple-900/50 px-1 rounded">processing</code> - Job executing
                    </li>
                    <li>
                      • <code className="bg-purple-100 dark:bg-purple-900/50 px-1 rounded">completed</code> - Job finished
                    </li>
                    <li>
                      • <code className="bg-purple-100 dark:bg-purple-900/50 px-1 rounded">failed</code> - Job errored
                    </li>
                  </ul>
                </div>
                <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Use Cases
                  </h4>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Loading states</li>
                    <li>• Success notifications</li>
                    <li>• Error handling</li>
                    <li>• Progress indicators</li>
                    <li>• Optimistic UI updates</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <JobStatusDemo />
      </section>

      {/* Dynamic Loading Proof */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Dynamic Loading Proof</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Handlers are loaded on-demand. Portal dialogs, notifications, and more can be lazy-loaded easily.</p>
        </div>
        <DynamicLoadingProof />
      </section>

      {/* Portal Dialogs Example */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gray-50 dark:bg-gray-900/50 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Lazy-Load Portal Dialogs</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Perfect for modals, dialogs, and overlays that are rarely used</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-4">Example: Portal Dialog Handler</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">This handler (and its React components) are only loaded when the dialog is actually needed.</p>
            <CodeBlock
              code={`// app/handlers/portalDialog.tsx
import type { Job } from 'nextmq';
import { createPortal } from 'react-dom';

// Heavy dialog component - only loaded when needed
function Dialog({ title, content, onClose }: DialogProps) {
  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md">
        <h2>{title}</h2>
        <p>{content}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}

export default async function portalDialogHandler(
  job: Job<{ title: string; content: string }>
) {
  // This entire handler chunk is loaded dynamically
  // Only when 'portal.dialog' job is dispatched
  return <Dialog title={job.payload.title} content={job.payload.content} />;
}`}
            />
          </div>

          <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="text-xl font-semibold mb-4">Call from Anywhere</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Trigger portal dialogs from anywhere in your app, or even from third-party scripts.</p>
            <CodeBlock
              code={`// From your React component
window.dispatchEvent(
  new CustomEvent('nextmq', {
    detail: {
      type: 'portal.dialog',
      payload: {
        title: 'Welcome!',
        content: 'This dialog was lazy-loaded.'
      }
    }
  })
);

// From a third-party script (e.g., analytics, partner widget)
(function() {
  // Partner's script can trigger your dialogs
  window.dispatchEvent(
    new CustomEvent('nextmq', {
      detail: {
        type: 'portal.dialog',
        payload: { title: 'Special Offer', content: '20% off!' }
      }
    })
  );
})();`}
              language="javascript"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-6">
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              Benefits
            </h4>
            <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>
                  <strong>Smaller initial bundle:</strong> Dialog code not loaded until needed
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>
                  <strong>Better performance:</strong> Faster page loads, especially on mobile
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>
                  <strong>Third-party friendly:</strong> External scripts can trigger dialogs without React context
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                <span>
                  <strong>Automatic code splitting:</strong> Next.js handles chunking automatically
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Server Actions Integration */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Built for Next.js</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Seamlessly integrates with Next.js Server Actions, Server Components, and the App Router</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              Server Actions Integration
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Handlers can call Server Actions directly. The handler code (including Server Action imports) is code-split and only loaded when needed.</p>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Server Action:</p>
                <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                  <CodeBlock
                    code={`// app/actions/cart.ts
'use server';

export async function addToCart(ean: string, quantity: number) {
  // Server-side logic - database, validation, etc.
  const cart = await db.cart.add({ ean, quantity });
  return { success: true, cartId: cart.id };
}`}
                  />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Handler (code-split):</p>
                <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                  <CodeBlock
                    code={`// app/handlers/cartAdd.tsx
import type { Job } from 'nextmq';
import { addToCart } from '../actions/cart'; // Server Action

export default async function cartAddHandler(
  job: Job<{ ean: string; quantity: number }>
) {
  // Call Server Action - works seamlessly!
  const result = await addToCart(
    job.payload.ean, 
    job.payload.quantity
  );
  
  if (result.success) {
    return <Notification>Added to cart!</Notification>;
  }
  
  return <Error>Failed to add</Error>;
}`}
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Why This Matters</p>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Server Action code is bundled with the handler (code-split)</li>
                    <li>• Only loads when the job type is dispatched</li>
                    <li>• No need for separate API routes or fetch calls</li>
                    <li>• Type-safe end-to-end with TypeScript</li>
                    <li>• Works with React Server Components and Server Actions</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DevTools */}
      <section id="devtools" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-gray-50 dark:bg-gray-900/50 rounded-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Built-in DevTools</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Debug and monitor your jobs in real-time with the included DevTools component</p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-950 rounded-xl border border-gray-200 dark:border-gray-800 p-8 shadow-lg">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Bug className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              Real-Time Job Monitoring
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Add <code className="bg-gray-100 dark:bg-gray-900 px-2 py-1 rounded">&lt;NextMQDevTools /&gt;</code> to any page to see live updates of your job queue, event buffer, and requirement status.
            </p>

            <div className="mb-6 flex justify-center">
              <DevToolsActivator />
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Usage:</p>
                <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
                  <CodeBlock
                    code={`import { NextMQDevTools } from 'nextmq';

export default function Page() {
  return (
    <>
      <NextMQDevTools />
      <YourPageContent />
    </>
  );
}`}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Event Buffer
                </h4>
                <ul className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                  <li>• Events waiting for processor</li>
                  <li>• Shows processor ready status</li>
                  <li>• Real-time updates</li>
                </ul>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  Job Queue
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Pending jobs with status</li>
                  <li>• Requirement status per job</li>
                  <li>• Processing state indicator</li>
                </ul>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Bug className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-blue-900 dark:text-blue-100 mb-1">Features</p>
                  <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                    <li>• Floating panel in top-right corner (non-intrusive)</li>
                    <li>• Updates every 500ms when open</li>
                    <li>• Shows job IDs, types, payloads, and timestamps</li>
                    <li>• Visual indicators for requirement status</li>
                    <li>• Only renders on client (no hydration issues)</li>
                    <li>• Perfect for debugging during development</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">Start building with NextMQ today. Simple, standard, and built for Next.js.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="#install" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-colors">
              Install Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="https://github.com/danieljameswilliams/nextmq" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-500/20 text-white font-semibold rounded-lg hover:bg-blue-500/30 transition-colors border border-blue-400/30">
              <Github className="w-4 h-4" />
              View on GitHub
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold">NextMQ</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">MIT License • Built for Next.js</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description, highlight }: { icon: React.ReactNode; title: string; description: string; highlight?: boolean }) {
  return (
    <div className={`bg-white dark:bg-gray-950 rounded-xl border-2 p-8 transition-colors ${highlight ? 'border-blue-300 dark:border-blue-700 hover:border-blue-400 dark:hover:border-blue-600 shadow-lg' : 'border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-800'}`}>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${highlight ? 'bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400' : 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400'}`}>{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  )
}

function Step({ number, title, description, code }: { number: number; title: string; description: string; code: string }) {
  return (
    <div className="flex gap-6">
      <div className="flex-shrink-0">
        <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">{number}</div>
      </div>
      <div className="flex-1">
        <h3 className="text-2xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
        <div className="bg-gray-950 rounded-lg border border-gray-800 overflow-hidden">
          <CodeBlock code={code} />
        </div>
      </div>
    </div>
  )
}

function QuickNavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors">
      {icon}
      {children}
    </Link>
  )
}
