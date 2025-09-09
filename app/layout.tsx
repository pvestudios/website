import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { CONFIG } from '@/lib/config';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: `${CONFIG.site.name} — Contemporary Landing`,
  description: CONFIG.site.description,
  openGraph: {
    title: `${CONFIG.site.name} — Contemporary Landing`,
    description: CONFIG.site.description,
    images: [CONFIG.site.ogImage],
    type: 'website'
  },
  metadataBase: new URL(CONFIG.site.url),
  themeColor: CONFIG.site.themeColor
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="bg-[#00040d]">
        {children}
      </body>
    </html>
  );
}
