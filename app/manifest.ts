import type {MetadataRoute} from 'next';
import {DEFAULT_DESCRIPTION, SITE_NAME, THEME_COLOR} from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Court Competitor`,
    short_name: SITE_NAME,
    description: DEFAULT_DESCRIPTION,
    start_url: '/home/',
    display: 'standalone',
    background_color: '#f5f7ee',
    theme_color: THEME_COLOR,
    icons: [
      {
        src: '/favicon.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
