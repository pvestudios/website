# Contemporary One‑Pager (Next.js + Tailwind + Inter)

A clean, accessible 2025‑grade landing page scaffold using your neon glow palette.

## Quickstart

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Customization

All copywriting, links, and content can be easily customized by editing the single configuration file:

**`lib/config.ts`** - This file contains all the text, links, and content for the entire landing page. You can modify:

- Site metadata (name, description, URL)
- Navigation links and text
- Hero section content
- Problem statement
- Solution benefits
- Features list
- Testimonials
- Pricing plans
- FAQ questions and answers
- Footer content

### Key Customization Areas:

1. **Brand Identity**: Update `site.name`, `site.url`, and logo paths
2. **Content**: Modify all text content in the respective sections
3. **Links**: Update all href values to point to your actual pages/forms
4. **Pricing**: Adjust plan names, prices, and features
5. **Colors**: Edit `tailwind.config.ts` and `app/globals.css` for color changes

## Assets

Replace these placeholder files with your actual assets:

- **`public/logo-glow.png`** - Your glowing arrow logo (512×512 recommended)
- **`public/og-image.png`** - Social preview image (1200×630 recommended)

## Deployment

- **Vercel**: Push to GitHub, import project in Vercel, set framework = Next.js
- **Render/Netlify**: Ensure Node 18+ runtime

## Features

- ✅ Fully responsive (mobile-first design)
- ✅ Neon glow theme with dark aesthetic
- ✅ Fast loading and optimized
- ✅ WCAG 2.2 accessibility compliant
- ✅ SEO ready with meta tags and OG images
- ✅ Smooth scrolling and subtle animations
- ✅ Centralized configuration for easy customization

## Structure

The landing page follows the proven conversion structure:

1. **Hero** - Attention-grabbing headline with CTA
2. **Problem** - Pain point identification
3. **Solution** - Benefits and value proposition
4. **Features** - Key features grid
5. **Testimonials** - Social proof
6. **Pricing** - Clear pricing tiers
7. **FAQ** - Address common concerns
8. **Final CTA** - Conversion-focused closing

## Performance & Accessibility

- Sufficient color contrast on text over dark backgrounds
- Alt text for images, focus states for links and buttons
- Lighthouse Performance ≥ 90: optimize logo size, prefer PNG/WebP
- Respects `prefers-reduced-motion` for accessibility
