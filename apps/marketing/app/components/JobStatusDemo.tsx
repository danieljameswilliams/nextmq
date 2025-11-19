'use client'

import { AlertCircle, CheckCircle2, Heart, Loader2, Share2, ShoppingBag, Star } from 'lucide-react'
import { useJobStatus, useNextmq } from 'nextmq'
import { useState } from 'react'

export function JobStatusDemo() {
  const [jobId, setJobId] = useState<string | null>(null)
  const { status, error } = useJobStatus(jobId)
  const queue = useNextmq()

  const handleAddToCart = () => {
    // Reset if already completed or failed
    if (status === 'completed' || status === 'failed') {
      setJobId(null)
      // Small delay to show the reset
      setTimeout(() => {
        const productId = `PROD-${Date.now()}`
        const newJobId = queue.add('cart.add', {
          ean: productId,
          quantity: 1,
        })
        if (newJobId) {
          setJobId(newJobId)
        }
      }, 100)
      return
    }

    // Generate a unique product ID for this demo
    const productId = `PROD-${Date.now()}`

    // Add the job directly to get the job ID
    const newJobId = queue.add('cart.add', {
      ean: productId,
      quantity: 1,
    })

    if (newJobId) {
      setJobId(newJobId)
    }
  }

  const getButtonContent = () => {
    if (status === 'processing') {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Adding to Cart...
        </>
      )
    }
    if (status === 'completed') {
      return (
        <>
          <CheckCircle2 className="w-4 h-4" />
          Added to Cart!
        </>
      )
    }
    if (status === 'failed') {
      return (
        <>
          <AlertCircle className="w-4 h-4" />
          Failed - Try Again
        </>
      )
    }
    return (
      <>
        <ShoppingBag className="w-4 h-4" />
        Add to Cart
      </>
    )
  }

  const getButtonStyles = () => {
    if (status === 'processing') {
      return 'bg-blue-500 hover:bg-blue-600 cursor-wait'
    }
    if (status === 'completed') {
      return 'bg-green-500 hover:bg-green-600'
    }
    if (status === 'failed') {
      return 'bg-red-500 hover:bg-red-600'
    }
    return 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Screenshot-style frame */}
      <div className="bg-gray-100 dark:bg-gray-900 rounded-t-lg border border-gray-300 dark:border-gray-700 px-4 py-3 flex items-center gap-2">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="flex-1 bg-white dark:bg-gray-800 rounded px-3 py-1.5 text-xs text-gray-500 dark:text-gray-400 text-center font-mono">example.com/product</div>
      </div>
      <div className="bg-white dark:bg-gray-950 rounded-b-2xl border-x border-b border-gray-200 dark:border-gray-800 overflow-hidden shadow-xl">
        {/* Product Image Section */}
        <div className="grid md:grid-cols-2 gap-8 p-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-pink-950/30 dark:via-purple-950/30 dark:to-blue-950/30 rounded-xl overflow-hidden relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-white/80 dark:bg-gray-900/80 rounded-full flex items-center justify-center mb-4 mx-auto">
                    <ShoppingBag className="w-16 h-16 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Fashion Product Image</p>
                </div>
              </div>
              {/* Badge */}
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">New Arrival</div>
            </div>
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gradient-to-br from-pink-50 to-purple-50 dark:from-pink-950/20 dark:to-purple-950/20 rounded-lg border-2 border-gray-200 dark:border-gray-800 pointer-events-none opacity-60" />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            {/* Brand & Title */}
            <div>
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">FASHION BRAND</div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-3">Premium Cotton T-Shirt</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">(128 reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">$49.99</span>
              <span className="text-xl text-gray-400 line-through">$79.99</span>
              <span className="text-sm font-semibold text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded">37% OFF</span>
            </div>

            {/* Size Selection */}
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Size</div>
              <div className="flex gap-2">
                {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                  <button key={size} type="button" disabled className="w-12 h-12 border-2 border-gray-300 dark:border-gray-700 rounded-lg font-semibold text-gray-700 dark:text-gray-300 opacity-50 cursor-not-allowed pointer-events-none">
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Color</div>
              <div className="flex gap-3">
                {[
                  { name: 'Black', color: 'bg-gray-900' },
                  { name: 'Navy', color: 'bg-blue-900' },
                  { name: 'White', color: 'bg-white border-2 border-gray-300' },
                ].map((c) => (
                  <button key={c.name} type="button" disabled className={`w-10 h-10 ${c.color} rounded-full opacity-50 cursor-not-allowed pointer-events-none`} title={c.name} />
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={status === 'processing'}
                className={`w-full flex items-center justify-center gap-2 px-6 py-5 text-white font-bold text-lg rounded-xl transition-all shadow-2xl hover:shadow-3xl hover:scale-[1.02] active:scale-[0.98] ${getButtonStyles()} disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-2xl`}
                style={{
                  boxShadow:
                    status === 'processing'
                      ? '0 20px 25px -5px rgba(59, 130, 246, 0.3), 0 10px 10px -5px rgba(59, 130, 246, 0.2)'
                      : status === 'completed'
                        ? '0 20px 25px -5px rgba(34, 197, 94, 0.3), 0 10px 10px -5px rgba(34, 197, 94, 0.2)'
                        : status === 'failed'
                          ? '0 20px 25px -5px rgba(239, 68, 68, 0.3), 0 10px 10px -5px rgba(239, 68, 68, 0.2)'
                          : '0 20px 25px -5px rgba(37, 99, 235, 0.4), 0 10px 10px -5px rgba(37, 99, 235, 0.3)',
                }}
              >
                {getButtonContent()}
              </button>

              {/* Secondary Actions */}
              <div className="flex gap-3">
                <button type="button" disabled className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg opacity-50 cursor-not-allowed pointer-events-none">
                  <Heart className="w-4 h-4" />
                  Wishlist
                </button>
                <button type="button" disabled className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg opacity-50 cursor-not-allowed pointer-events-none">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>

            {/* Status Indicator */}
            {jobId && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Job Status:</div>
                <div className="flex items-center gap-2">
                  {status === 'pending' && (
                    <>
                      <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Pending</span>
                    </>
                  )}
                  {status === 'processing' && (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                      <span className="text-sm text-blue-600 dark:text-blue-400">Processing...</span>
                    </>
                  )}
                  {status === 'completed' && (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400">Completed</span>
                    </>
                  )}
                  {status === 'failed' && (
                    <>
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600 dark:text-red-400">Failed: {error instanceof Error ? error.message : 'Unknown error'}</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Product Info */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-800 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-2">
                <span className="font-semibold">Free Shipping:</span>
                <span>On orders over $50</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold">Returns:</span>
                <span>30-day return policy</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold">Material:</span>
                <span>100% Organic Cotton</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Code Example */}
      <div className="mt-8 bg-gray-950 rounded-xl border border-gray-800 overflow-hidden">
        <div className="p-4 border-b border-gray-800">
          <h4 className="font-semibold text-gray-100">Example: Using useJobStatus Hook</h4>
        </div>
        <div className="p-6">
          <pre className="text-sm font-mono text-gray-300 overflow-x-auto">
            <code>{`import { useJobStatus, useNextmq } from 'nextmq';

function AddToCartButton({ productId }) {
  const [jobId, setJobId] = useState<string | null>(null);
  const { status, result, error } = useJobStatus(jobId);
  const queue = useNextmq();
  
  const handleClick = () => {
    // Add job and get job ID
    const newJobId = queue.add('cart.add', {
      ean: productId,
      quantity: 1
    });
    
    if (newJobId) {
      setJobId(newJobId);
    }
  };
  
  if (status === 'processing') return <Spinner />;
  if (status === 'failed') return <Error error={error} />;
  if (status === 'completed') return <Success data={result} />;
  return <button onClick={handleClick}>Add to Cart</button>;
}`}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}
