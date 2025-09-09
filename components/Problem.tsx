import Section from './Section';
import { CONFIG } from '@/lib/config';
import { parseTextWithFormatting } from '@/lib/utils';

export default function Problem() {
  return (
    <Section className="">
      <div className="card p-8 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold">{parseTextWithFormatting(CONFIG.problem.title)}</h2>
        <p className="mt-4 text-zinc-300 max-w-3xl preserve-breaks">
          {parseTextWithFormatting(CONFIG.problem.description)}
        </p>
      </div>
    </Section>
  );
}
