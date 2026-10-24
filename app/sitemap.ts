import type { MetadataRoute } from 'next';
import { INITIAL_CRAFTS_24 } from '@/lib/crafts-data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://24crofts.com';
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
  ];

  const craftProfileRoutes: MetadataRoute.Sitemap = INITIAL_CRAFTS_24.map((_, idx) => ({
    url: `${baseUrl}/profile/24C-${1001 + idx * 3}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...craftProfileRoutes];
}
