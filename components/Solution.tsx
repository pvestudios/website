import Section from './Section';
import { CONFIG } from '@/lib/config';

export default function Solution() {
  return (
    <Section>
      <div className="grid md:grid-cols-2 gap-6">
        {CONFIG.solution.benefits.map((benefit) => (
          <div key={benefit.title} className="card p-6">
            <h3 className="text-lg font-semibold">{benefit.title}</h3>
            <p className="mt-2 text-zinc-300">{benefit.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
