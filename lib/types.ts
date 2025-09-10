export interface SiteConfig {
  site: {
    name: string;
    url: string;
    description: string;
    ogImage: string;
    themeColor: string;
  };
  walletAddress: string;
  nav: {
    logo: string;
    logoAlt: string;
    brandName: string;
    links: Array<{
      text: string;
      href: string;
    }>;
    ctaButton: {
      text: string;
      href: string;
    };
  };
  hero: {
    tagline: string;
    headline: string;
    subheadline: string;
    primaryCta: {
      text: string;
      href: string;
    };
    secondaryCta: {
      text: string;
      href: string;
    };
    logo: {
      src: string;
      alt: string;
    };
  };
  problem: {
    title: string;
    description: string;
  };
  features: {
    title: string;
    items: Array<{
      title: string;
      description: string;
    }>;
  };
  testimonials: {
    title?: string;
    tweets: Array<{
      tweetId: string;
      author: string;
      text: string;
    }>;
  };
  pricing: {
    title: string;
    plans: Array<{
      name: string;
      price: string;
      period: string;
      features: string[];
      ctaText: string;
      highlighted: boolean;
    }>;
  };
  faq: {
    title: string;
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };
  finalCta: {
    headline: string;
    description: string;
    ctaButton: {
      text: string;
      href: string;
    };
  };
  footer: {
    logo: {
      src: string;
      alt: string;
    };
    copyright: string;
    links: Array<{
      text: string;
      href: string;
    }>;
  };
}
