import Section from './Section';
import { CONFIG } from '@/lib/config';
import { parseTextWithFormatting } from '@/lib/utils';
import Image from 'next/image';

export default function Hero() {
  return (
    <Section>
      <div className="grid md:grid-cols-2 items-center gap-10">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">{CONFIG.hero.tagline}</p>
          <h1 className="mt-3 text-4xl md:text-6xl font-extrabold leading-tight glow-text">
            {parseTextWithFormatting(CONFIG.hero.headline)}
          </h1>
          <p className="mt-5 text-zinc-300 max-w-prose">
            {parseTextWithFormatting(CONFIG.hero.subheadline)}
          </p>
          <div className="mt-8 flex gap-3">
            <a href={CONFIG.hero.primaryCta.href} className="rounded-xl px-6 py-3 font-semibold bg-brand-500 hover:bg-brand-500/90 transition glow">
              {CONFIG.hero.primaryCta.text}
            </a>
            <a href={CONFIG.hero.secondaryCta.href} className="rounded-xl px-6 py-3 font-semibold border border-zinc-800 hover:border-zinc-700">
              {CONFIG.hero.secondaryCta.text}
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-10 -z-10 blur-3xl opacity-70" style={{background: 'conic-gradient(from 180deg at 50% 50%, rgba(57,255,20,0.35), rgba(0,240,255,0.35), rgba(138,43,226,0.35), rgba(255,234,0,0.25), rgba(57,255,20,0.35))'}}/>
          <Image 
            src={CONFIG.hero.logo.src} 
            alt={CONFIG.hero.logo.alt} 
            width={288}
            height={288}
            className="mx-auto h-72 w-72 object-contain" 
            priority
          />
        </div>
      </div>
    </Section>
  );
}
