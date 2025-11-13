'use client';

import { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export function CodeBlock({ code, language = 'typescript' }: { code: string; language?: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <pre className="p-6 m-0 text-sm text-gray-100 font-mono overflow-x-auto">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{
        margin: 0,
        padding: '1.5rem',
        fontSize: '0.875rem',
        lineHeight: '1.5',
      }}
      codeTagProps={{
        style: {
          fontFamily: 'var(--font-mono), monospace',
        },
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}

