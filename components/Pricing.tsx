import Section from './Section';
import { CONFIG } from '@/lib/config';

export default function Pricing() {
  return (
    <Section id="pricing">
      <h2 className="heading-2">{CONFIG.pricing.title}</h2>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {CONFIG.pricing.plans.map((plan) => (
          <div key={plan.name} className={`card p-6 ${plan.highlighted ? 'ring-2 ring-brand-500 glow' : ''}`}>
            <h3 className="text-lg font-semibold">{plan.name}</h3>
            <p className="mt-3 text-xl font-semibold">
              {plan.price}
              <span className="ml-2 text-sm font-normal text-zinc-400">{plan.period}</span>
            </p>
            <ul className="mt-4 text-sm text-zinc-300 space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <a href="#cta" className="mt-6 inline-flex w-full justify-center rounded-xl px-4 py-2 font-semibold bg-brand-500 hover:bg-brand-500/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 transition">{plan.ctaText}</a>
          </div>
        ))}
      </div>
    </Section>
  );
}
