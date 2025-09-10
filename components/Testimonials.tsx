import Section from './Section';
import { CONFIG } from '@/lib/config';
import dynamic from 'next/dynamic';

const TweetEmbed = dynamic(() => import('./TweetEmbed'), { ssr: false, loading: () => (
  <div className="h-40 w-full animate-pulse rounded-xl bg-zinc-900/60 border border-zinc-800" />
) });

export default function Testimonials() {
  const title = CONFIG.testimonials.title;
  const tweets = CONFIG.testimonials.tweets;
  const total = tweets.length;
  return (
    <Section>
      {title && (
        <div className="mb-6">
          <h2 className="heading-2">{title}</h2>
        </div>
      )}
      <div className="md:grid md:grid-cols-2 gap-6">
        {/* Mobile: full-width slides with snap; Desktop: standard grid */}
        <div className="overflow-x-auto md:overflow-visible no-scrollbar snap-x snap-mandatory flex md:contents gap-4 pl-4 pr-4">
          {tweets.map((tweet, index) => (
            <div
              key={tweet.tweetId}
              className="card p-6 snap-start shrink-0 w-[calc(100vw-2rem)] md:w-auto relative"
            >
              <TweetEmbed 
                tweetId={tweet.tweetId}
                author={tweet.author}
                fallbackText={tweet.text}
              />

              {/* Mobile-only swipe affordances */}
              {/* Left arrow: show on all but first slide */}
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="md:hidden pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 z-10 text-zinc-400/70 animate-pulse"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}

              {/* Right arrow: show on all but last slide */}
              {index < total - 1 && (
                <span
                  aria-hidden="true"
                  className="md:hidden pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 z-10 text-zinc-400/70 animate-pulse"
                >
                  <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
