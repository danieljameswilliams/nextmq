# NextMQ

A tiny queue + actions runtime for Next.js (CustomEvent + Context + code-splitting friendly).

## Installation

```bash
npm install nextmq
```

## Quick Start

```tsx
// app/layout.tsx
import { NextMQRootClientEventBridge, NextMQClientProvider } from 'nextmq';
import processor from './processors';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <NextMQRootClientEventBridge />
        <NextMQClientProvider processor={processor}>
          {children}
        </NextMQClientProvider>
      </body>
    </html>
  );
}
```

```tsx
// app/processors.ts
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

export default processor;
```

```tsx
// Trigger a job
import { useNextmq } from 'nextmq';

function MyComponent() {
  const { invoke } = useNextmq();
  
  const handleClick = () => {
    invoke('cart.add', { productId: '123', quantity: 1 });
  };
  
  return <button onClick={handleClick}>Add to Cart</button>;
}
```

## Features

- 🚀 **Tiny**: Minimal bundle size
- ⚡ **Fast**: Built on CustomEvent API
- 📦 **Code-splitting friendly**: Dynamic imports for handlers
- 🔄 **Queue management**: Built-in job queue with debouncing and deduplication
- 🎯 **Type-safe**: Full TypeScript support
- 🛠️ **DevTools**: Built-in debugging tools

## Documentation

For more information, visit the [NextMQ documentation](https://github.com/danieljameswilliams/nextmq).

## License

MIT

