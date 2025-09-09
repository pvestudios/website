import Section from './Section';
import { CONFIG } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-zinc-800">
      <Section className="py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-zinc-400">
          <div className="flex items-center gap-2">
            <img src={CONFIG.footer.logo.src} className="h-6 w-6" alt={CONFIG.footer.logo.alt}/>
            <span>{CONFIG.footer.copyright}</span>
          </div>
          <nav className="flex items-center gap-6">
            {CONFIG.footer.links.map((link) => (
              <a key={link.text} href={link.href} className="hover:text-zinc-200">
                {link.text}
              </a>
            ))}
          </nav>
        </div>
      </Section>
    </footer>
  );
}
