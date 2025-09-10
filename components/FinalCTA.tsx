import Section from './Section';
import { CONFIG } from '@/lib/config';

export default function FinalCTA() {
  return (
    <Section id="cta" className="relative pt-6 md:pt-10">
      <div className="absolute inset-0 -z-10 blur-3xl opacity-50 bg-cta-radial" />
      <div className="text-center card py-14">
        <h2 className="heading-2">{CONFIG.finalCta.headline}</h2>
        <p className="mt-4 body-lg text-zinc-300">{CONFIG.finalCta.description}</p>
        <a href={CONFIG.finalCta.ctaButton.href} className="mt-8 inline-flex items-center rounded-xl px-8 py-3 font-semibold bg-brand-500 hover:bg-brand-500/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition glow">
          {CONFIG.finalCta.ctaButton.text}
        </a>
      </div>
    </Section>
  );
}
