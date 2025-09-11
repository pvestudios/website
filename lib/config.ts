import { SiteConfig } from './types';

export const CONFIG: SiteConfig = {
  // Site metadata
  site: {
    name: 'PVE Studios',
    url: 'https://pve.studio',
    description: 'Up & to the right',
    ogImage: '/og-image.png',
    themeColor: '#00040d'
  },

  // Wallet address used by copy buttons
  walletAddress: 'DEVWALLET',

  // Navigation
  nav: {
    logo: '/logo-glow.png',
    logoAlt: 'PVE Studios Logo',
    brandName: 'PVE Studios',
    links: [
      { text: 'the PVE way', href: '#features' },
      { text: 'tokens', href: '#pricing' },
      { text: 'faqs', href: '#faq' }
    ],
    ctaButton: {
      text: 'ape now',
      href: '#pricing'
    }
  },

  // Hero section
  hero: {
    tagline: 'PVE STUDIOS',
    headline: 'we launch **organic runners** you can trust',
    subheadline: 'no bundles, no insiders, no bullshit – FAIR for everyone. we focus on **building**, you focus on **trading safely**. easy as that.',
    primaryCta: {
      text: 'ape now',
      href: '#pricing'
    },
    secondaryCta: {
      text: 'why trust PVE?',
      href: '#problem'
    },
    logo: {
      src: '/logo-glow.png',
      alt: 'PVE Studios Logo'
    }
  },

  // Problem section
  problem: {
    title: 'what tf is wrong with the **trenches**?!',
    description: `yeah, **99% of tokens** out there are straight-up scams.
    
devs don't care about building, they care about **squeezing every last drop** out of you.

they launch, they farm, they dump, and they get paid to do so (gm, creator fees).

what about you, the **trader**? You're already taking the risk of gambling.

and scams on top of that? **Rug after rug after rug**? that's straight robbery.

it doesn't have to be this way. You deserve a **fair shot** in the trenches.

you deserve a place where devs dev, and traders trade — without someone picking your pockets at every turn.

that's where **PVE Studios** comes in.`
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
    title: 'what we **promise**',
    items: [
      {
        title: '**ZERO BUNDLES**',
        description: 'we will never bundle, snipe, or trade our own tokens. **we make money on fees**, you gamble safely. deal?'
      },
      {
        title: '**ZERO INSIDERS**',
        description: 'enough with the inside info or free allo. **anyone buys on market** and gets in at the price they deserve.'
      },
      {
        title: '**FULL COMMITMENT**',
        description: 'we know how to dev properly. **narrative, content, listings**, and creative stunts to make our coins stand out.'
      },
      {
        title: '**100% REAL NARRATIVES**',
        description: 'we will never launch cheap narratives: all tokens from PVE Studio have **proper research** and are built for the long-term.'
      }
    ]
  },

  // Testimonials section
  testimonials: {
    title: 'we are all fed up!',
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
    title: 'Our Tokens',
    plans: [
      {
        name: 'PVE Genesis',
        price: 'Coming soon',
        period: '',
        features: [
          'Fair launch',
          'No bundles',
          'Banger meme'
        ],
        ctaText: 'View on Solscan',
        highlighted: true
      }
    ]
  },

  // FAQ section
  faq: {
    title: 'FAQs',
    questions: [
      {
        question: 'Does this mean the coin will only go up?',
        answer: 'No. Markets are volatile and risky. We don\'t control price action and we don\'t promise performance.'
      },
      {
        question: 'Is this financial advice?',
        answer: 'No. Nothing here is investment advice. Do your own research and never risk more than you can afford to lose.'
      },
      {
        question: 'Can I lose money?',
        answer: 'Yes. Tokens can go to zero. Liquidity can change quickly. Treat everything here as experimental and high‑risk.'
      },
      {
        question: 'Do you guarantee pumps or floors?',
        answer: 'No. We focus on fair launches and transparency (no bundles, no insiders). Outcomes are up to the market.'
      },
      {
        question: 'Do you bundle, snipe, or trade your own tokens?',
        answer: 'NEVER. At the same time you should always DYOR as there is no way for us to avoid other people from sniping or multiwalleting.'
      }
    ]
  },

  // Final CTA section
  finalCta: {
    headline: 'join the PVE',
    description: 'the trenches can be saved',
    ctaButton: {
      text: 'follow us',
      href: 'https://x.com/PVEStudioInc'
    }
  },

  // Footer
  footer: {
    logo: {
      src: '/logo-glow.png',
      alt: 'Logo'
    },
    copyright: `© 2025 PVE Studios, Inc.`,
    links: [
      { text: 'the PVE way', href: '#features' },
      { text: 'tokens', href: '#pricing' },
      { text: 'faqs', href: '#faq' }
    ]
  }
};
