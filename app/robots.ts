import type { MetadataRoute } from 'next';
import { canonicalBase } from '@/lib/seo';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${canonicalBase}/sitemap.xml`,
    host: canonicalBase,
  };
}
