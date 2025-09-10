import Section from './Section';
import { CONFIG } from '@/lib/config';
import { parseTextWithFormatting } from '@/lib/utils';
import Image from 'next/image';

export default function Hero() {
  return (
    <Section className="pb-0 md:pb-6">
      <div className="grid md:grid-cols-2 items-center gap-10">
        <div>
          <p className="eyebrow">{CONFIG.hero.tagline}</p>
          <h1 className="mt-3 heading-1">
            {parseTextWithFormatting(CONFIG.hero.headline)}
          </h1>
          <p className="mt-5 max-w-prose subheading">
            {parseTextWithFormatting(CONFIG.hero.subheadline)}
          </p>
          <div className="mt-8 flex gap-3">
            <a href={CONFIG.hero.primaryCta.href} className="rounded-xl px-6 py-3 font-semibold bg-brand-500 hover:bg-brand-500/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition glow">
              {CONFIG.hero.primaryCta.text}
            </a>
            <a href={CONFIG.hero.secondaryCta.href} className="rounded-xl px-6 py-3 font-semibold border border-zinc-800 hover:border-zinc-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
              {CONFIG.hero.secondaryCta.text}
            </a>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-10 -z-10 blur-3xl opacity-70 bg-hero-conic" />
          <Image 
            src={CONFIG.hero.logo.src} 
            alt={CONFIG.hero.logo.alt} 
            width={512}
            height={512}
            className="mx-auto h-[60vw] w-[60vw] md:h-[21vw] md:w-[21vw] object-contain"
            priority
          />
        </div>
      </div>
    </Section>
  );
}
