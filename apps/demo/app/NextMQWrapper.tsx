'use client';

import { NextMQClientProvider } from 'nextmq';
import processor from './processors';

export default function NextMQWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NextMQClientProvider processor={processor}>
      {children}
    </NextMQClientProvider>
  );
}

