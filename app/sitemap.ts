import { CONFIG } from '@/lib/config';

export default function sitemap() {
  return [
    { url: CONFIG.site.url + '/', changefreq: 'weekly', priority: 0.8 }
  ];
}


