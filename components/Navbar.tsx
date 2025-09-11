'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CONFIG } from '@/lib/config';
import Image from 'next/image';
import CopyAddy from './CopyAddy';

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 16);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition-all ${solid ? 'backdrop-blur-md bg-zinc-950/70 border-b border-zinc-800' : 'bg-transparent'}`}>
      <nav className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group min-w-0">
          <Image 
            src={CONFIG.nav.logo} 
            alt={CONFIG.nav.logoAlt} 
            className="h-8 w-8 rounded-full" 
            width={32}
            height={32}
          />
          <span className="font-semibold tracking-tight group-hover:glow-text truncate max-w-[50vw] sm:max-w-none">{CONFIG.nav.brandName}</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-300">
          {CONFIG.nav.links.map((link) => (
            <a key={link.text} href={link.href} className="hover:text-white">
              {link.text}
            </a>
          ))}
        </div>
        <div className="ml-4 inline-flex items-center gap-2 sm:gap-3 shrink-0">
          <CopyAddy value={CONFIG.walletAddress} />
          <a
            href="https://x.com/PVEStudioInc"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X (Twitter) — @PVEStudioInc"
            title="X (Twitter) — @PVEStudioInc"
            className="inline-flex items-center justify-center rounded-lg p-2 hover:bg-zinc-900/60 border border-transparent hover:border-zinc-800 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          >
            <Image src="/x.png" alt="X" width={64} height={64} className="h-7 w-7 md:h-8 md:w-8" />
          </a>
        </div>
      </nav>
    </header>
  );
}
