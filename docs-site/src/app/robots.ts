import type { MetadataRoute } from 'next';

const BASE = 'https://komputer-ai.github.io/komputer-ai';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
