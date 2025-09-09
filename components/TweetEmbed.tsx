import { Tweet } from 'react-tweet';

interface TweetEmbedProps {
  tweetId: string;
  author: string;
  fallbackText: string;
}

export default function TweetEmbed({ tweetId, author, fallbackText }: TweetEmbedProps) {
  return (
    <div className="tweet-container">
      <Tweet id={tweetId} />
    </div>
  );
}
