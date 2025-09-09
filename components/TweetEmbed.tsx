import { Tweet } from 'react-tweet';

interface TweetEmbedProps {
  tweetId: string;
  author: string;
  fallbackText: string;
}

export default function TweetEmbed({ tweetId, author, fallbackText }: TweetEmbedProps) {
  return (
    <div className="tweet-container relative" suppressHydrationWarning>
      {/* Fixed aspect ratio container to prevent CLS */}
      <div className="aspect-[16/9] w-full min-h-[400px] flex items-center justify-center">
        <div className="w-full h-full">
          <Tweet id={tweetId} />
        </div>
      </div>
      
      {/* Fallback for when JS is disabled */}
      <noscript>
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 rounded-lg border border-zinc-800">
          <p className="text-zinc-300 text-center p-4">
            {fallbackText}
          </p>
        </div>
      </noscript>
    </div>
  );
}
