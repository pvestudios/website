'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CONFIG } from '@/lib/config';
import Image from 'next/image';

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
        <Link href="#" className="flex items-center gap-2 group">
          <Image 
            src={CONFIG.nav.logo} 
            alt={CONFIG.nav.logoAlt} 
            className="h-8 w-8 rounded-full" 
            width={32}
            height={32}
          />
          <span className="font-semibold tracking-tight group-hover:glow-text">{CONFIG.nav.brandName}</span>
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm text-zinc-300">
          {CONFIG.nav.links.map((link) => (
            <a key={link.text} href={link.href} className="hover:text-white">
              {link.text}
            </a>
          ))}
        </div>
        <a href={CONFIG.nav.ctaButton.href} className="ml-4 inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold bg-brand-500/90 hover:bg-brand-500 transition glow">
          {CONFIG.nav.ctaButton.text}
        </a>
      </nav>
    </header>
  );
}
