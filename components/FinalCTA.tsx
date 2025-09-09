import Section from './Section';
import { CONFIG } from '@/lib/config';

export default function FinalCTA() {
  return (
    <Section id="cta" className="relative">
      <div className="absolute inset-0 -z-10 blur-3xl opacity-50" style={{background: 'radial-gradient(60% 60% at 50% 50%, rgba(57,255,20,0.25), transparent), radial-gradient(40% 40% at 80% 20%, rgba(0,240,255,0.25), transparent), radial-gradient(40% 40% at 20% 80%, rgba(138,43,226,0.25), transparent)'}}/>
      <div className="text-center card py-14">
        <h2 className="text-3xl md:text-4xl font-extrabold glow-text">{CONFIG.finalCta.headline}</h2>
        <p className="mt-4 text-zinc-300">{CONFIG.finalCta.description}</p>
        <a href={CONFIG.finalCta.ctaButton.href} className="mt-8 inline-flex items-center rounded-xl px-8 py-3 font-semibold bg-brand-500 hover:bg-brand-500/90 transition glow">
          {CONFIG.finalCta.ctaButton.text}
        </a>
      </div>
    </Section>
  );
}
