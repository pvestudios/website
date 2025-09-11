'use client';

import { useState } from 'react';

interface CopyAddyProps {
  value: string;
  className?: string;
}

export default function CopyAddy({ value, className }: CopyAddyProps) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      // noop
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      className={`inline-flex items-center gap-1 sm:gap-2 rounded-lg px-2 sm:px-3 py-1.5 text-sm font-medium border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${className ?? ''}`}
      aria-label="Copy address"
      title={copied ? 'Copied!' : 'Copy address'}
    >
      <span className="hidden sm:inline text-zinc-200">addy</span>
      <span className={`text-zinc-400 ${copied ? 'text-brand-500' : ''}`} aria-hidden="true">
        {copied ? (
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </span>
    </button>
  );
}


