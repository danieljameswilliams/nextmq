'use client'

import { useEffect, useState } from 'react'

const eventNames = ['nextmq', 'myApp', 'helloMcNerd', 'app:jobs', 'shop:actions', 'analytics:track', 'admin:commands', 'portal:show', 'cart:update', 'user:events']

export function RotatingEventName() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % eventNames.length)
        setIsVisible(true)
      }, 200) // Half of transition duration for smooth fade
    }, 2000) // Change every 2 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-3 flex-wrap justify-center py-4">
      <span className="text-gray-600 dark:text-gray-400 font-medium">Use any event name:</span>
      <code
        className={`bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/50 dark:to-purple-950/50 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-lg font-mono text-lg font-bold border-2 border-blue-300 dark:border-blue-800 shadow-sm transition-all duration-300 ease-in-out ${
          isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-1'
        }`}
      >
        '{eventNames[currentIndex]}'
      </code>
      <span className="text-gray-600 dark:text-gray-400 text-sm font-medium">or your own!</span>
    </div>
  )
}
