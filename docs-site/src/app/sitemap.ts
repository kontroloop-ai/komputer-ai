import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';

const BASE = 'https://komputer-ai.github.io/komputer-ai';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const docs = source.getPages().map((page) => ({
    url: `${BASE}${page.url}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: page.url === '/docs' ? 0.9 : 0.7,
  }));
  return [
    {
      url: `${BASE}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...docs,
  ];
}
