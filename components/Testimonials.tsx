import Section from './Section';
import { CONFIG } from '@/lib/config';
import dynamic from 'next/dynamic';

const TweetEmbed = dynamic(() => import('./TweetEmbed'), { ssr: false });

export default function Testimonials() {
  return (
    <Section>
      <div className="grid md:grid-cols-2 gap-6">
        {CONFIG.testimonials.tweets.map((tweet) => (
          <div key={tweet.tweetId} className="card p-6">
            <TweetEmbed 
              tweetId={tweet.tweetId}
              author={tweet.author}
              fallbackText={tweet.text}
            />
          </div>
        ))}
      </div>
    </Section>
  );
}
