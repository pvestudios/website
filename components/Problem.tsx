import Section from './Section';
import { CONFIG } from '@/lib/config';
import { parseTextWithFormatting } from '@/lib/utils';

export default function Problem() {
  return (
    <Section id="problem" className="pt-2 md:pt-10">
      <div className="card p-8 md:p-10">
        <h2 className="heading-2">{parseTextWithFormatting(CONFIG.problem.title)}</h2>
        <p className="mt-8 max-w-3xl preserve-breaks body-lg text-zinc-300">
          {parseTextWithFormatting(CONFIG.problem.description)}
        </p>
      </div>
    </Section>
  );
}
