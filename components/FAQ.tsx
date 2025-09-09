import Section from './Section';
import { CONFIG } from '@/lib/config';

export default function FAQ() {
  return (
    <Section id="faq">
      <h2 className="text-2xl md:text-3xl font-bold">{CONFIG.faq.title}</h2>
      <div className="mt-6 divide-y divide-zinc-800 border border-zinc-800 rounded-2xl">
        {CONFIG.faq.questions.map((faq, i) => (
          <details key={i} className="group open:bg-zinc-900/50 px-6 py-4">
            <summary className="cursor-pointer list-none font-medium text-zinc-100 flex items-center justify-between">
              {faq.question}
              <span className="text-brand-400 group-open:rotate-45 transition">+</span>
            </summary>
            <p className="mt-3 text-zinc-300">{faq.answer}</p>
          </details>
        ))}
      </div>
    </Section>
  );
}
