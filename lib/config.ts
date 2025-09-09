import { SiteConfig } from './types';

export const CONFIG: SiteConfig = {
  // Site metadata
  site: {
    name: 'PVE Studios',
    url: 'https://example.com',
    description: 'Up & to the right',
    ogImage: '/og-image.png',
    themeColor: '#00040d'
  },

  // Navigation
  nav: {
    logo: '/logo-glow.png',
    logoAlt: 'PVE Studios Logo',
    brandName: 'PVE Studios',
    links: [
      { text: 'How it works', href: '#features' },
      { text: 'Pricing', href: '#pricing' },
      { text: 'FAQ', href: '#faq' }
    ],
    ctaButton: {
      text: 'ape now',
      href: '#cta'
    }
  },

  // Hero section
  hero: {
    tagline: 'STOP THE BLOODSHED',
    headline: 'We launch **organic runners** you can trust',
    subheadline: 'No bundles, no insiders, no bullshit – FAIR for everyone. We focus on **building**, you focus on **trading safely**. Easy as that.',
    primaryCta: {
      text: 'ape now',
      href: '#cta'
    },
    secondaryCta: {
      text: 'how it works',
      href: '#features'
    },
    logo: {
      src: '/logo-glow.png',
      alt: 'PVE Studios Logo'
    }
  },

  // Problem section
  problem: {
    title: 'What tf is wrong with the **trenches**?!',
    description: `yeah, we all know: **99% of tokens** out there are straight-up scams.
    
Devs don't care about building — they care about **squeezing every last drop** out of you.

They launch, they farm, they dump, and they get paid to do so (hello, creator fees).

And what about you, the trader?

You're already taking the risk of of trading shitters. We all know the game.

But **scams on top of that**? Rug after rug after rug? That's straight robbery.

It doesn't have to be this way. You deserve a **fair shot** in the trenches.

You deserve a place where devs dev, and traders trade — without someone picking your pockets at every turn.

That's where **PVE Studios** comes in.`
  },

  // Solution section
  // solution: {
  //   benefits: [
  //     {
  //       title: 'ZERO BUNDLES',
  //       description: 'We don\'t buy our own tokens. Wem ake money on fees, you gamble safely. Deal?'
  //     },
  //     {
  //       title: 'ZERO INSIDERS',
  //       description: 'Enough with the inside info or free allo. Anyone buy on market and gets in at the price they deserve.'
  //     },
  //     {
  //       title: '100% COMMITMENT',
  //       description: 'We know how to dev, we intend to do our job properly. Content, partnerships, everything that\'s needed to make it work.'
  //     },
  //     {
  //       title: 'RESEARCH',
  //       description: 'We will never launch cheap narratives: all tokens from PVE Studio have proper research and are built for the long-term.'
  //     }
  //   ]
  // },

  // Features section
  features: {
    title: 'What we **promise**',
    items: [
      {
        title: '**ZERO BUNDLES**',
        description: 'We will never bundle, snipe, or trade our own tokens. **We make money on fees**, you gamble safely. Deal?'
      },
      {
        title: '**ZERO INSIDERS**',
        description: 'Enough with the inside info or free allo. **Anyone buys on market** and gets in at the price they deserve.'
      },
      {
        title: '**100% COMMITMENT**',
        description: 'We know how to dev properly. **Narrative, content, listings**, and creative stunts to make our coins stand out.'
      },
      {
        title: '**RESEARCH**',
        description: 'We will never launch cheap narratives: all tokens from PVE Studio have **proper research** and are built for the long-term.'
      }
    ]
  },

  // Testimonials section
  testimonials: {
    tweets: [
      {
        tweetId: '1880413151738347743', // Replace with actual tweet ID
        author: '@0x_Prototype',
        text: `Onchain on sol 

Farm 
Farm 
some random FNF scam
Farm 
Random FNF cook coin that tops at low millions
5 sniped coins that go to 0 
Farm 
10 kol PNDs
Farm farm 
Some ai “experimental” coin 
Farm 
Farm 
Same team farming their coin for 2 weeks 
And then one random blessed runner`
      },
      {
        tweetId: '1965084496728150360', // Replace with actual tweet ID
        author: '@0xRiver8',
        text: `Love seeing devs getting rewarded for rugging constantly taking more fees as traders just get nothing`
      },
      {
        tweetId: '1934728461874287072', // Replace with actual tweet ID
        author: '@Jeremyybtc',
        text: `Save the trenches!`
      },
      {
        tweetId: '1960287465744281755', // Replace with actual tweet ID
        author: '@W0LF0FCRYPT0',
        text: `The Trenches are more fun when the prices of tokens with organic & real communities go up in price 

Not celebrity launches ❌

Not cabal launches ❌

The only way to bring back the trenches is support communities grinding hard daily on the timeline.`
      }
    ]
  },

  // Pricing section
  pricing: {
    title: 'THE PVE WAY',
    plans: [
      {
        name: '',
        price: 'PVE TOKENS',
        period: '',
        features: [
          'coming soon',
          'coming soon',
          'coming soon'
        ],
        ctaText: 'check\'em out',
        highlighted: true
      }
    ]
  },

  // FAQ section
  faq: {
    title: 'FAQs',
    questions: [
      {
        question: 'Is it mobile-first?',
        answer: 'Yes. The layout is designed from small to large screens with fluid spacing.'
      },
      {
        question: 'Can I change colors?',
        answer: 'All colors live in Tailwind config and CSS variables for quick updates.'
      },
      {
        question: 'Is it accessible?',
        answer: 'Typography, contrast, and keyboard navigation follow WCAG 2.2 guidance.'
      }
    ]
  },

  // Final CTA section
  finalCta: {
    headline: 'Join the PVE',
    description: 'Start trading safely today!',
    ctaButton: {
      text: 'Get Started',
      href: '#'
    }
  },

  // Footer
  footer: {
    logo: {
      src: '/logo-glow.png',
      alt: 'Logo'
    },
    copyright: `© ${new Date().getFullYear()} PVE Studios, Inc.`,
    links: [
      { text: 'How it works', href: '#features' },
      { text: 'Our coins', href: '#pricing' },
      { text: 'FAQs', href: '#faq' }
    ]
  }
};
