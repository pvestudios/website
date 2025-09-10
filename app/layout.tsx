import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Inter, Sora } from 'next/font/google';
import { CONFIG } from '@/lib/config';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const sora = Sora({ subsets: ['latin'], variable: '--font-display' });

export const metadata: Metadata = {
  title: `${CONFIG.site.name} — PVE Studios`,
  description: CONFIG.site.description,
  metadataBase: new URL(CONFIG.site.url),
  alternates: { canonical: CONFIG.site.url },
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      '/favicon.ico'
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  openGraph: {
    title: `${CONFIG.site.name} — PVE Studios`,
    description: CONFIG.site.description,
    images: [CONFIG.site.ogImage],
    type: 'website',
    url: CONFIG.site.url
  },
  twitter: {
    card: 'summary_large_image',
    title: `${CONFIG.site.name} — PVE Studios`,
    description: CONFIG.site.description,
    images: [CONFIG.site.ogImage]
  },
  robots: { index: true, follow: true }
};

export const viewport: Viewport = {
  themeColor: CONFIG.site.themeColor,
  viewportFit: 'cover'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${inter.className}`}>
      <body className="bg-[#00040d]">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-zinc-900 focus:text-white focus:px-3 focus:py-2 focus:ring-2 focus:ring-brand-500">Skip to content</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: CONFIG.site.name,
              url: CONFIG.site.url,
              logo: "/logo-glow.png"
            })
          }}
        />
        {children}
      </body>
    </html>
  );
}
