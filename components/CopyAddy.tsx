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
      className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/60 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ${className ?? ''}`}
      aria-label="Copy address"
      title={copied ? 'Copied!' : 'Copy address'}
    >
      <span className="text-zinc-200">addy</span>
      <span className={`text-zinc-400 ${copied ? 'text-brand-500' : ''}`} aria-hidden="true">
        {copied ? '✔︎' : '📋'}
      </span>
    </button>
  );
}


