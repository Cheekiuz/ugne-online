import type {MetadataRoute} from 'next';
import {SITE_ROUTES, siteUrl} from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return SITE_ROUTES.map((route) => ({
    url: siteUrl(route.path),
    changeFrequency: 'monthly',
    priority: route.path === '/' ? 1 : 0.8,
  }));
}
