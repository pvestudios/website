import Section from './Section';
import { CONFIG } from '@/lib/config';

export default function FAQ() {
  return (
    <Section id="faq">
      <h2 className="heading-2">{CONFIG.faq.title}</h2>
      <div className="mt-6 divide-y divide-zinc-800 border border-zinc-800 rounded-2xl">
        {CONFIG.faq.questions.map((faq, i) => (
          <details key={i} className="group open:bg-zinc-900/50 px-6 py-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-100 flex items-center justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
              {faq.question}
              <span className="text-brand-400 group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-zinc-300">{faq.answer}</p>
          </details>
        ))}
      </div>
      <p className="mt-4 text-xs text-zinc-500">
        Disclaimer: Tokens are highly volatile and risky. Nothing here is financial advice. Always do your own research.
      </p>
    </Section>
  );
}
