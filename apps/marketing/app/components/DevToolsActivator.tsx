'use client';

import { useState } from 'react';
import { NextMQDevTools } from 'nextmq';
import { Wrench } from 'lucide-react';

export function DevToolsActivator() {
  const [isActive, setIsActive] = useState(false);

  if (!isActive) {
    return (
      <button
        onClick={() => setIsActive(true)}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-colors"
        aria-label="Activate DevTools"
      >
        <Wrench className="w-5 h-5" />
        Activate DevTools
      </button>
    );
  }

  return <NextMQDevTools />;
}

