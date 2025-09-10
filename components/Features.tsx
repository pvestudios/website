import Section from './Section';
import { CONFIG } from '@/lib/config';
import { parseTextWithFormatting } from '@/lib/utils';

export default function Features() {
  return (
    <Section id="features">
      <h2 className="heading-2">{parseTextWithFormatting(CONFIG.features.title)}</h2>
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CONFIG.features.items.map((feature) => (
          <div key={feature.title} className="card p-6 hover:glow transition">
            <h3 className="font-bold text-brand-500 glow-text">{parseTextWithFormatting(feature.title)}</h3>
            <p className="mt-2 body-lg text-zinc-300">{parseTextWithFormatting(feature.description)}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
